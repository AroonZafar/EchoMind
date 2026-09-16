/**
 * voiceAgent.js — Browser ES module
 *
 * Manages the AssemblyAI Voice Agent WebSocket connection.
 * The permanent API key NEVER appears here — it stays server-side in .env.
 * This module only uses the short-lived token returned by the local token server.
 *
 * Public API:
 *   connect(handlers)  → Promise<sessionReadyPayload>
 *   disconnect()       → void
 *   isConnected()      → boolean
 *   sendAudio(base64)  → void   (Step 7 — sends input.audio; no-op if not ready)
 *   reply.audio        → forwarded as base64 data to the playback handler
 */

const TOKEN_ENDPOINT = "http://localhost:3001/api/voice-token";
const ASSEMBLYAI_WS_BASE = "wss://agents.assemblyai.com/v1/ws";

/**
 * Minimal session configuration sent to AssemblyAI immediately after the
 * WebSocket opens. AssemblyAI requires this before it will emit session.ready.
 * Only the fields needed to establish a valid session are included here;
 * future steps (persona, tools, etc.) will extend this object.
 */
const SESSION_UPDATE = {
  type: "session.update",
  session: {
    system_prompt: "You are EchoMind, a helpful personal memory assistant.",
    greeting: "Hello! EchoMind is ready.",
    output: {
      voice: "anna",
    },
  },
};

/** @type {WebSocket|null} */
let ws = null;

/** Reply IDs that AssemblyAI has marked interrupted. */
const interruptedReplyIds = new Set();

/**
 * Fetch a short-lived token from the local token server.
 * @returns {Promise<string>} temporary token
 */
async function fetchToken() {
  const response = await fetch(TOKEN_ENDPOINT);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token request failed (${response.status}): ${body}`);
  }
  const data = await response.json();
  if (!data.token) {
    throw new Error("Token response did not contain a token field");
  }
  return data.token;
}

/**
 * Connect to the AssemblyAI Voice Agent WebSocket.
 *
 * AssemblyAI Voice Agent user-speech transcript event types (confirmed):
 *   transcript.user.delta  — partial/incremental word(s) while user is speaking
 *                            { type, delta, start_ms, end_ms, ... }
 *   transcript.user        — final committed transcript for one user utterance
 *                            { type, text, ... }
 *
 * @param {object} [handlers]
 * @param {function} [handlers.onSessionReady]    - Called when session.ready is received
 * @param {function} [handlers.onMessage]         - Called for every message (for future steps)
 * @param {function} [handlers.onUserTranscript]  - Called with { text, isFinal } for user speech
 * @param {function} [handlers.onAgentResponse]   - Called with { text, isFinal } for agent speech
 * @param {function} [handlers.onAgentAudio]      - Called with reply.audio data
 * @param {function} [handlers.onError]           - Called on WebSocket error
 * @param {function} [handlers.onClose]           - Called when the connection closes
 * @returns {Promise<object>} Resolves with the session.ready payload
 */
async function connect(handlers = {}) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    throw new Error("Already connected. Call disconnect() first.");
  }

  const token = await fetchToken();
  const url = `${ASSEMBLYAI_WS_BASE}?token=${encodeURIComponent(token)}`;

  return new Promise((resolve, reject) => {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("[voiceAgent] WebSocket open — sending session.update");
      ws.send(JSON.stringify(SESSION_UPDATE));
    };

    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        console.warn("[voiceAgent] Non-JSON message received:", event.data);
        return;
      }

      // Do not log reply.audio payloads because they contain base64 audio data.
      if (msg.type === "reply.audio") {
        console.log("[voiceAgent] event received: reply.audio");
      } else {
        console.log("[voiceAgent] event received:", msg.type, msg);
      }

      if (handlers.onMessage) {
        handlers.onMessage(msg);
      }

      // ── Step 8: user speech transcript ─────────────────────────────────────
      // transcript.user.delta — partial word(s) streamed while user is speaking
      if (msg.type === "transcript.user.delta") {
        const text = (msg.delta || "").trim();
        if (text && handlers.onUserTranscript) {
          try {
            handlers.onUserTranscript({ text, isFinal: false });
          } catch (err) {
            console.warn("[voiceAgent] onUserTranscript handler threw:", err);
          }
        }
        return;
      }

      // transcript.user — final committed transcript for one user utterance
      if (msg.type === "transcript.user") {
        const text = (msg.text || "").trim();
        if (text && handlers.onUserTranscript) {
          try {
            handlers.onUserTranscript({ text, isFinal: true });
          } catch (err) {
            console.warn("[voiceAgent] onUserTranscript handler threw:", err);
          }
        }
        return;
      }

      if (msg.type === "reply.started") {
        console.log("[voiceAgent] agent reply started", msg);
        return;
      }

      if (msg.type === "reply.audio") {
        if (!interruptedReplyIds.has(msg.reply_id) && msg.data && handlers.onAgentAudio) {
          handlers.onAgentAudio(msg.data, msg.reply_id);
        }
        return;
      }

      if (msg.type === "transcript.agent.delta") {
        const text = (msg.delta || msg.text || "").trim();
        if (text && handlers.onAgentResponse) {
          handlers.onAgentResponse({ text, isFinal: false });
        }
        return;
      }

      if (msg.type === "transcript.agent") {
        const text = (msg.text || msg.transcript || "").trim();
        if (text && handlers.onAgentResponse) {
          handlers.onAgentResponse({ text, isFinal: true });
        }
        return;
      }

      if (msg.type === "reply.done") {
        console.log("[voiceAgent] agent reply done", msg);
        if (msg.status === "interrupted") {
          if (msg.reply_id) {
            interruptedReplyIds.add(msg.reply_id);
          }
          if (handlers.onReplyInterrupted) {
            handlers.onReplyInterrupted(msg.reply_id);
          }
        }
        return;
      }

      if (msg.type === "session.ready") {
        console.log("[voiceAgent] session.ready received", msg);
        if (handlers.onSessionReady) {
          handlers.onSessionReady(msg);
        }
        resolve(msg);
        return;
      }

      if (msg.type === "session.error") {
        const errMsg = (msg.error && msg.error.message) || JSON.stringify(msg);
        console.error("[voiceAgent] session.error:", errMsg);
        if (handlers.onError) {
          handlers.onError(new Error(errMsg));
        }
        reject(new Error(`session.error: ${errMsg}`));
        return;
      }
    };

    ws.onerror = (event) => {
      console.error("[voiceAgent] WebSocket error", event);
      if (handlers.onError) {
        handlers.onError(event);
      }
      reject(new Error("AssemblyAI WebSocket error"));
    };

    ws.onclose = (event) => {
      console.log(`[voiceAgent] WebSocket closed (code=${event.code})`);
      if (handlers.onClose) {
        handlers.onClose(event);
      }
      ws = null;
    };
  });
}

/**
 * Close the AssemblyAI Voice Agent WebSocket if it is open.
 */
function disconnect() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  ws = null;
}

/**
 * Returns true if the WebSocket is currently open.
 * @returns {boolean}
 */
function isConnected() {
  return ws !== null && ws.readyState === WebSocket.OPEN;
}

/**
 * Send a base64-encoded PCM16 audio chunk to the AssemblyAI Voice Agent.
 * No-op if the WebSocket is not open.
 * The caller is responsible for gating on session.ready before calling this.
 *
 * @param {string} base64Audio  Base64-encoded PCM16 mono 24 kHz audio
 */
function sendAudio(base64Audio) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }
  ws.send(JSON.stringify({ type: "input.audio", audio: base64Audio }));
}

export { connect, disconnect, isConnected, sendAudio };
