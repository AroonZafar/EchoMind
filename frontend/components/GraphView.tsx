"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Expand } from "lucide-react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export type MemoryNode = { id: string; name: string; type: string; detail?: string };
export type MemoryEdge = { source: string; target: string };
export type MemoryGraph = { nodes: MemoryNode[]; edges: MemoryEdge[] };

const colors: Record<string, string> = { Person: "#7aa6ff", Task: "#75d5a0", Event: "#f4ac73", Fact: "#c7a6f6", Preference: "#ed98c2", Conversation: "#8bd4d1", Note: "#c5b78d" };
const colorFor = (type: string) => colors[type] || colors[`${type[0]?.toUpperCase()}${type.slice(1).toLowerCase()}`] || "#9ca3af";

export default function GraphView({ nodes, edges }: MemoryGraph) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 700, height: 345 });
  const [selected, setSelected] = useState<MemoryNode | null>(null);
  const data = useMemo(() => ({ nodes: nodes.map(node => ({ ...node })), links: edges.map(edge => ({ ...edge })) }), [nodes, edges]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <section id="memory-graph" className="overflow-hidden rounded-3xl border border-white/[.08] bg-[#11141e]">
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-violet-300">Your world, connected</p><h2 className="mt-1 text-xl font-semibold text-white">Memory graph</h2><p className="mt-1 text-sm text-zinc-500">The people, plans and moments behind your words.</p></div><span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400"><Expand className="h-3.5 w-3.5" /> Drag to explore</span></div>
    <div ref={containerRef} className="grid-texture relative mt-5 h-[300px] w-full overflow-hidden border-y border-white/[.05] sm:h-[345px]">
      <ForceGraph2D graphData={data} width={size.width} height={size.height} backgroundColor="rgba(0,0,0,0)" nodeRelSize={7} nodeVal={node => (node as MemoryNode).type.toLowerCase() === "person" ? 10 : 7} nodeColor={node => colorFor((node as MemoryNode).type)} linkColor={() => "rgba(156,163,190,.27)"} linkWidth={1.3} linkDirectionalParticles={1} linkDirectionalParticleWidth={1.8} linkDirectionalParticleColor={() => "#a99cfd"} cooldownTicks={80} onNodeClick={node => setSelected(node as MemoryNode)} nodeCanvasObjectMode={() => "after"} nodeCanvasObject={(node, ctx, globalScale) => { const item = node as MemoryNode & { x?: number; y?: number }; if (item.x == null || item.y == null) return; const fontSize = Math.max(10, 12 / globalScale); ctx.font = `500 ${fontSize}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = "#d9d9e5"; ctx.fillText(item.name, item.x, item.y + 11); }} />
      {selected && <div className="absolute bottom-3 left-3 max-w-[220px] rounded-xl border border-white/10 bg-[#202332]/95 p-3 shadow-xl"><div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colorFor(selected.type) }}>{selected.type}</div><div className="mt-1 text-sm font-semibold text-white">{selected.name}</div>{selected.detail && <div className="mt-1 text-xs text-zinc-400">{selected.detail}</div>}</div>}
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-xs text-zinc-400 sm:px-7">{(Object.keys(colors) as Array<keyof typeof colors>).map(type => <span key={type} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[type] }} />{type}</span>)}<span className="ml-auto text-zinc-600">{nodes.length} memories · {edges.length} connections</span></div>
  </section>;
}
