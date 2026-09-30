"use client";

import { ArrowRight, BrainCircuit, CircleHelp, LockKeyhole, RefreshCw, Search, Sparkles } from "lucide-react";
import MicButton, { type MicState } from "@/components/MicButton";
import TranscriptPanel from "@/components/TranscriptPanel";
import GraphView, { type MemoryGraph } from "@/components/GraphView";
import SuggestionCard, { type Suggestion } from "@/components/SuggestionCard";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { useCallback, useEffect, useRef, useState } from "react";

type ApiMemory = { id: string; title: string; type: string; content?: Record<string, unknown>; status: string };
type ApiRelation = { source: string; target: string; relation_type?: string };
type ApiGraph = { nodes: ApiMemory[]; edges: ApiRelation[] };

const emptyGraph: MemoryGraph = { nodes: [], edges: [] };

function normalizeType(type: string): "Person" | "Task" | "Event" | "Fact" | "Preference" | "Conversation" | "Note" | "Raw" {
  const value = type.toLowerCase();
  if (value === "person") return "Person";
  if (value === "task") return "Task";
  if (value === "event") return "Event";
  if (value === "preference") return "Preference";
  if (value === "conversation") return "Conversation";
  if (value === "note") return "Note";
  if (value === "raw") return "Raw";
  return "Fact";
}

function toGraph(data: ApiGraph): MemoryGraph {
  return {
    nodes: data.nodes.map((memory) => ({
      id: memory.id,
      name: memory.title,
      type: normalizeType(memory.type),
      detail: memory.status,
    })),
    edges: data.edges.map((relation) => ({
      source: relation.source,
      target: relation.target,
      relationType: relation.relation_type,
    })),
  };
}

function memoryDetail(memory: ApiMemory) {
  if (!memory.content) return "";
  return Object.values(memory.content).filter(Boolean).join(" · ");
}

