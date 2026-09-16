module.exports = [
"[project]/frontend/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/brain-circuit.js [app-ssr] (ecmascript) <export default as BrainCircuit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-ssr] (ecmascript) <export default as CircleHelp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/lock-keyhole.js [app-ssr] (ecmascript) <export default as LockKeyhole>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$MicButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/MicButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$TranscriptPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/TranscriptPanel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$GraphView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/GraphView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$SuggestionCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/SuggestionCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useVoiceAgent$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/hooks/useVoiceAgent.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const mockGraph = {
    nodes: [
        {
            id: "you",
            name: "You",
            type: "Person",
            detail: "The center of your memory"
        },
        {
            id: "maya",
            name: "Maya",
            type: "Person",
            detail: "Your friend and design collaborator"
        },
        {
            id: "dad",
            name: "Dad",
            type: "Person",
            detail: "Family"
        },
        {
            id: "coffee",
            name: "Coffee with Maya",
            type: "Event",
            detail: "Thursday afternoon"
        },
        {
            id: "birthday",
            name: "Dad's birthday",
            type: "Event",
            detail: "Coming up next week"
        },
        {
            id: "deck",
            name: "Finish pitch deck",
            type: "Task",
            detail: "Before Friday"
        },
        {
            id: "gift",
            name: "Find a gift",
            type: "Task",
            detail: "For Dad's birthday"
        }
    ],
    edges: [
        {
            source: "you",
            target: "maya"
        },
        {
            source: "you",
            target: "dad"
        },
        {
            source: "maya",
            target: "coffee"
        },
        {
            source: "maya",
            target: "deck"
        },
        {
            source: "you",
            target: "deck"
        },
        {
            source: "dad",
            target: "birthday"
        },
        {
            source: "birthday",
            target: "gift"
        },
        {
            source: "you",
            target: "gift"
        }
    ]
};
function Home() {
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const voice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$hooks$2f$useVoiceAgent$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVoiceAgent"])();
    const micState = voice.connectionState === "connected" ? "listening" : voice.connectionState === "connecting" ? "processing" : voice.connectionState === "error" ? "error" : "idle";
    const handleMic = ()=>{
        setNotice("");
        if (voice.isConnected) {
            voice.stop();
        } else {
            void voice.start();
        }
    };
    const voiceError = voice.error || notice;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "ambient min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "flex h-20 items-center justify-between border-b border-white/[.07]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#top",
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400 text-[#171324]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2d$circuit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BrainCircuit$3e$__["BrainCircuit"], {
                                        className: "h-5 w-5",
                                        strokeWidth: 2.2
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 244
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 145
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold tracking-tight",
                                    children: [
                                        "echo",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-violet-400",
                                            children: "mind"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 52,
                                            columnNumber: 360
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 align-middle text-[10px] font-medium uppercase tracking-[.2em] text-zinc-600",
                                            children: "beta"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 52,
                                            columnNumber: 405
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 305
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 52,
                            columnNumber: 94
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "#memory-graph",
                            className: "hidden items-center gap-2 text-sm text-zinc-400 transition hover:text-white sm:flex",
                            children: [
                                "Explore memories ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 664
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 52,
                            columnNumber: 527
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2 text-xs text-zinc-500 sm:hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__["LockKeyhole"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 52,
                                    columnNumber: 776
                                }, this),
                                " Private space"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 52,
                            columnNumber: 702
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.tsx",
                    lineNumber: 52,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    id: "top",
                    className: "mx-auto max-w-3xl pb-14 pt-16 text-center sm:pt-20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.07] px-4 py-2 text-xs font-medium text-violet-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 255
                                }, this),
                                " A second brain that listens"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 88
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-semibold leading-[1.08] tracking-[-.055em] text-white sm:text-6xl",
                            children: [
                                "The little things matter.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 446
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-zinc-500",
                                    children: "We remember them."
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 53,
                                    columnNumber: 452
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 325
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg",
                            children: "Speak naturally about your day. EchoMind connects the people, plans and promises you mention, so they're there when you need them."
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 513
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$MicButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                state: micState,
                                onClick: handleMic
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.tsx",
                                lineNumber: 53,
                                columnNumber: 763
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 740
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$TranscriptPanel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            turns: voice.turns,
                            userDraft: voice.userDraft,
                            agentDraft: voice.agentDraft,
                            state: micState
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 819
                        }, this),
                        voiceError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "status",
                            className: "mt-3 text-sm text-amber-300",
                            children: voiceError
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 53,
                            columnNumber: 948
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.tsx",
                    lineNumber: 53,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(310px,1fr)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$GraphView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            nodes: mockGraph.nodes,
                            edges: mockGraph.edges
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 54,
                            columnNumber: 88
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$SuggestionCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    suggestion: null,
                                    onConfirm: ()=>undefined,
                                    onDismiss: ()=>undefined
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 186
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                    className: "flex flex-1 flex-col justify-between rounded-3xl border border-white/[.08] bg-[#11141e] p-6 sm:p-7",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#232a34] text-[#9db4cb]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleHelp$3e$__["CircleHelp"], {
                                                        className: "h-5 w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.tsx",
                                                        lineNumber: 54,
                                                        columnNumber: 502
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 403
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-5 text-[11px] font-semibold uppercase tracking-[.2em] text-zinc-500",
                                                    children: "How it works"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 542
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "mt-2 text-xl font-semibold text-white",
                                                    children: "Your life, in context."
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 644
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-3 text-sm leading-7 text-zinc-400",
                                                    children: "EchoMind turns everyday conversations into connected memories, then offers a helpful nudge when something needs your attention."
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 725
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 54,
                                            columnNumber: 398
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-8 flex items-center gap-2 border-t border-white/[.07] pt-5 text-xs text-zinc-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2d$keyhole$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LockKeyhole$3e$__["LockKeyhole"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.tsx",
                                                    lineNumber: 54,
                                                    columnNumber: 1015
                                                }, this),
                                                " Demo data stays in this browser session"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/page.tsx",
                                            lineNumber: 54,
                                            columnNumber: 914
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.tsx",
                                    lineNumber: 54,
                                    columnNumber: 278
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 54,
                            columnNumber: 149
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.tsx",
                    lineNumber: 54,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[.07] pt-6 text-xs text-zinc-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "© 2026 EchoMind"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 55,
                            columnNumber: 125
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Made for the moments you don't want to forget."
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.tsx",
                            lineNumber: 55,
                            columnNumber: 153
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.tsx",
                    lineNumber: 55,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/frontend/app/page.tsx",
            lineNumber: 51,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/page.tsx",
        lineNumber: 50,
        columnNumber: 10
    }, this);
}
}),
"[project]/frontend/components/GraphView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GraphView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$expand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Expand$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/expand.js [app-ssr] (ecmascript) <export default as Expand>");
;
"use client";
;
;
;
;
const ForceGraph2D = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/frontend/node_modules/react-force-graph-2d/dist/react-force-graph-2d.mjs [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const colors = {
    Person: "#7aa6ff",
    Task: "#75d5a0",
    Event: "#f4ac73"
};
function GraphView({ nodes, edges }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [size, setSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        width: 700,
        height: 345
    });
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            nodes: nodes.map((node)=>({
                    ...node
                })),
            links: edges.map((edge)=>({
                    ...edge
                }))
        }), [
        nodes,
        edges
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!containerRef.current) return;
        const observer = new ResizeObserver(([entry])=>setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            }));
        observer.observe(containerRef.current);
        return ()=>observer.disconnect();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "memory-graph",
        className: "overflow-hidden rounded-3xl border border-white/[.08] bg-[#11141e]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-semibold uppercase tracking-[.2em] text-violet-300",
                                children: "Your world, connected"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 29,
                                columnNumber: 102
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "mt-1 text-xl font-semibold text-white",
                                children: "Memory graph"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 29,
                                columnNumber: 210
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-zinc-500",
                                children: "The people, plans and moments behind your words."
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 29,
                                columnNumber: 281
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/GraphView.tsx",
                        lineNumber: 29,
                        columnNumber: 97
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$expand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Expand$3e$__["Expand"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 29,
                                columnNumber: 493
                            }, this),
                            " Drag to explore"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/GraphView.tsx",
                        lineNumber: 29,
                        columnNumber: 381
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/GraphView.tsx",
                lineNumber: 29,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "grid-texture relative mt-5 h-[300px] w-full overflow-hidden border-y border-white/[.05] sm:h-[345px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ForceGraph2D, {
                        graphData: data,
                        width: size.width,
                        height: size.height,
                        backgroundColor: "rgba(0,0,0,0)",
                        nodeRelSize: 7,
                        nodeVal: (node)=>node.type === "Person" ? 10 : 7,
                        nodeColor: (node)=>colors[node.type],
                        linkColor: ()=>"rgba(156,163,190,.27)",
                        linkWidth: 1.3,
                        linkDirectionalParticles: 1,
                        linkDirectionalParticleWidth: 1.8,
                        linkDirectionalParticleColor: ()=>"#a99cfd",
                        cooldownTicks: 80,
                        onNodeClick: (node)=>setSelected(node),
                        nodeCanvasObjectMode: ()=>"after",
                        nodeCanvasObject: (node, ctx, globalScale)=>{
                            const item = node;
                            if (item.x == null || item.y == null) return;
                            const fontSize = Math.max(10, 12 / globalScale);
                            ctx.font = `500 ${fontSize}px Arial`;
                            ctx.textAlign = "center";
                            ctx.textBaseline = "top";
                            ctx.fillStyle = "#d9d9e5";
                            ctx.fillText(item.name, item.x, item.y + 11);
                        }
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/GraphView.tsx",
                        lineNumber: 31,
                        columnNumber: 7
                    }, this),
                    selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-3 left-3 max-w-[220px] rounded-xl border border-white/10 bg-[#202332]/95 p-3 shadow-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-[10px] font-semibold uppercase tracking-widest",
                                style: {
                                    color: colors[selected.type]
                                },
                                children: selected.type
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 32,
                                columnNumber: 140
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-sm font-semibold text-white",
                                children: selected.name
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 32,
                                columnNumber: 271
                            }, this),
                            selected.detail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 text-xs text-zinc-400",
                                children: selected.detail
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/GraphView.tsx",
                                lineNumber: 32,
                                columnNumber: 367
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/GraphView.tsx",
                        lineNumber: 32,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/GraphView.tsx",
                lineNumber: 30,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-x-6 gap-y-2 px-5 py-4 text-xs text-zinc-400 sm:px-7",
                children: [
                    Object.keys(colors).map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "h-2 w-2 rounded-full",
                                    style: {
                                        backgroundColor: colors[type]
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/GraphView.tsx",
                                    lineNumber: 34,
                                    columnNumber: 211
                                }, this),
                                type
                            ]
                        }, type, true, {
                            fileName: "[project]/frontend/components/GraphView.tsx",
                            lineNumber: 34,
                            columnNumber: 158
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto text-zinc-600",
                        children: [
                            nodes.length,
                            " memories · ",
                            edges.length,
                            " connections"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/GraphView.tsx",
                        lineNumber: 34,
                        columnNumber: 306
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/GraphView.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/GraphView.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
}),
"[project]/frontend/components/MicButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MicButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as LoaderCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/mic.js [app-ssr] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/square.js [app-ssr] (ecmascript) <export default as Square>");
"use client";
;
;
function MicButton({ state, onClick }) {
    const listening = state === "listening";
    const processing = state === "processing";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex flex-col items-center",
        children: [
            listening && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "breathe absolute top-0 h-32 w-32 rounded-full bg-rose-500/40 blur-sm",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/frontend/components/MicButton.tsx",
                lineNumber: 12,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onClick,
                disabled: processing,
                "aria-label": listening ? "Stop listening" : processing ? "Connecting voice" : state === "error" ? "Retry voice" : "Start listening",
                className: `relative flex h-32 w-32 items-center justify-center rounded-full border shadow-[0_20px_70px_rgba(0,0,0,.45)] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 disabled:cursor-wait ${listening ? "border-rose-400/50 bg-rose-500 text-white shadow-rose-500/20" : "border-white/10 bg-gradient-to-b from-[#292b39] to-[#171923] text-zinc-400 hover:scale-105 hover:text-white"}`,
                children: processing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderCircle$3e$__["LoaderCircle"], {
                    className: "h-10 w-10 animate-spin",
                    strokeWidth: 1.7
                }, void 0, false, {
                    fileName: "[project]/frontend/components/MicButton.tsx",
                    lineNumber: 14,
                    columnNumber: 23
                }, this) : listening ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                    className: "h-9 w-9",
                    fill: "currentColor",
                    strokeWidth: 1.5
                }, void 0, false, {
                    fileName: "[project]/frontend/components/MicButton.tsx",
                    lineNumber: 14,
                    columnNumber: 107
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                    className: "h-11 w-11",
                    strokeWidth: 1.7
                }, void 0, false, {
                    fileName: "[project]/frontend/components/MicButton.tsx",
                    lineNumber: 14,
                    columnNumber: 178
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/components/MicButton.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `mt-7 text-xs font-semibold uppercase tracking-[.22em] ${listening ? "text-rose-300" : "text-zinc-400"}`,
                children: state === "idle" ? "Tap to start speaking" : state === "listening" ? "Listening · tap to stop" : state === "error" ? "Retry voice connection" : "Connecting voice"
            }, void 0, false, {
                fileName: "[project]/frontend/components/MicButton.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/MicButton.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/components/SuggestionCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SuggestionCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/arrow-up-right.js [app-ssr] (ecmascript) <export default as ArrowUpRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
;
;
function SuggestionCard({ suggestion, onConfirm, onDismiss }) {
    if (!suggestion) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Proactive suggestion",
        className: "relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#27213e] to-[#171923] p-6 sm:p-7",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -right-10 -top-12 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl",
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                lineNumber: 8,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                    lineNumber: 9,
                                    columnNumber: 186
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                lineNumber: 9,
                                columnNumber: 81
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onDismiss,
                                "aria-label": "Dismiss suggestion",
                                className: "text-zinc-500 hover:text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                    lineNumber: 9,
                                    columnNumber: 328
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                lineNumber: 9,
                                columnNumber: 225
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                        lineNumber: 9,
                        columnNumber: 31
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-5 text-[11px] font-bold uppercase tracking-[.2em] text-violet-300",
                        children: "A thoughtful nudge"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                        lineNumber: 10,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mt-2 text-xl font-medium leading-snug text-white",
                        children: suggestion.text
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                        lineNumber: 10,
                        columnNumber: 113
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-relaxed text-zinc-400",
                        children: suggestion.context
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                        lineNumber: 10,
                        columnNumber: 200
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onConfirm,
                                className: "inline-flex items-center gap-2 rounded-xl bg-violet-400 px-4 py-2.5 text-sm font-semibold text-[#171324] transition hover:bg-violet-300",
                                children: [
                                    "Confirm ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                        lineNumber: 11,
                                        columnNumber: 234
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                lineNumber: 11,
                                columnNumber: 50
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onDismiss,
                                className: "rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5",
                                children: "Dismiss"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                                lineNumber: 11,
                                columnNumber: 279
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/SuggestionCard.tsx",
                        lineNumber: 11,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/SuggestionCard.tsx",
                lineNumber: 9,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/SuggestionCard.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
}),
"[project]/frontend/components/TranscriptPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TranscriptPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AudioLines$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/audio-lines.js [app-ssr] (ecmascript) <export default as AudioLines>");
;
;
function TranscriptPanel({ turns, userDraft, agentDraft, state }) {
    const hasContent = turns.length > 0 || userDraft || agentDraft;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Live transcript",
        className: "mx-auto mt-9 w-full max-w-2xl rounded-2xl border border-white/[.08] bg-white/[.035] p-5 text-left sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-zinc-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AudioLines$3e$__["AudioLines"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                lineNumber: 21,
                                columnNumber: 178
                            }, this),
                            " Live transcript"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                        lineNumber: 21,
                        columnNumber: 69
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 text-xs text-zinc-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `h-1.5 w-1.5 rounded-full ${state === "listening" ? "bg-rose-400" : "bg-zinc-600"}`
                            }, void 0, false, {
                                fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                lineNumber: 21,
                                columnNumber: 299
                            }, this),
                            state === "listening" ? "Recording" : "Ready when you are"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                        lineNumber: 21,
                        columnNumber: 235
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-live": "polite",
                className: `min-h-14 space-y-3 text-lg leading-relaxed sm:text-xl ${hasContent ? "text-zinc-200" : "text-zinc-600"}`,
                children: hasContent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        turns.map((turn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mr-2 text-xs font-semibold uppercase tracking-widest text-zinc-500",
                                        children: turn.speaker === "user" ? "You" : "Echo"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                        lineNumber: 24,
                                        columnNumber: 49
                                    }, this),
                                    turn.text
                                ]
                            }, turn.id, true, {
                                fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                lineNumber: 24,
                                columnNumber: 32
                            }, this)),
                        userDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mr-2 text-xs font-semibold uppercase tracking-widest text-zinc-500",
                                    children: "You"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                    lineNumber: 25,
                                    columnNumber: 28
                                }, this),
                                userDraft
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                            lineNumber: 25,
                            columnNumber: 25
                        }, this),
                        agentDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mr-2 text-xs font-semibold uppercase tracking-widest text-zinc-500",
                                    children: "Echo"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                                    lineNumber: 26,
                                    columnNumber: 29
                                }, this),
                                agentDraft
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                            lineNumber: 26,
                            columnNumber: 26
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                    lineNumber: 23,
                    columnNumber: 23
                }, this) : "Talk about your day — I'll remember it."
            }, void 0, false, {
                fileName: "[project]/frontend/components/TranscriptPanel.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/TranscriptPanel.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}),
"[project]/frontend/hooks/useVoiceAgent.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useVoiceAgent",
    ()=>useVoiceAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/voiceAgent.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/microphone.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/voiceAudio.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/replyAudio.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function createTurnId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function useVoiceAgent() {
    const [connectionState, setConnectionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("ready");
    const [microphoneState, setMicrophoneState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("off");
    const [turns, setTurns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [userDraft, setUserDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [agentDraft, setAgentDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const userDraftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const agentDraftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("");
    const appendTurn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((speaker, text)=>{
        const trimmed = text.trim();
        if (!trimmed) return;
        setTurns((current)=>[
                ...current,
                {
                    id: createTurnId(),
                    speaker,
                    text: trimmed
                }
            ]);
    }, []);
    const handleUserTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ text, isFinal })=>{
        if (!isFinal) {
            userDraftRef.current = userDraftRef.current ? `${userDraftRef.current} ${text}` : text;
            setUserDraft(userDraftRef.current);
            return;
        }
        userDraftRef.current = "";
        setUserDraft("");
        appendTurn("user", text);
    }, [
        appendTurn
    ]);
    const handleAgentResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(({ text, isFinal })=>{
        if (!isFinal) {
            const needsSpace = agentDraftRef.current && !/[\s]$/.test(agentDraftRef.current) && !/^[.,!?;:)]/.test(text);
            agentDraftRef.current += `${needsSpace ? " " : ""}${text}`;
            setAgentDraft(agentDraftRef.current);
            return;
        }
        agentDraftRef.current = "";
        setAgentDraft("");
        appendTurn("agent", text);
    }, [
        appendTurn
    ]);
    const clearDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        userDraftRef.current = "";
        agentDraftRef.current = "";
        setUserDraft("");
        setAgentDraft("");
    }, []);
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopStreaming"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopMicrophone"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopReplyAudio"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["disconnect"])();
        clearDrafts();
        setMicrophoneState("off");
        setConnectionState("disconnected");
    }, [
        clearDrafts
    ]);
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isConnected"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMicrophoneActive"])()) return;
        setError("");
        setConnectionState("connecting");
        setMicrophoneState("starting");
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["prepareReplyAudio"])();
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startMicrophone"])();
            setMicrophoneState("on");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["connect"])({
                onSessionReady: async ()=>{
                    setConnectionState("connected");
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startStreaming"])();
                    } catch (startError) {
                        const message = startError instanceof Error ? startError.message : "Could not start audio streaming.";
                        setError(message);
                        setMicrophoneState("error");
                    }
                },
                onUserTranscript: handleUserTranscript,
                onAgentResponse: handleAgentResponse,
                onAgentAudio: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["playReplyAudio"])(data),
                onReplyInterrupted: ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushReplyAudio"])();
                    agentDraftRef.current = "";
                    setAgentDraft("");
                },
                onError: (voiceError)=>{
                    const message = voiceError instanceof Error ? voiceError.message : "Voice connection failed.";
                    setError(message);
                    setConnectionState("error");
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopStreaming"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopMicrophone"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopReplyAudio"])();
                    setMicrophoneState("off");
                    clearDrafts();
                },
                onClose: ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopStreaming"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopReplyAudio"])();
                    setConnectionState("disconnected");
                    setMicrophoneState("off");
                    clearDrafts();
                }
            });
        } catch (startError) {
            const message = startError instanceof Error ? startError.message : "Could not connect to Voice Agent.";
            setError(message);
            setConnectionState("error");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopStreaming"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopMicrophone"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopReplyAudio"])();
            setMicrophoneState("off");
        }
    }, [
        clearDrafts,
        handleAgentResponse,
        handleUserTranscript
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopStreaming"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopMicrophone"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$replyAudio$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopReplyAudio"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["disconnect"])();
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
        stop
    };
}
}),
"[project]/src/voice/microphone.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMicrophoneStream",
    ()=>getMicrophoneStream,
    "isMicrophoneActive",
    ()=>isMicrophoneActive,
    "startMicrophone",
    ()=>startMicrophone,
    "stopMicrophone",
    ()=>stopMicrophone
]);
/**
 * microphone.js — Browser ES module
 *
 * Manages browser microphone capture via the MediaDevices API.
 * This module does NOT send any audio anywhere — it only opens and
 * releases the MediaStream. Audio streaming is handled in a future step.
 *
 * Public API:
 *   startMicrophone()      → Promise<void>
 *   stopMicrophone()       → void
 *   isMicrophoneActive()   → boolean
 *   getMicrophoneStream()  → MediaStream|null
 */ /** @type {MediaStream|null} */ let micStream = null;
