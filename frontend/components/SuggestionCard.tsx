import { ArrowUpRight, Sparkles, X } from "lucide-react";

export type Suggestion = { id: string; text: string; context: string };

export default function SuggestionCard({ suggestion, onConfirm, onDismiss }: { suggestion: Suggestion | null; onConfirm: () => void; onDismiss: () => void }) {
  if (!suggestion) return null;
  return <section aria-label="Proactive suggestion" className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#27213e] to-[#171923] p-6 sm:p-7">
    <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />
    <div className="relative"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300"><Sparkles className="h-5 w-5" /></span><button onClick={onDismiss} aria-label="Dismiss suggestion" className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button></div>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[.2em] text-violet-300">A thoughtful nudge</p><h3 className="mt-2 text-xl font-medium leading-snug text-white">{suggestion.text}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{suggestion.context}</p>
      <div className="mt-6 flex flex-wrap gap-3"><button onClick={onConfirm} className="inline-flex items-center gap-2 rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-semibold text-[#171324] transition hover:bg-violet-300">Confirm <ArrowUpRight className="h-4 w-4" /></button><button onClick={onDismiss} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5">Dismiss</button></div>
    </div></section>;
}
