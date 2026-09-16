"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { connect, disconnect, isConnected } from "../../src/voice/voiceAgent.js";
import {
  startMicrophone,
  stopMicrophone,
  isMicrophoneActive,
} from "../../src/voice/microphone.js";
import { startStreaming, stopStreaming } from "../../src/voice/voiceAudio.js";
import {
  prepareReplyAudio,
  playReplyAudio,
  flushReplyAudio,
  stopReplyAudio,
} from "../../src/voice/replyAudio.js";

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
  const userDraftRef = useRef("");
  const agentDraftRef = useRef("");

  const appendTurn = useCallback((speaker: VoiceTurn["speaker"], text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTurns((current) => [...current, { id: createTurnId(), speaker, text: trimmed }]);
  }, []);

  const handleUserTranscript = useCallback(({ text, isFinal }: { text: string; isFinal: boolean }) => {
    if (!isFinal) {
      userDraftRef.current = userDraftRef.current
        ? `${userDraftRef.current} ${text}`
        : text;
      setUserDraft(userDraftRef.current);
      return;
    }

    userDraftRef.current = "";
    setUserDraft("");
    appendTurn("user", text);
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
    error,
    isConnected: connectionState === "connected",
    start,
    stop,
  };
}