/**
 * Request microphone permission and open a MediaStream.
 * Stores the stream internally; does NOT send audio anywhere.
 *
 * @returns {Promise<void>} Resolves when the stream is open.
 * @throws {Error} If permission is denied or the API is unavailable.
 */ async function startMicrophone() {
    if (micStream) {
        // Already active — nothing to do.
        return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API is not available in this browser.");
    }
    // This is the ONLY audio acquisition call for Step 6.
    // No audio data is read or forwarded here.
    micStream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    console.log("[microphone] Stream open — tracks:", micStream.getAudioTracks().length);
}
/**
 * Stop all microphone tracks and release the hardware.
 * After this call isMicrophoneActive() returns false.
 */ function stopMicrophone() {
    if (!micStream) {
        return;
    }
    micStream.getTracks().forEach((track)=>track.stop());
    micStream = null;
    console.log("[microphone] Stream stopped and released.");
}
/**
 * Returns true if the microphone stream is currently open.
 * @returns {boolean}
 */ function isMicrophoneActive() {
    return micStream !== null;
}
/**
 * Returns the active MediaStream, or null if none.
 * Intended for future audio-streaming steps ONLY — do not use in Step 6 UI code.
 * @returns {MediaStream|null}
 */ function getMicrophoneStream() {
    return micStream;
}
;
}),
"[project]/src/voice/replyAudio.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flushReplyAudio",
    ()=>flushReplyAudio,
    "isAudioPlaying",
    ()=>isAudioPlaying,
    "playReplyAudio",
    ()=>playReplyAudio,
    "prepareReplyAudio",
    ()=>prepareReplyAudio,
    "stopReplyAudio",
    ()=>stopReplyAudio
]);
/**
 * replyAudio.js — Browser ES module
 *
 * Decodes and schedules AssemblyAI reply.audio PCM16 chunks for playback.
 * This output path is intentionally separate from microphone capture and
 * microphone streaming.
 */ const SAMPLE_RATE = 24000;