export default function Home() {
  const voice = useVoiceAgent();
  const [graph, setGraph] = useState<MemoryGraph>(emptyGraph);
  const [memories, setMemories] = useState<ApiMemory[]>([]);
  const [searchResults, setSearchResults] = useState<ApiMemory[]>([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searching, setSearching] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "complete" | "forget" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [status, setStatus] = useState("");
  const [controlsNote, setControlsNote] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [findingSuggestion, setFindingSuggestion] = useState(false);
  const [loading, setLoading] = useState(true);
  const micState: MicState = voice.connectionState === "connected"
    ? "listening"
    : voice.connectionState === "connecting"
      ? "processing"
      : voice.connectionState === "error"
        ? "error"
        : "idle";

  const voiceActiveRef = useRef(false);
  voiceActiveRef.current = voice.connectionState === "connecting" || voice.connectionState === "connected";

  const handleMic = () => {
    if (voice.isConnected) {
      voice.stop();
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      void voice.start();
    }
  };

  const lastGraphSignature = useRef("");
  const loadMemories = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try {
      const response = await fetch("/api/graph", { cache: "no-store" });
      const data = await response.json() as ApiGraph & { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load memories.");
      // Skip state updates when nothing changed, so the graph is not re-created
      // and its force simulation is not re-heated (which janks audio playback).
      const signature = JSON.stringify(data);
      if (signature !== lastGraphSignature.current) {
        lastGraphSignature.current = signature;
        setGraph(toGraph(data));
        setMemories(data.nodes);
      }
      return true;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load memories.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMemories(voice.rememberResponses.length > 0); }, [loadMemories, voice.rememberResponses.length]);

  const searchMemories = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchActive(false);
      setSearchResults([]);
      return;
    }
    setSearching(true);
    setStatus("");
    try {
      const response = await fetch("/api/memory/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Search failed.");
      setSearchResults(data.results || []);
      setSearchActive(true);
      setSelectedMemoryId(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const updateMemory = async (path: string, memoryId: string) => {
    if (pendingAction) return;
    const action = path === "/api/complete" ? "complete" : "forget";
    setPendingAction({ id: memoryId, action });
    setStatus(action === "complete" ? "Marking memory as completed…" : "Forgetting memory…");
    try {
      const response = await fetch(path, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memory_id: memoryId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.detail || "Memory update failed.");
      const updated = memories.flatMap(memory => memory.id !== memoryId ? [memory] : action === "forget" ? [] : [{ ...memory, status: "completed" }]);
      setMemories(updated);
      setGraph(current => ({
        nodes: action === "forget" ? current.nodes.filter(node => node.id !== memoryId) : current.nodes.map(node => node.id === memoryId ? { ...node, detail: "completed" } : node),
        edges: action === "forget" ? current.edges.filter(edge => edge.source !== memoryId && edge.target !== memoryId) : current.edges,
      }));
      setSearchActive(false);
      setSearchResults([]);
      setSearchQuery("");
      setSelectedMemoryId(null);
      const refreshed = await loadMemories();
      const message = action === "complete" ? "Memory marked as completed." : "Memory forgotten.";
      setStatus(refreshed ? message : `${message} Could not refresh the list; try Refresh.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Memory update failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const spokenSuggestions = useRef(new Set<string>());
  const speakSuggestion = (id: string, text: string) => {
    if (spokenSuggestions.current.has(id)) return;
    if (voiceActiveRef.current) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    spokenSuggestions.current.add(id);
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  // force=true: manual button (bypasses cooldown). force=false: background polling.
  const loadSuggestion = async (force = false): Promise<"found" | "none" | "error"> => {
    try {
      const response = await fetch("/api/suggestions/relevance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: searchQuery, force }),
      });
      const data = await response.json() as { suggestions?: Array<{ suggestion_id: string; message: string; reason: string }>; error?: string };
      if (!response.ok) { if (force) setStatus(data.error || "Suggestions unavailable."); return "error"; }
      const item = data.suggestions?.[0];
      if (item) {
        setSuggestion({ id: item.suggestion_id, text: item.message, context: item.reason });
        speakSuggestion(item.suggestion_id, item.message);
        return "found";
      }
      if (force) setSuggestion(null);
      return "none";
    } catch {
      if (force) setStatus("Suggestions unavailable.");
      return "error";
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setControlsNote("");
    setStatus("");
    const ok = await loadMemories();
    setControlsNote(ok ? "Memories refreshed." : "Could not refresh memories.");
    setRefreshing(false);
  };

  const handleFindSuggestion = async () => {
    setFindingSuggestion(true);
    setControlsNote("");
    setStatus("");
    const result = await loadSuggestion(true);
    setControlsNote(
      result === "found" ? "New suggestion ready." : result === "none" ? "No suggestion right now." : "",
    );
    setFindingSuggestion(false);
  };

  // Proactive suggestions: check every 45s without user action.
  useEffect(() => {
    const timer = setInterval(() => { void loadSuggestion(false); }, 45000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const updateSuggestion = async (path: string) => {
    if (!suggestion) return;
    setStatus("");
    setControlsNote("");
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion_id: suggestion.id }),
      });
      if (!response.ok) {
        let detail = "";
        try {
          const data = await response.json() as { error?: string; detail?: string };
          detail = data.error || data.detail || "";
        } catch {
          // Non-JSON error body (for example an HTML error page).
        }
        setStatus(`Suggestion update failed (HTTP ${response.status})${detail ? `: ${detail}` : ""}.`);
        return;
      }
      setSuggestion(null);
    } catch {
      setStatus("Suggestion update failed: could not reach the server.");
    }
  };

  return <main className="ambient min-h-screen">
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <header className="flex h-20 items-center justify-between border-b border-white/[.07]"><a href="#top" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400 text-[#171324]"><BrainCircuit className="h-5 w-5" strokeWidth={2.2} /></span><span className="text-xl font-bold tracking-tight">echo<span className="text-violet-400">mind</span><span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-[.2em] text-zinc-600">beta</span></span></a><a href="#memory-graph" className="hidden items-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:flex">Explore memories <ArrowRight className="h-4 w-4" /></a><span className="flex items-center gap-2 text-xs text-zinc-500 sm:hidden"><LockKeyhole className="h-3.5 w-3.5" /> Private space</span></header>
      <section id="top" className="mx-auto max-w-3xl pb-14 pt-16 text-center sm:pt-20"><div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.07] px-4 py-2 text-xs font-medium text-violet-300"><Sparkles className="h-3.5 w-3.5" /> A second brain that listens</div><h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.055em] text-white sm:text-6xl">The little things matter.<br /><span className="text-zinc-500">We remember them.</span></h1><p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">Speak naturally about your day. EchoMind connects the people, plans and promises you mention, so they&apos;re there when you need them.</p><div className="mt-12"><MicButton state={micState} onClick={handleMic} /></div><TranscriptPanel turns={voice.turns} userDraft={voice.userDraft} agentDraft={voice.agentDraft} state={micState} />{voice.error && <p role="status" className="mt-3 text-sm text-amber-300">{voice.error}</p>}</section>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(310px,1fr)]"><GraphView nodes={graph.nodes} edges={graph.edges} /><div className="flex flex-col gap-5"><SuggestionCard suggestion={suggestion} onConfirm={() => void updateSuggestion("/api/suggestions/confirm")} onDismiss={() => void updateSuggestion("/api/suggestions/dismiss")} /><section className="flex flex-1 flex-col justify-between rounded-3xl border border-white/[.08] bg-[#11141e] p-6 sm:p-7"><div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232a34] text-[#9db4cb]"><CircleHelp className="h-5 w-5" /></div><p className="mt-5 text-[11px] font-semibold uppercase tracking-[.2em] text-zinc-500">Memory controls</p><h2 className="mt-2 text-xl font-semibold text-white">Keep your context close.</h2><p className="mt-3 text-sm leading-7 text-zinc-400">Refresh memories, search what you have saved, or ask EchoMind for a relevant nudge.</p><div className="mt-6 flex flex-wrap gap-2"><button type="button" disabled={refreshing} onClick={() => void handleRefresh()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> {refreshing ? "Refreshing…" : "Refresh"}</button><button type="button" disabled={findingSuggestion} onClick={() => void handleFindSuggestion()} className="inline-flex items-center gap-2 rounded-xl border border-violet-400/30 px-3 py-2 text-sm text-violet-200 disabled:opacity-60"><Sparkles className={`h-4 w-4 ${findingSuggestion ? "animate-pulse" : ""}`} /> {findingSuggestion ? "Searching…" : "Find suggestion"}</button></div>{(status || controlsNote) && <p role="status" className="mt-4 text-xs text-amber-300">{status || controlsNote}</p>}</div><div className="mt-8 flex items-center gap-2 border-t border-white/[.07] pt-5 text-xs text-zinc-500"><LockKeyhole className="h-4 w-4" /> Live data stays behind the server routes</div></section></div></section>
      <section className="mt-5 rounded-3xl border border-white/[.08] bg-[#11141e] p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-violet-300">Memory index</p><h2 className="mt-1 text-xl font-semibold text-white">What EchoMind remembers</h2></div><form onSubmit={searchMemories} className="flex gap-2"><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search memories" className="w-48 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600" /><button type="submit" disabled={searching || !!pendingAction} aria-label="Search memories" className="rounded-xl bg-violet-400 px-3 text-[#171324]"><Search className="h-4 w-4" /></button></form></div>{status && <p role="status" className="mt-4 text-sm text-amber-300">{status}</p>}<div className="mt-5 grid gap-2">{(searchActive ? searchResults : memories).map((memory) => <div key={memory.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${selectedMemoryId === memory.id ? "border-violet-400/50 bg-violet-400/10" : "border-white/[.07]"}`}><button type="button" onClick={() => setSelectedMemoryId(memory.id)} className="min-w-0 flex-1 text-left"><span className="mr-3 text-[10px] font-semibold uppercase tracking-widest text-violet-300">{memory.type}</span><span className="text-sm font-medium text-white">{memory.title}</span><span className="ml-3 text-xs text-zinc-500">{memoryDetail(memory)}</span><span className={`ml-3 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${memory.status === "completed" ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-zinc-400"}`}>{memory.status === "completed" ? "Completed" : memory.status}</span></button>{selectedMemoryId === memory.id && <div className="flex gap-2"><button type="button" disabled={!!pendingAction || memory.status === "completed"} onClick={() => void updateMemory("/api/complete", memory.id)} className="rounded-lg border border-emerald-400/30 px-2 py-1 text-xs text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50">{pendingAction?.id === memory.id && pendingAction.action === "complete" ? "Completing…" : memory.status === "completed" ? "Completed" : "Complete"}</button><button type="button" disabled={!!pendingAction} onClick={() => void updateMemory("/api/forget", memory.id)} className="rounded-lg border border-rose-400/30 px-2 py-1 text-xs text-rose-200 disabled:cursor-not-allowed disabled:opacity-50">{pendingAction?.id === memory.id && pendingAction.action === "forget" ? "Forgetting…" : "Forget"}</button></div>}</div>)}{loading && <p className="text-sm text-zinc-500">Loading memories...</p>}{!loading && !(searchActive ? searchResults : memories).length && <p className="text-sm text-zinc-500">{searchActive ? "No matching memories found." : "No memories saved yet."}</p>}</div></section>
      <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[.07] pt-6 text-xs text-zinc-600"><span>© 2026 EchoMind</span><span>Made for the moments you don&apos;t want to forget.</span></footer>
    </div>
  </main>;
}
