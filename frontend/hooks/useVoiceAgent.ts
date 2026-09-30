"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connect, disconnect, isConnected } from "@/lib/voice/voiceAgent.js";
import {
  startMicrophone,
  stopMicrophone,
  isMicrophoneActive,
} from "@/lib/voice/microphone.js";
import { startStreaming, stopStreaming } from "@/lib/voice/voiceAudio.js";
import {
  prepareReplyAudio,
  playReplyAudio,
  flushReplyAudio,
  stopReplyAudio,
} from "@/lib/voice/replyAudio.js";

export type VoiceTurn = {
  id: string;
  speaker: "user" | "agent";
  text: string;
};

export type VoiceConnectionState =
  | "ready"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type VoiceMicrophoneState = "off" | "starting" | "on" | "error";

export type RememberResponse = {
  extracted: unknown;
  saved_memories: unknown[];
  saved_relations: unknown[];
};

function createTurnId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useVoiceAgent() {
  const [connectionState, setConnectionState] = useState<VoiceConnectionState>("ready");
  const [microphoneState, setMicrophoneState] = useState<VoiceMicrophoneState>("off");
  const [turns, setTurns] = useState<VoiceTurn[]>([]);
  const [userDraft, setUserDraft] = useState("");
  const [agentDraft, setAgentDraft] = useState("");
  const [error, setError] = useState("");
  const [rememberResponses, setRememberResponses] = useState<RememberResponse[]>([]);
  const userDraftRef = useRef("");
  const agentDraftRef = useRef("");
  const lastFinalUserTranscriptRef = useRef<string | null>(null);
  // Memory saves run one at a time so slow responses never pile up and
  // overload the backend; the voice conversation never waits on them.
  const rememberQueueRef = useRef<Promise<void>>(Promise.resolve());

  const appendTurn = useCallback((speaker: VoiceTurn["speaker"], text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTurns((current) => [...current, { id: createTurnId(), speaker, text: trimmed }]);
  }, []);

  const handleUserTranscript = useCallback(async ({ text, isFinal }: { text: string; isFinal: boolean }) => {
    if (!isFinal) {
      lastFinalUserTranscriptRef.current = null;
      userDraftRef.current = userDraftRef.current
        ? `${userDraftRef.current} ${text}`
        : text;
      setUserDraft(userDraftRef.current);
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText || lastFinalUserTranscriptRef.current === trimmedText) return;

    lastFinalUserTranscriptRef.current = trimmedText;
    userDraftRef.current = "";
    setUserDraft("");
    appendTurn("user", trimmedText);

    const saveMemory = async () => {
      const response = await fetch("/api/remember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: trimmedText }),
      });
      const responseText = await response.text();
      let responseBody: { error?: string; detail?: string } & Partial<RememberResponse> = {};
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        throw new Error(`Memory service returned an invalid response (HTTP ${response.status}).`);
      }

      if (!response.ok) {
        const failure = new Error(responseBody.error ?? responseBody.detail ?? "Could not save memory.") as Error & { status?: number };
        failure.status = response.status;
        throw failure;
      }

      setRememberResponses((current) => [...current, responseBody as RememberResponse]);
    };

    rememberQueueRef.current = rememberQueueRef.current.then(async () => {
      try {
        await saveMemory();
      } catch (firstError) {
        // A timeout means the backend is already busy with this request;
        // retrying would only double the load, so surface it instead.
        const status = (firstError as { status?: number }).status;
        if (status === 504) {
          setError(firstError instanceof Error ? firstError.message : "Could not save memory.");
          return;
        }
        try {
          await saveMemory(); // one retry: the first call often just wakes the service
        } catch (rememberError) {
          const message = rememberError instanceof Error ? rememberError.message : "Could not save memory.";
          setError(message);
        }
      }
    });
  }, [appendTurn]);

  const handleAgentResponse = useCallback(({ text, isFinal }: { text: string; isFinal: boolean }) => {
    if (!isFinal) {
      const needsSpace =
        agentDraftRef.current &&
        !/[\s]$/.test(agentDraftRef.current) &&
        !/^[.,!?;:)]/.test(text);
      agentDraftRef.current += `${needsSpace ? " " : ""}${text}`;
      setAgentDraft(agentDraftRef.current);
      return;
    }

    agentDraftRef.current = "";
    setAgentDraft("");
    appendTurn("agent", text);
  }, [appendTurn]);

  const clearDrafts = useCallback(() => {
    userDraftRef.current = "";
    agentDraftRef.current = "";
    setUserDraft("");
    setAgentDraft("");
  }, []);

  const stop = useCallback(() => {
    stopStreaming();
    stopMicrophone();
    stopReplyAudio();
    disconnect();
    clearDrafts();
    setMicrophoneState("off");
    setConnectionState("disconnected");
  }, [clearDrafts]);

  const start = useCallback(async () => {
    if (isConnected() || isMicrophoneActive()) return;

    setError("");
    setConnectionState("connecting");
    setMicrophoneState("starting");
    void prepareReplyAudio();

    try {
      await startMicrophone();
      setMicrophoneState("on");

      await connect({
        onSessionReady: async () => {
          setConnectionState("connected");
          try {
            await startStreaming();
          } catch (startError) {
            const message = startError instanceof Error ? startError.message : "Could not start audio streaming.";
            setError(message);
            setMicrophoneState("error");
          }
        },
        onUserTranscript: handleUserTranscript,
        onAgentResponse: handleAgentResponse,
        onAgentAudio: (data: string) => playReplyAudio(data),
        onReplyInterrupted: () => {
          flushReplyAudio();
          agentDraftRef.current = "";
          setAgentDraft("");
        },
        onError: (voiceError: unknown) => {
          const message = voiceError instanceof Error ? voiceError.message : "Voice connection failed.";
          setError(message);
          setConnectionState("error");
          stopStreaming();
          stopMicrophone();
          stopReplyAudio();
          setMicrophoneState("off");
          clearDrafts();
        },
        onClose: () => {
          stopStreaming();
          stopReplyAudio();
          setConnectionState("disconnected");
          setMicrophoneState("off");
          clearDrafts();
        },
      });
    } catch (startError) {
      const message = startError instanceof Error ? startError.message : "Could not connect to Voice Agent.";
      setError(message);
      setConnectionState("error");
      stopStreaming();
      stopMicrophone();
      stopReplyAudio();
      setMicrophoneState("off");
    }
  }, [clearDrafts, handleAgentResponse, handleUserTranscript]);

  useEffect(() => () => {
    stopStreaming();
    stopMicrophone();
    stopReplyAudio();
    disconnect();
  }, []);

  return {
    connectionState,
    microphoneState,
    turns,
    userDraft,
    agentDraft,
    rememberResponses,
    error,
    isConnected: connectionState === "connected",
    start,
    stop,
  };
}