/** @type {AudioContext|null} */ let audioContext = null;
/** @type {number} */ let nextStartTime = 0;
/** @type {number} */ let queuedSources = 0;
/** @type {Set<AudioBufferSourceNode>} */ const activeSources = new Set();
function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext({
            sampleRate: SAMPLE_RATE
        });
    }
    return audioContext;
}
/**
 * Prepare the output context during the user's Voice button gesture.
 * A suspended context is harmless: scheduled buffers wait until it resumes.
 *
 * @returns {Promise<boolean>} true when playback can be attempted
 */ async function prepareReplyAudio() {
    try {
        const context = getAudioContext();
        if (context.state === "suspended") {
            await context.resume();
        }
        return context.state === "running";
    } catch (error) {
        console.warn("[replyAudio] Audio output is unavailable:", error.message);
        return false;
    }
}
function decodePcm16Base64(base64Audio) {
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for(let index = 0; index < binary.length; index++){
        bytes[index] = binary.charCodeAt(index);
    }
    const sampleCount = Math.floor(bytes.byteLength / 2);
    const samples = new Int16Array(bytes.buffer, bytes.byteOffset, sampleCount);
    const audioBuffer = getAudioContext().createBuffer(1, sampleCount, SAMPLE_RATE);
    const channel = audioBuffer.getChannelData(0);
    for(let index = 0; index < sampleCount; index++){
        channel[index] = samples[index] < 0 ? samples[index] / 32768 : samples[index] / 32767;
    }
    return audioBuffer;
}
/**
 * Queue one base64-encoded PCM16 mono 24 kHz reply chunk.
 * Chunks are scheduled end-to-end so they cannot overlap or reorder.
 *
 * @param {string} base64Audio Audio data from reply.audio.data
 * @returns {boolean} true when the chunk was scheduled
 */ function playReplyAudio(base64Audio) {
    if (!base64Audio) return false;
    try {
        const context = getAudioContext();
        const buffer = decodePcm16Base64(base64Audio);
        const source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        const startTime = Math.max(context.currentTime, nextStartTime);
        source.start(startTime);
        nextStartTime = startTime + buffer.duration;
        queuedSources++;
        activeSources.add(source);
        source.onended = ()=>{
            queuedSources = Math.max(0, queuedSources - 1);
            activeSources.delete(source);
        };
        console.log("[replyAudio] PCM16 chunk scheduled", {
            samples: buffer.length,
            queued: queuedSources,
            contextState: context.state
        });
        return true;
    } catch (error) {
        console.warn("[replyAudio] Could not schedule audio chunk:", error.message);
        return false;
    }
}
/**
 * Stop every scheduled source and reset scheduling to the current audio time.
 */ function flushReplyAudio() {
    for (const source of activeSources){
        try {
            source.stop();
        } catch (_) {
        // The source may have already ended.
        }
        source.disconnect();
    }
    activeSources.clear();
    nextStartTime = audioContext ? audioContext.currentTime : 0;
    queuedSources = 0;
}
function stopReplyAudio() {
    flushReplyAudio();
}
function isAudioPlaying() {
    return queuedSources > 0;
}
;
}),
"[project]/src/voice/voiceAgent.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connect",
    ()=>connect,
    "disconnect",
    ()=>disconnect,
    "isConnected",
    ()=>isConnected,
    "sendAudio",
    ()=>sendAudio
]);
/**
 * voiceAgent.js — Browser ES module
 *
 * Manages the AssemblyAI Voice Agent WebSocket connection.
 * The permanent API key NEVER appears here — it stays server-side in .env.
 * This module only uses the short-lived token returned by the local token server.
 *
 * Public API:
 *   connect(handlers)  → Promise<sessionReadyPayload>
 *   disconnect()       → void
 *   isConnected()      → boolean
 *   sendAudio(base64)  → void   (Step 7 — sends input.audio; no-op if not ready)
 *   reply.audio        → forwarded as base64 data to the playback handler
 */ const TOKEN_ENDPOINT = "/api/voice-token";
