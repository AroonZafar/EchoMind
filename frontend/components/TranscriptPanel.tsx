import { AudioLines } from "lucide-react";
import type { MicState } from "./MicButton";

export default function TranscriptPanel({ transcript, state }: { transcript: string; state: MicState }) {
  return (
    <section aria-label="Live transcript" className="mx-auto mt-9 w-full max-w-2xl rounded-2xl border border-white/[.08] bg-white/[.035] p-5 text-left sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-zinc-500"><AudioLines className="h-4 w-4" /> Live transcript</span><span className="flex items-center gap-2 text-xs text-zinc-500"><span className={`h-1.5 w-1.5 rounded-full ${state === "listening" ? "bg-rose-400" : "bg-zinc-600"}`} />{state === "listening" ? "Recording" : "Ready when you are"}</span></div>
      <p aria-live="polite" className={`min-h-14 text-lg leading-relaxed sm:text-xl ${transcript ? "text-zinc-200" : "text-zinc-600"}`}>{transcript || "Talk about your day — I'll remember it."}</p>
    </section>
  );
}
