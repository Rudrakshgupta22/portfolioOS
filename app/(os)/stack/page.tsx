"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  motionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";
import { Fraunces, Manrope, Martian_Mono } from "next/font/google";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FiArrowLeft } from "react-icons/fi";
import {
  SiCplusplus,
  SiFastapi,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiRedis,
  SiVercel,
} from "react-icons/si";

/* ───────────────── FONT SYSTEM ───────────────── */
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

const WONKY = { fontVariationSettings: '"SOFT" 100, "WONK" 1' } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const DEEP = "#B8300D"; 

/* ───────────────── CONTENT ───────────────── */
type Tool = { name: string; icon: IconType };

const RECORDS: {
  id: string;
  title: string;
  decision: string;
  cost: string;
  practice: string;
  tools: Tool[];
}[] = [
  {
    id: "01",
    title: "Systems Over Models",
    decision: "A model is never the product. The product is everything that survives around it.",
    cost: "More moving parts. A service boundary adds latency and one more interface to keep honest.",
    practice: "The model sits behind an API, so it can be swapped without the product noticing.",
    tools: [
      { name: "Python", icon: SiPython },
      { name: "FastAPI", icon: SiFastapi },
      { name: "PostgreSQL", icon: SiPostgresql },
    ],
  },
  {
    id: "02",
    title: "Intelligence Has a Budget",
    decision:
      "Every inference costs something. I design around compute, memory, latency, and the hardware that has to carry the idea.",
    cost: "Sometimes the answer is good enough rather than best. A cache hit or a smaller model wins over the biggest one.",
    practice: "Latency and memory limits are written down before the first line of model code.",
    tools: [
      { name: "PyTorch", icon: SiPytorch },
      { name: "C++", icon: SiCplusplus },
      { name: "Redis", icon: SiRedis },
    ],
  },
  {
    id: "03",
    title: "Research Must Survive Reality",
    decision: "A notebook can prove a hypothesis. Production decides whether it mattered.",
    cost: "Slower to a demo. Evaluation, logging and failure handling come before the impressive part.",
    practice: "A result only counts once it holds up on real inputs, not just the ones it was tuned on.",
    tools: [
      { name: "Python", icon: SiPython },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Vercel AI SDK", icon: SiVercel },
    ],
  },
  {
    id: "04",
    title: "Build for the Failure State",
    decision: "Services timeout. APIs break. Inputs lie. Good architecture already knows what happens next.",
    cost: "More code. Every happy path gets an unhappy twin, and that twin needs tests too.",
    practice: "Every external call ships with a timeout, a retry budget and a fallback, not after the first outage.",
    tools: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "Redis", icon: SiRedis },
      { name: "PostgreSQL", icon: SiPostgresql },
    ],
  },
];

/* ═════════════════════════ SCROLL TOOLKIT ═════════════════════════ */
function useScrub(
  ref: React.RefObject<HTMLElement | null>,
  offset: NonNullable<UseScrollOptions["offset"]>
): MotionValue<number> {
  const reduce = useReducedMotion();
  const done = useMemo(() => motionValue(1), []);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return reduce ? done : scrollYProgress;
}

function Word({ p, start, end, children }: { p: MotionValue<number>; start: number; end: number; children: string }) {
  const opacity = useTransform(p, [start, end], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

function ScrubText({ p, text, from, to }: { p: MotionValue<number>; text: string; from: number; to: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const start = from + (i / words.length) * (to - from);
        return (
          <Word key={`${w}-${i}`} p={p} start={start} end={start + 0.08}>
            {w}
          </Word>
        );
      })}
    </>
  );
}

