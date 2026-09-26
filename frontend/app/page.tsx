"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, CircleHelp, LockKeyhole, Sparkles } from "lucide-react";
import MicButton, { type MicState } from "@/components/MicButton";
import TranscriptPanel from "@/components/TranscriptPanel";
import GraphView, { type MemoryGraph } from "@/components/GraphView";
import SuggestionCard from "@/components/SuggestionCard";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

type ApiGraph = { nodes: { id: string; title: string; content?: string; type: string }[]; edges: { source: string; target: string }[] };

export default function Home() {
  const [graph, setGraph] = useState<MemoryGraph>({ nodes: [], edges: [] });
  const [memoryStatus, setMemoryStatus] = useState("");
  const [graphError, setGraphError] = useState("");
  const loadGraph = useCallback(async () => {
    try {
      const response = await fetch("/api/memory/graph", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load your memory graph.");
      const data = await response.json() as ApiGraph;
      if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) throw new Error("Invalid memory graph response.");
      setGraph({ nodes: data.nodes.map(node => ({ id: node.id, name: node.title || node.content || "Untitled memory", type: node.type, detail: node.content })), edges: data.edges.map(edge => ({ source: edge.source, target: edge.target })) });
      setGraphError("");
    } catch (error) {
      setGraphError(error instanceof Error ? error.message : "Could not load your memory graph.");
    }
  }, []);
  useEffect(() => { void loadGraph(); }, [loadGraph]);
  const rememberTranscript = useCallback((transcript: string) => {
    setMemoryStatus("Saving memory…");
    void (async () => {
      try {
        const response = await fetch("/api/memory/remember", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript }) });
        const result = await response.json();
        if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Could not save your memory.");
        await loadGraph();
        setMemoryStatus("Memory saved.");
      } catch (error) {
        setMemoryStatus(error instanceof Error ? error.message : "Could not save your memory.");
      }
    })();
  }, [loadGraph]);
  const voice = useVoiceAgent(rememberTranscript);
  const micState: MicState = voice.connectionState === "connected"
    ? "listening"
    : voice.connectionState === "connecting"
      ? "processing"
      : voice.connectionState === "error"
        ? "error"
        : "idle";

  const handleMic = () => {
    if (voice.isConnected) {
      voice.stop();
    } else {
      void voice.start();
    }
  };

  return <main className="ambient min-h-screen">
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <header className="flex h-20 items-center justify-between border-b border-white/[.07]"><a href="#top" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400 text-[#171324]"><BrainCircuit className="h-5 w-5" strokeWidth={2.2} /></span><span className="text-xl font-bold tracking-tight">echo<span className="text-violet-400">mind</span><span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-[.2em] text-zinc-600">beta</span></span></a><a href="#memory-graph" className="hidden items-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:flex">Explore memories <ArrowRight className="h-4 w-4" /></a><span className="flex items-center gap-2 text-xs text-zinc-500 sm:hidden"><LockKeyhole className="h-3.5 w-3.5" /> Private space</span></header>
      <section id="top" className="mx-auto max-w-3xl pb-14 pt-16 text-center sm:pt-20"><div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.07] px-4 py-2 text-xs font-medium text-violet-300"><Sparkles className="h-3.5 w-3.5" /> A second brain that listens</div><h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.055em] text-white sm:text-6xl">The little things matter.<br /><span className="text-zinc-500">We remember them.</span></h1><p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">Speak naturally about your day. EchoMind connects the people, plans and promises you mention, so they&apos;re there when you need them.</p><div className="mt-12"><MicButton state={micState} onClick={handleMic} /></div><TranscriptPanel turns={voice.turns} userDraft={voice.userDraft} agentDraft={voice.agentDraft} state={micState} />{voice.error && <p role="status" className="mt-3 text-sm text-amber-300">{voice.error}</p>}{memoryStatus && <p role="status" className="mt-3 text-sm text-violet-300">{memoryStatus}</p>}</section>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(310px,1fr)]"><GraphView nodes={graph.nodes} edges={graph.edges} />{graphError && <p role="alert" className="mt-3 text-sm text-amber-300">{graphError}</p>}<div className="flex flex-col gap-5"><SuggestionCard suggestion={null} onConfirm={() => undefined} onDismiss={() => undefined} /><section className="flex flex-1 flex-col justify-between rounded-3xl border border-white/[.08] bg-[#11141e] p-6 sm:p-7"><div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232a34] text-[#9db4cb]"><CircleHelp className="h-5 w-5" /></div><p className="mt-5 text-[11px] font-semibold uppercase tracking-[.2em] text-zinc-500">How it works</p><h2 className="mt-2 text-xl font-semibold text-white">Your life, in context.</h2><p className="mt-3 text-sm leading-7 text-zinc-400">EchoMind turns everyday conversations into connected memories, then offers a helpful nudge when something needs your attention.</p></div><div className="mt-8 flex items-center gap-2 border-t border-white/[.07] pt-5 text-xs text-zinc-500"><LockKeyhole className="h-4 w-4" /> Memories are stored in your connected database</div></section></div></section>
      <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[.07] pt-6 text-xs text-zinc-600"><span>© 2026 EchoMind</span><span>Made for the moments you don&apos;t want to forget.</span></footer>
    </div>
  </main>;
}
