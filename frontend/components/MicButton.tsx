"use client";

import { LoaderCircle, Mic, Square } from "lucide-react";

export type MicState = "idle" | "listening" | "processing";

export default function MicButton({ state, onClick }: { state: MicState; onClick: () => void }) {
  const listening = state === "listening";
  return (
    <div className="relative flex flex-col items-center">
      {listening && <span className="breathe absolute top-0 h-32 w-32 rounded-full bg-rose-500/40 blur-sm" aria-hidden="true" />}
      <button type="button" onClick={onClick} disabled={state === "processing"} aria-label={listening ? "Stop listening" : state === "processing" ? "Processing speech" : "Start listening"} className={`relative flex h-32 w-32 items-center justify-center rounded-full border shadow-[0_20px_70px_rgba(0,0,0,.45)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 disabled:cursor-wait ${listening ? "border-rose-400/50 bg-rose-500 text-white shadow-rose-500/20" : "border-white/10 bg-gradient-to-b from-[#292b39] to-[#171923] text-zinc-400 hover:scale-105 hover:text-white"}`}>
        {state === "processing" ? <LoaderCircle className="h-10 w-10 animate-spin" strokeWidth={1.7} /> : listening ? <Square className="h-9 w-9" fill="currentColor" strokeWidth={1.5} /> : <Mic className="h-11 w-11" strokeWidth={1.7} />}
      </button>
      <span className={`mt-7 text-xs font-semibold uppercase tracking-[.22em] ${listening ? "text-rose-300" : "text-zinc-400"}`}>{state === "idle" ? "Tap to start speaking" : state === "listening" ? "Listening · tap to stop" : "Finding the moments that matter"}</span>
    </div>
  );
}
