"use client";

import type { ForceGraphMethods } from "react-force-graph-2d";
import { useEffect, useMemo, useRef, useState } from "react";
import { Expand } from "lucide-react";

export type MemoryNode = { id: string; name: string; type: "Person" | "Task" | "Event" | "Fact" | "Preference" | "Conversation" | "Note" | "Raw"; detail?: string };
export type MemoryEdge = { source: string; target: string; relationType?: string };
export type MemoryGraph = { nodes: MemoryNode[]; edges: MemoryEdge[] };

const colors = { Person: "#7aa6ff", Task: "#75d5a0", Event: "#f4ac73", Fact: "#e98a9a", Preference: "#d7a5ff", Conversation: "#9db4cb", Note: "#9db4cb", Raw: "#9db4cb" };

export default function GraphView({ nodes, edges }: MemoryGraph) {
  const [ForceGraph2D, setForceGraph2D] = useState<typeof import("react-force-graph-2d").default | null>(null);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const needsFit = useRef(true);
  const labelBoxes = useRef<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 700, height: 345 });
  const [selected, setSelected] = useState<MemoryNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const data = useMemo(() => ({ nodes: nodes.map(node => ({ ...node })), links: edges.map(edge => ({ ...edge })) }), [nodes, edges]);

  useEffect(() => {
    let cancelled = false;
    void import("react-force-graph-2d").then(module => {
      if (!cancelled) setForceGraph2D(() => module.default);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.d3Force("charge")?.strength(-90);
    graph.d3Force("link")?.distance(85);
    // Keep disconnected memories near the rest of the graph, too.
    graph.d3Force("layout", (alpha: number) => {
      const points = data.nodes as Array<MemoryNode & { x?: number; y?: number; vx?: number; vy?: number }>;
      for (const point of points) {
        point.vx = (point.vx ?? 0) - (point.x ?? 0) * 0.04 * alpha;
        point.vy = (point.vy ?? 0) - (point.y ?? 0) * 0.04 * alpha;
      }
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = (b.x ?? 0) - (a.x ?? 0), dy = (b.y ?? 0) - (a.y ?? 0);
          const distance = Math.hypot(dx, dy) || 0.01;
          if (distance >= 55) continue;
          const push = (55 - distance) / distance * 0.2 * alpha;
          a.vx = (a.vx ?? 0) - dx * push;
          a.vy = (a.vy ?? 0) - dy * push;
          b.vx = (b.vx ?? 0) + dx * push;
          b.vy = (b.vy ?? 0) + dy * push;
        }
      }
    });
    needsFit.current = true;
    graph.d3ReheatSimulation();
    setSelected(current => current ? nodes.find(node => node.id === current.id) ?? null : null);
  }, [ForceGraph2D, data, nodes]);

  useEffect(() => { needsFit.current = true; graphRef.current?.d3ReheatSimulation(); }, [size]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <section id="memory-graph" className="overflow-hidden rounded-3xl border border-white/[.08] bg-[#11141e]">
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-violet-300">Your world, connected</p><h2 className="mt-1 text-xl font-semibold text-white">Memory graph</h2><p className="mt-1 text-sm text-zinc-500">The people, plans and moments behind your words.</p></div><span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400"><Expand className="h-3.5 w-3.5" /> Drag to explore</span></div>
    <div ref={containerRef} className="grid-texture relative mt-5 h-[300px] w-full overflow-hidden border-y border-white/[.05] sm:h-[400px]">
      {ForceGraph2D && <ForceGraph2D
        ref={graphRef} graphData={data} width={size.width} height={size.height}
        backgroundColor="rgba(0,0,0,0)" nodeRelSize={5}
        nodeVal={node => (node as MemoryNode).type === "Person" ? 4 : 2}
        nodeLabel={node => (node as MemoryNode).name}
        nodeColor={node => colors[(node as MemoryNode).type] ?? colors.Fact}
        linkColor={() => "rgba(156,163,190,.35)"}
        linkLabel={link => (link as MemoryEdge).relationType ?? ""}
        linkWidth={1.3} cooldownTicks={160} warmupTicks={60}
        onNodeHover={node => setHoveredId(node ? String(node.id) : null)}
        onNodeClick={node => setSelected(node as MemoryNode)}
        onEngineStop={() => {
          if (needsFit.current && nodes.length) {
            needsFit.current = false;
            graphRef.current?.zoomToFit(500, 45);
          }
        }}
        nodeCanvasObjectMode={() => "replace"}
        nodePointerAreaPaint={(node, color, ctx) => {
          const item = node as MemoryNode & { x?: number; y?: number };
          if (item.x == null || item.y == null) return;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, 12 / (graphRef.current?.zoom() || 1), 0, Math.PI * 2);
          ctx.fill();
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const item = node as MemoryNode & { x?: number; y?: number };
          if (item.x == null || item.y == null) return;
          if (node === data.nodes[0]) labelBoxes.current = [];
          const focused = item.id === hoveredId || item.id === selected?.id;
          const radius = (focused ? 12 : item.type === "Person" ? 10 : 8) / globalScale;
          ctx.beginPath();
          ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = colors[item.type] ?? colors.Fact;
          ctx.fill();
          const label = item.name.length > 24 ? `${item.name.slice(0, 23)}…` : item.name;
          const fontSize = 12 / globalScale;
          ctx.font = `500 ${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const width = ctx.measureText(label).width;
          const box = { x: item.x - width / 2, y: item.y + radius + 3 / globalScale, width, height: fontSize };
          const gap = 4 / globalScale;
          if (!focused && labelBoxes.current.some(other => box.x < other.x + other.width + gap && box.x + box.width + gap > other.x && box.y < other.y + other.height + gap && box.y + box.height + gap > other.y)) return;
          labelBoxes.current.push(box);
          ctx.fillStyle = "#d9d9e5";
          ctx.fillText(label, item.x, box.y);
        }}
      />}
      <button type="button" onClick={() => graphRef.current?.zoomToFit(400, 45)} aria-label="Fit memory graph" className="absolute right-3 top-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#202332]/95 px-3 py-2 text-xs text-zinc-300 hover:text-white"><Expand className="h-3.5 w-3.5" /> Fit view</button>
      {selected && <div className="absolute bottom-3 left-3 max-w-[220px] rounded-xl border border-white/10 bg-[#202332]/95 p-3 shadow-xl"><div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors[selected.type] ?? colors.Fact }}>{selected.type}</div><div className="mt-1 text-sm font-semibold text-white">{selected.name}</div>{selected.detail && <div className="mt-1 text-xs text-zinc-400">{selected.detail}</div>}</div>}
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-xs text-zinc-400 sm:px-7">{(Object.keys(colors) as Array<keyof typeof colors>).slice(0, 3).map(type => <span key={type} className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[type] }} />{type}</span>)}<span className="ml-auto text-zinc-600">{nodes.length} memories · {edges.length} connections</span></div>
  </section>;
}