const ASSEMBLYAI_WS_BASE = "wss://agents.assemblyai.com/v1/ws";
/**
 * Minimal session configuration sent to AssemblyAI immediately after the
 * WebSocket opens. AssemblyAI requires this before it will emit session.ready.
 * Only the fields needed to establish a valid session are included here;
 * future steps (persona, tools, etc.) will extend this object.
 */ const SESSION_UPDATE = {
    type: "session.update",
    session: {
        system_prompt: "You are EchoMind, a helpful personal memory assistant.",
        greeting: "Hello! EchoMind is ready.",
        output: {
            voice: "anna"
        }
    }
};
/** @type {WebSocket|null} */ let ws = null;
/** Reply IDs that AssemblyAI has marked interrupted. */ const interruptedReplyIds = new Set();
/**
 * Fetch a short-lived token from the local token server.
 * @returns {Promise<string>} temporary token
 */ async function fetchToken() {
    const response = await fetch(TOKEN_ENDPOINT);
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Token request failed (${response.status}): ${body}`);
    }
    const data = await response.json();
    if (!data.token) {
        throw new Error("Token response did not contain a token field");
    }
    return data.token;
}
/**
 * Connect to the AssemblyAI Voice Agent WebSocket.
 *
 * AssemblyAI Voice Agent user-speech transcript event types (confirmed):
 *   transcript.user.delta  — partial/incremental word(s) while user is speaking
 *                            { type, delta, start_ms, end_ms, ... }
 *   transcript.user        — final committed transcript for one user utterance
 *                            { type, text, ... }
 *
 * @param {object} [handlers]
 * @param {function} [handlers.onSessionReady]    - Called when session.ready is received
 * @param {function} [handlers.onMessage]         - Called for every message (for future steps)
 * @param {function} [handlers.onUserTranscript]  - Called with { text, isFinal } for user speech
 * @param {function} [handlers.onAgentResponse]   - Called with { text, isFinal } for agent speech
 * @param {function} [handlers.onAgentAudio]      - Called with reply.audio data
 * @param {function} [handlers.onReplyInterrupted] - Called when reply.done reports interruption
 * @param {function} [handlers.onError]           - Called on WebSocket error
 * @param {function} [handlers.onClose]           - Called when the connection closes
 * @returns {Promise<object>} Resolves with the session.ready payload
 */ async function connect(handlers = {}) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        throw new Error("Already connected. Call disconnect() first.");
    }
    const token = await fetchToken();
    const url = `${ASSEMBLYAI_WS_BASE}?token=${encodeURIComponent(token)}`;
    return new Promise((resolve, reject)=>{
        ws = new WebSocket(url);
        ws.onopen = ()=>{
            console.log("[voiceAgent] WebSocket open — sending session.update");
            ws.send(JSON.stringify(SESSION_UPDATE));
        };
        ws.onmessage = (event)=>{
            let msg;
            try {
                msg = JSON.parse(event.data);
            } catch  {
                console.warn("[voiceAgent] Non-JSON message received:", event.data);
                return;
            }
            // Do not log reply.audio payloads because they contain base64 audio data.
            if (msg.type === "reply.audio") {
                console.log("[voiceAgent] event received: reply.audio");
            } else {
                console.log("[voiceAgent] event received:", msg.type, msg);
            }
            if (handlers.onMessage) {
                handlers.onMessage(msg);
            }
            // ── Step 8: user speech transcript ─────────────────────────────────────
            // transcript.user.delta — partial word(s) streamed while user is speaking
            if (msg.type === "transcript.user.delta") {
                const text = (msg.delta || "").trim();
                if (text && handlers.onUserTranscript) {
                    try {
                        handlers.onUserTranscript({
                            text,
                            isFinal: false
                        });
                    } catch (err) {
                        console.warn("[voiceAgent] onUserTranscript handler threw:", err);
                    }
                }
                return;
            }
            // transcript.user — final committed transcript for one user utterance
            if (msg.type === "transcript.user") {
                const text = (msg.text || "").trim();
                if (text && handlers.onUserTranscript) {
                    try {
                        handlers.onUserTranscript({
                            text,
                            isFinal: true
                        });
                    } catch (err) {
                        console.warn("[voiceAgent] onUserTranscript handler threw:", err);
                    }
                }
                return;
            }
            if (msg.type === "reply.started") {
                console.log("[voiceAgent] agent reply started", msg);
                return;
            }
            if (msg.type === "reply.audio") {
                if (!interruptedReplyIds.has(msg.reply_id) && msg.data && handlers.onAgentAudio) {
                    handlers.onAgentAudio(msg.data, msg.reply_id);
                }
                return;
            }
            if (msg.type === "transcript.agent.delta") {
                const text = (msg.delta || msg.text || "").trim();
                if (text && handlers.onAgentResponse) {
                    handlers.onAgentResponse({
                        text,
                        isFinal: false
                    });
                }
                return;
            }
            if (msg.type === "transcript.agent") {
                const text = (msg.text || msg.transcript || "").trim();
                if (text && handlers.onAgentResponse) {
                    handlers.onAgentResponse({
                        text,
                        isFinal: true
                    });
                }
                return;
            }
            if (msg.type === "reply.done") {
                console.log("[voiceAgent] agent reply done", msg);
                if (msg.status === "interrupted") {
                    if (msg.reply_id) {
                        interruptedReplyIds.add(msg.reply_id);
                    }
                    if (handlers.onReplyInterrupted) {
                        handlers.onReplyInterrupted(msg.reply_id);
                    }
                }
                return;
            }
            if (msg.type === "session.ready") {
                console.log("[voiceAgent] session.ready received", msg);
                if (handlers.onSessionReady) {
                    handlers.onSessionReady(msg);
                }
                resolve(msg);
                return;
            }
            if (msg.type === "session.error") {
                const errMsg = msg.error && msg.error.message || JSON.stringify(msg);
                console.error("[voiceAgent] session.error:", errMsg);
                if (handlers.onError) {
                    handlers.onError(new Error(errMsg));
                }
                reject(new Error(`session.error: ${errMsg}`));
                return;
            }
        };
        ws.onerror = (event)=>{
            console.error("[voiceAgent] WebSocket error", event);
            if (handlers.onError) {
                handlers.onError(event);
            }
            reject(new Error("AssemblyAI WebSocket error"));
        };
        ws.onclose = (event)=>{
            console.log(`[voiceAgent] WebSocket closed (code=${event.code})`);
            if (handlers.onClose) {
                handlers.onClose(event);
            }
            ws = null;
        };
    });
}
/**
 * Close the AssemblyAI Voice Agent WebSocket if it is open.
 */ function disconnect() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
    ws = null;
}
/**
 * Returns true if the WebSocket is currently open.
 * @returns {boolean}
 */ function isConnected() {
    return ws !== null && ws.readyState === WebSocket.OPEN;
}
/**
 * Send a base64-encoded PCM16 audio chunk to the AssemblyAI Voice Agent.
 * No-op if the WebSocket is not open.
 * The caller is responsible for gating on session.ready before calling this.
 *
 * @param {string} base64Audio  Base64-encoded PCM16 mono 24 kHz audio
 */ function sendAudio(base64Audio) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        return;
    }
    ws.send(JSON.stringify({
        type: "input.audio",
        audio: base64Audio
    }));
}
;
}),
"[project]/src/voice/voiceAudio.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isStreaming",
    ()=>isStreaming,
    "startStreaming",
    ()=>startStreaming,
    "stopStreaming",
    ()=>stopStreaming
]);
/**
 * voiceAudio.js — Browser ES module
 *
 * Step 7: Connects the microphone MediaStream (from microphone.js) to the
 * AssemblyAI Voice Agent WebSocket (via voiceAgent.sendAudio).
 *
 * Pipeline:
 *   MediaStream  →  AudioContext (24 kHz)  →  MediaStreamSourceNode
 *     →  AudioWorkletNode (pcm-processor)  →  base64 encode
 *       →  sendAudio(base64)  →  WebSocket  →  AssemblyAI
 *
 * Audio format: PCM16 · mono · 24 kHz (required by AssemblyAI Voice Agent)
 *
 * Guards:
 *   - Audio is only sent AFTER session.ready (caller must call startStreaming
 *     from the onSessionReady handler or pass sessionReady=true).
 *   - Audio is not sent if the WebSocket is not open.
 *   - Streaming stops cleanly when stopStreaming() is called.
 *
 * Public API:
 *   startStreaming(stream)  → Promise<void>
 *   stopStreaming()         → void
 *   isStreaming()           → boolean
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/voiceAgent.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/voice/microphone.js [app-ssr] (ecmascript)");
;
;
/** Path to the AudioWorklet processor module — served by the static server */ const PROCESSOR_URL = "/voice/pcm-processor.js";
/** @type {AudioContext|null} */ let audioCtx = null;
/** @type {AudioWorkletNode|null} */ let workletNode = null;
/** @type {MediaStreamAudioSourceNode|null} */ let sourceNode = null;
/** @type {boolean} */ let streaming = false;
/** Frame counter — used only for infrequent logging (every 100 frames) */ let frameCount = 0;
/**
 * Convert an ArrayBuffer of Int16 PCM samples to a base64 string.
 * Uses Uint8Array view over the same buffer — no copy needed.
 *
 * @param {ArrayBuffer} buffer
 * @returns {string} base64-encoded bytes
 */ function pcmBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for(let i = 0; i < bytes.byteLength; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
/**
 * Start streaming microphone audio to AssemblyAI.
 * Must be called AFTER session.ready — caller is responsible for this gate.
 *
 * @returns {Promise<void>} Resolves when the audio pipeline is set up.
 * @throws {Error} If the microphone stream is unavailable or AudioWorklet fails.
 */ async function startStreaming() {
    if (streaming) {
        console.warn("[voiceAudio] Already streaming — ignoring startStreaming().");
        return;
    }
    const stream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$microphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMicrophoneStream"])();
    if (!stream) {
        throw new Error("[voiceAudio] No microphone stream available. Call startMicrophone() first.");
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isConnected"])()) {
        throw new Error("[voiceAudio] WebSocket not connected. Call connect() first.");
    }
    // Create an AudioContext at 24 kHz — AssemblyAI Voice Agent required rate.
    // The browser will resample from the native device rate automatically.
    try {
        audioCtx = new AudioContext({
            sampleRate: 24000
        });
    } catch (err) {
        throw new Error("[voiceAudio] AudioContext creation failed: " + err.message);
    }
    // Resume the context if the browser suspended it (autoplay policy).
    if (audioCtx.state === "suspended") {
        await audioCtx.resume();
    }
    // Load the PCM processor into the AudioWorklet.
    try {
        await audioCtx.audioWorklet.addModule(PROCESSOR_URL);
    } catch (err) {
        audioCtx.close();
        audioCtx = null;
        throw new Error("[voiceAudio] AudioWorklet addModule failed: " + err.message);
    }
    // Wire: MediaStream → source → worklet
    sourceNode = audioCtx.createMediaStreamSource(stream);
    workletNode = new AudioWorkletNode(audioCtx, "pcm-processor");
    // Each message from the worklet is one 128-sample PCM16 ArrayBuffer.
    workletNode.port.onmessage = (event)=>{
        if (!streaming || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isConnected"])()) {
            return;
        }
        const base64 = pcmBufferToBase64(event.data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$voice$2f$voiceAgent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendAudio"])(base64);
        frameCount++;
        // Log once per 100 frames (~0.5 s at 24 kHz / 128 samples per frame)
        if (frameCount % 100 === 0) {
            console.log("[voiceAudio] audio frame sent (frame", frameCount, ")");
        }
    };
    workletNode.port.onmessageerror = (err)=>{
        console.error("[voiceAudio] WorkletNode message error:", err);
    };
    // Connect the graph — do NOT connect workletNode to audioCtx.destination
    // (we have no need to play back the microphone audio locally).
    sourceNode.connect(workletNode);
    streaming = true;
    frameCount = 0;
    console.log("[voiceAudio] microphone streaming started");
}
/**
 * Stop streaming and release all audio-processing resources.
 * Safe to call even if streaming is not active.
 */ function stopStreaming() {
    if (!streaming && !audioCtx) {
        return;
    }
    streaming = false;
    // Disconnect the audio graph
    if (sourceNode) {
        try {
            sourceNode.disconnect();
        } catch (_) {}
        sourceNode = null;
    }
    if (workletNode) {
        workletNode.port.onmessage = null;
        try {
            workletNode.disconnect();
        } catch (_) {}
        workletNode = null;
    }
    if (audioCtx) {
        audioCtx.close().catch(()=>{});
        audioCtx = null;
    }
    frameCount = 0;
    console.log("[voiceAudio] microphone streaming stopped");
}
/**
 * Returns true if the audio pipeline is active.
 * @returns {boolean}
 */ function isStreaming() {
    return streaming;
}
;
}),
];

//# sourceMappingURL=_0pqvh33._.js.map