function Mask({
  p,
  from,
  to,
  children,
  className = "",
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  children: React.ReactNode;
  className?: string;
}) {
  const y = useTransform(p, [from, to], ["108%", "0%"]);
  return (
    <div className={`-mb-[0.12em] overflow-hidden pb-[0.12em] ${className}`}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

function ToolMark({ tool, p, i }: { tool: Tool; p: MotionValue<number>; i: number }) {
  const Icon = tool.icon;
  const scale = useTransform(p, [0.52 + i * 0.07, 0.7 + i * 0.07], [0, 1]);
  const rotate = useTransform(p, [0.52 + i * 0.07, 0.7 + i * 0.07], [-120, 0]);
  return (
    <motion.span style={{ scale, rotate }} className="group/tool relative block">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A1610]/15 text-[#2A1610]/60 transition-colors duration-300 hover:border-[#E43D12]/50 hover:text-[#E43D12]">
        <Icon className="text-[17px]" aria-label={tool.name} />
      </span>
      <span
        className={`${mono.className} pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-[0.16em] text-[#2A1610]/70 opacity-0 transition-opacity duration-200 group-hover/tool:opacity-100`}
      >
        {tool.name}
      </span>
    </motion.span>
  );
}

/* ═════════════════════════ COMPONENTS ═════════════════════════ */
function SplitLine({
  text,
  delay,
  drift,
  className = "",
}: {
  text: string;
  delay: number;
  drift: number; 
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : drift]);

  return (
    <motion.span style={{ y }} className={`block ${className}`}>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] pr-[0.02em] align-bottom -mb-[0.14em]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "115%", rotate: 6 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function Ticker() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrub(ref, ["start end", "end start"]);
  const x = useTransform(p, [0, 1], ["6%", "-46%"]);
  const items = [...RECORDS, ...RECORDS];

  return (
    <div
      ref={ref}
      aria-hidden
      className="overflow-hidden py-4"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div style={{ x }} className="flex w-max items-center gap-10">
        {items.map((r, i) => (
          <span key={`${r.id}-${i}`} className="flex items-center gap-10">
            <span
              className={`${display.className} whitespace-nowrap text-[clamp(3rem,8vw,7rem)] font-light italic leading-none tracking-[-0.04em]`}
              style={{
                ...WONKY,
                ...(i % 2 === 0
                  ? { color: "transparent", WebkitTextStroke: "1px rgba(228,61,18,0.5)" }
                  : { color: "rgba(228,61,18,0.85)" }),
              }}
            >
              {r.title}
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#EFB11D]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function RecordRow({ r }: { r: (typeof RECORDS)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const p = useScrub(ref, ["start 90%", "end 65%"]);

  const lineScale = useTransform(p, [0, 0.2], [0, 1]);
  const numY = useTransform(p, [0, 0.22], ["110%", "0%"]);
  const numDrift = useTransform(p, [0, 1], [34, -34]); 
  const costWipe = useTransform(p, [0.36, 0.6], ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const costX = useTransform(p, [0.36, 0.6], [28, 0]);
  const practiceWipe = useTransform(p, [0.46, 0.7], ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const practiceX = useTransform(p, [0.46, 0.7], [28, 0]);
  const statusOpacity = useTransform(p, [0.2, 0.32], [0, 1]);

  return (
    <article ref={ref} className="relative grid gap-8 py-12 md:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14 lg:py-14">
      
      {/* hairline drawn by scroll */}
      <motion.span
        aria-hidden
        style={{ scaleX: lineScale, originX: 0 }}
        className="absolute left-0 right-0 top-0 h-px bg-[#2A1610]/20"
      />
      {/* tick on the progress rail */}
      <span aria-hidden className="absolute -left-[22px] top-0 h-px w-3 bg-[#2A1610]/35 sm:-left-[34px]" />

      {/* column 1 — record number (REMOVED DECISION TEXT HERE) */}
      <div className="flex flex-col gap-3 min-w-0 pt-2">
        <motion.div style={{ y: numDrift }}>
          <div className="overflow-hidden pb-[0.08em] pr-[0.1em]">
            <motion.p
              style={{ y: numY, ...WONKY }}
              className={`${display.className} text-[4.5rem] font-light italic leading-[0.85] tracking-[-0.04em] text-[#E43D12] lg:text-[6rem]`}
            >
              {r.id}
            </motion.p>
          </div>
        </motion.div>
        <motion.span
          style={{ opacity: statusOpacity, color: DEEP }}
          className={`${mono.className} mt-1 inline-flex w-fit items-center gap-2 text-[8px] font-medium uppercase tracking-[0.2em]`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#EFB11D]" />
          Accepted
        </motion.span>
      </div>

      {/* column 2 — the principle */}
      <div className="min-w-0">
        <Mask p={p} from={0.04} to={0.24}>
          <h3
            className={`${display.className} text-[clamp(1.75rem,2.6vw,2.4rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#2A1610]`}
            style={WONKY}
          >
            {r.title}
          </h3>
        </Mask>
        <p className="mt-5 max-w-md text-[16px] font-medium leading-relaxed text-[#2A1610]">
          <ScrubText p={p} text={r.decision} from={0.14} to={0.52} />
        </p>
      </div>

      {/* column 3 — the honest part */}
      <div className="flex flex-col gap-7 md:col-span-2 lg:col-span-1 min-w-0">
        <motion.div style={{ clipPath: costWipe, x: costX }}>
          <p className={`${mono.className} mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6536D]`}>
            What it costs me
          </p>
          <p className="text-[14px] leading-relaxed text-[#2A1610]/70">{r.cost}</p>
        </motion.div>
        <motion.div style={{ clipPath: practiceWipe, x: practiceX }}>
          <p className={`${mono.className} mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6536D]`}>
            In practice
          </p>
          <p className="text-[14px] leading-relaxed text-[#2A1610]/70">{r.practice}</p>
        </motion.div>
        <div className="flex items-center gap-3 pb-6 pt-1 flex-wrap">
          {r.tools.map((t, i) => (
            <ToolMark key={t.name} tool={t} p={p} i={i} />
          ))}
        </div>
      </div>
    </article>
  );
}

const CORNERS = [
  "-left-2 -top-2 border-l border-t",
  "-right-2 -top-2 border-r border-t",
  "-bottom-2 -left-2 border-b border-l",
  "-bottom-2 -right-2 border-b border-r",
];

export default function ArchitecturePage() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const railP = useScrub(bodyRef, ["start 75%", "end 65%"]);
  const dotTop = useTransform(railP, (v) => `${v * 100}%`);

  return (
    <div className={`flex w-full flex-col gap-0 overflow-x-clip pb-40 text-[#2A1610] ${sans.className}`}>
      
      {/* ───────── 1. HEADER ───────── */}
      <section className="relative px-6 pb-8 pt-32 md:px-0">
        <div className="mx-auto max-w-6xl">
          <p
            className={`${mono.className} mb-6 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}
          >
            <Link href="/hub" className="group flex items-center gap-2 transition-colors hover:text-[#E43D12]">
              <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Hub
            </Link>
            <span className="opacity-50">/</span>
            <span>Systems</span>
            <span className="opacity-50">/</span>
            <span>Architecture</span>
          </p>

          <h1
            aria-label="Core Architecture."
            className={`${display.className} text-[clamp(3rem,6vw,6rem)] font-light leading-[0.9] tracking-[-0.04em] text-[#2A1610]`}
            style={WONKY}
          >
            <SplitLine text="Core" delay={0.1} drift={-40} />
            <SplitLine text="Architecture." delay={0.35} drift={30} className="italic text-[#E43D12]" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            className={`${display.className} mt-8 max-w-xl text-xl font-light italic leading-snug text-[#2A1610]/70 sm:text-2xl`}
            style={WONKY}
          >
            Four rules I don&apos;t break, and what each one costs me.
          </motion.p>
        </div>
      </section>

      {/* ───────── 2. SCROLL-DRIVEN TICKER ───────── */}
      <section className="px-6 pb-16 md:px-0">
        <div className="mx-auto max-w-6xl">
          <Ticker />
        </div>
      </section>

      {/* ───────── 3. THE SHEET ───────── */}
      <section className="relative z-10 px-6 md:px-0">
        <div className="relative mx-auto max-w-6xl">
          {CORNERS.map((c) => (
            <span key={c} aria-hidden className={`absolute h-4 w-4 border-[#2A1610]/40 ${c}`} />
          ))}

          <div className="relative overflow-hidden rounded-[0.5rem] border border-[#2A1610]/15 bg-white/35 px-6 shadow-[0_20px_40px_-10px_rgba(228,61,18,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl sm:px-12">
            
            {/* faint construction grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(42,22,16,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(42,22,16,0.05) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage: "linear-gradient(to bottom, black, transparent 85%)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
              }}
            />

            <div
              className={`${mono.className} relative flex items-center justify-between py-6 text-[9px] font-medium uppercase tracking-[0.22em] text-[#2A1610]/55`}
            >
              <span>Sheet 04 · Decision records</span>
              <span className="hidden sm:inline">Read top to bottom</span>
            </div>

            {/* the four records + progress rail */}
            <div ref={bodyRef} className="relative">
              <div aria-hidden className="absolute -left-5 bottom-0 top-0 w-px bg-[#2A1610]/15 sm:-left-8">
                <motion.div style={{ scaleY: railP, originY: 0 }} className="h-full w-px bg-[#E43D12]" />
                <motion.span
                  style={{ top: dotTop }}
                  className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#E43D12] shadow-[0_0_10px_rgba(228,61,18,0.6)]"
                />
              </div>

              {RECORDS.map((r) => (
                <RecordRow key={r.id} r={r} />
              ))}
            </div>

            {/* title block */}
            <div className="relative flex justify-end pb-10 pt-4">
              <div
                className={`${mono.className} grid w-full max-w-xs grid-cols-[auto_1fr] border border-[#2A1610]/25 text-[8px] uppercase tracking-[0.18em] sm:text-[9px]`}
              >
                {[
                  ["Project", "Portfolio OS"],
                  ["Drawn by", "R. Gupta"],
                  ["Scale", "1 : 1"],
                  ["Revision", "C · 2026.10"],
                ].map(([k, v], i) => (
                  <div key={k} className="contents">
                    <span className={`px-3 py-2 text-[#2A1610]/50 ${i ? "border-t border-[#2A1610]/15" : ""}`}>
                      {k}
                    </span>
                    <span
                      className={`border-l border-[#2A1610]/15 px-3 py-2 font-medium text-[#2A1610] ${
                        i ? "border-t border-t-[#2A1610]/15" : ""
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}