"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BrainCircuit, CircleHelp, LockKeyhole, Sparkles } from "lucide-react";
import MicButton, { type MicState } from "@/components/MicButton";
import TranscriptPanel from "@/components/TranscriptPanel";
import GraphView, { type MemoryGraph } from "@/components/GraphView";
import SuggestionCard, { type Suggestion } from "@/components/SuggestionCard";

const mockGraph: MemoryGraph = {
  nodes: [
    { id: "you", name: "You", type: "Person", detail: "The center of your memory" },
    { id: "maya", name: "Maya", type: "Person", detail: "Your friend and design collaborator" },
    { id: "dad", name: "Dad", type: "Person", detail: "Family" },
    { id: "coffee", name: "Coffee with Maya", type: "Event", detail: "Thursday afternoon" },
    { id: "birthday", name: "Dad's birthday", type: "Event", detail: "Coming up next week" },
    { id: "deck", name: "Finish pitch deck", type: "Task", detail: "Before Friday" },
    { id: "gift", name: "Find a gift", type: "Task", detail: "For Dad's birthday" },
  ],
  edges: [
    { source: "you", target: "maya" }, { source: "you", target: "dad" },
    { source: "maya", target: "coffee" }, { source: "maya", target: "deck" },
    { source: "you", target: "deck" }, { source: "dad", target: "birthday" },
    { source: "birthday", target: "gift" }, { source: "you", target: "gift" },
  ],
};
const mockSuggestion: Suggestion = { id: "maya-check-in", text: "You mentioned coffee with Maya on Thursday. Want a reminder to confirm the time?", context: "From your conversation about this week's plans." };

type SpeechResult = { isFinal: boolean; 0: { transcript: string } };
type SpeechEvent = { resultIndex: number; results: ArrayLike<SpeechResult> };
type SpeechRecognitionLike = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((event: SpeechEvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };

export default function Home() {
  const [micState, setMicState] = useState<MicState>("idle");
  const [transcript, setTranscript] = useState("");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [notice, setNotice] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTextRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { recognitionRef.current?.stop(); if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const finish = () => {
    recognitionRef.current?.stop(); recognitionRef.current = null;
    setMicState("processing");
    timerRef.current = setTimeout(() => { setMicState("idle"); if (finalTextRef.current.trim()) setSuggestion(mockSuggestion); }, 1000);
  };

  const handleMic = () => {
    if (micState === "listening") { finish(); return; }
    setNotice(""); setTranscript(""); finalTextRef.current = "";
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) { setNotice("Live speech transcription isn't available in this browser. Try Chrome or Edge, or preview the demo below."); return; }
    const recognition = new Recognition();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-US";
    recognition.onresult = event => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTextRef.current += result[0].transcript.trim() + " ";
        else interim += result[0].transcript;
      }
      setTranscript((finalTextRef.current + interim).trim());
    };
    recognition.onerror = () => { setNotice("Microphone access was unavailable. Check browser permissions, or preview the demo below."); recognitionRef.current = null; setMicState("idle"); };
    recognition.onend = () => { if (recognitionRef.current === recognition) finish(); };
    try { recognition.start(); recognitionRef.current = recognition; setMicState("listening"); }
    catch { setNotice("Could not start the microphone. Check browser permissions."); setMicState("idle"); }
  };

  const previewDemo = () => { if (micState === "listening") recognitionRef.current?.stop(); if (timerRef.current) clearTimeout(timerRef.current); recognitionRef.current = null; finalTextRef.current = "I need to finish the pitch deck before Friday, and I should confirm coffee with Maya on Thursday."; setTranscript(finalTextRef.current); setSuggestion(mockSuggestion); setMicState("idle"); setNotice(""); };

  return <main className="ambient min-h-screen">
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
      <header className="flex h-20 items-center justify-between border-b border-white/[.07]"><a href="#top" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400 text-[#171324]"><BrainCircuit className="h-5 w-5" strokeWidth={2.2} /></span><span className="text-xl font-bold tracking-tight">echo<span className="text-violet-400">mind</span><span className="ml-2 align-middle text-[10px] font-medium uppercase tracking-[.2em] text-zinc-600">beta</span></span></a><a href="#memory-graph" className="hidden items-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:flex">Explore memories <ArrowRight className="h-4 w-4" /></a><span className="flex items-center gap-2 text-xs text-zinc-500 sm:hidden"><LockKeyhole className="h-3.5 w-3.5" /> Private space</span></header>
      <section id="top" className="mx-auto max-w-3xl pb-14 pt-16 text-center sm:pt-20"><div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.07] px-4 py-2 text-xs font-medium text-violet-300"><Sparkles className="h-3.5 w-3.5" /> A second brain that listens</div><h1 className="text-4xl font-semibold leading-[1.08] tracking-[-.055em] text-white sm:text-6xl">The little things matter.<br /><span className="text-zinc-500">We remember them.</span></h1><p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">Speak naturally about your day. EchoMind connects the people, plans and promises you mention, so they&apos;re there when you need them.</p><div className="mt-12"><MicButton state={micState} onClick={handleMic} /></div><TranscriptPanel transcript={transcript} state={micState} />{notice && <p role="status" className="mt-3 text-sm text-amber-300">{notice}</p>}<button type="button" onClick={previewDemo} className="mt-5 inline-flex items-center gap-1 text-sm text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition hover:text-violet-300">Preview with a sample conversation <ArrowRight className="h-3.5 w-3.5" /></button></section>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(310px,1fr)]"><GraphView nodes={mockGraph.nodes} edges={mockGraph.edges} /><div className="flex flex-col gap-5"><SuggestionCard suggestion={suggestion} onConfirm={() => { setSuggestion(null); setNotice("Reminder confirmed in this demo."); }} onDismiss={() => setSuggestion(null)} /><section className="flex flex-1 flex-col justify-between rounded-3xl border border-white/[.08] bg-[#11141e] p-6 sm:p-7"><div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232a34] text-[#9db4cb]"><CircleHelp className="h-5 w-5" /></div><p className="mt-5 text-[11px] font-semibold uppercase tracking-[.2em] text-zinc-500">How it works</p><h2 className="mt-2 text-xl font-semibold text-white">Your life, in context.</h2><p className="mt-3 text-sm leading-7 text-zinc-400">EchoMind turns everyday conversations into connected memories, then offers a helpful nudge when something needs your attention.</p></div><div className="mt-8 flex items-center gap-2 border-t border-white/[.07] pt-5 text-xs text-zinc-500"><LockKeyhole className="h-4 w-4" /> Demo data stays in this browser session</div></section></div></section>
      <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[.07] pt-6 text-xs text-zinc-600"><span>© 2026 EchoMind</span><span>Made for the moments you don&apos;t want to forget.</span></footer>
    </div>
  </main>;
}
