"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Fraunces, Manrope, Martian_Mono } from "next/font/google";
import Link from "next/link";
import HeroPortrait3D from "@/components/HeroPortrait3D";
import {
  FiArrowDownRight,
  FiGithub,
  FiLinkedin,
  FiDatabase,
  FiCloud,
  FiLayers,
  FiServer,
} from "react-icons/fi";
import {
  SiPython,
  SiPytorch,
  SiNextdotjs,
  SiVercel,
  SiPostgresql,
  SiMongodb,
  SiSqlite,
  SiReact,
  SiNodedotjs,
  SiFastapi,
  SiJavascript,
  SiCplusplus,
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

/* --- RAG Pipeline Structured Stack --- */
const PIPELINE_NODES = [
  {
    id: "01",
    title: "Data Ingestion & Storage",
    description: "Vector stores and relational databases anchoring the knowledge base.",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, progress: 85 },
      { name: "MongoDB", icon: SiMongodb, progress: 80 },
      { name: "SQL", icon: FiDatabase, progress: 82 },
      { name: "SQLite", icon: SiSqlite, progress: 76 },
    ],
  },
  {
    id: "02",
    title: "Compute & Orchestration",
    description: "Neural networks, routing, and backend systems architecture.",
    skills: [
      { name: "Python", icon: SiPython, progress: 88 },
      { name: "PyTorch", icon: SiPytorch, progress: 84 },
      { name: "FastAPI", icon: SiFastapi, progress: 76 },
      { name: "Node.js", icon: SiNodedotjs, progress: 80 },
      { name: "C++", icon: SiCplusplus, progress: 76 },
      { name: "System Architecture", icon: FiLayers, progress: 88 },
    ],
  },
  {
    id: "03",
    title: "Interface & Delivery",
    description: "Generative UI, client frameworks, and cloud deployment.",
    skills: [
      { name: "Next.js", icon: SiNextdotjs, progress: 82 },
      { name: "React.js", icon: SiReact, progress: 86 },
      { name: "Javascript", icon: SiJavascript, progress: 86 },
      { name: "Vercel AI SDK", icon: SiVercel, progress: 85 },
      { name: "REST APIs", icon: FiServer, progress: 84 },
      { name: "Cloud Deployment", icon: FiCloud, progress: 72 },
    ],
  },
];

/* --- The 4 Core Philosophy Blocks --- */
const PHILOSOPHY_BLOCKS = [
  {
    num: "01",
    title: "The Architect",
    text: "I don't just build algorithms—I engineer ecosystems where optimized code meets neural automation.",
    color: "bg-[#E43D12]",
  },
  {
    num: "02",
    title: "The Philosophy",
    text: "Every layer, from model to interface, must perform flawlessly in production. Architecture is anticipating scale before the system asks.",
    color: "bg-[#D6536D]",
  },
  {
    num: "03",
    title: "The Translation",
    text: "Research means little until it survives a real system. I turn experiments into APIs, databases and interfaces people actually use.",
    color: "bg-[#EFB11D]",
  },
  {
    num: "04",
    title: "The Constraint",
    text: "I design for the machine that will run the idea, not the diagram. Every decision is measured against memory, compute, failure and scale.",
    color: "bg-[#E43D12]",
  },
];

/* ───────────────── VINTAGE COMPASS ───────────────── */
const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const CARDINALS = [
  { label: "N", a: 0 },
  { label: "E", a: 90 },
  { label: "S", a: 180 },
  { label: "W", a: 270 },
];

function Dial() {
  return (
    <svg viewBox="-200 -200 400 400" className="h-full w-full text-[#E43D12]">
      <circle r="192" fill="none" stroke="currentColor" strokeWidth="0.35" />
      <circle r="140" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="3 6" />
      <circle r="96" fill="none" stroke="currentColor" strokeWidth="0.25" />
      {TICKS.map((a) => {
        const long = a % 30 === 0;
        return (
          <line
            key={a}
            x1="0"
            y1="-186"
            x2="0"
            y2={long ? -166 : -178}
            stroke="currentColor"
            strokeWidth={long ? 0.7 : 0.3}
            transform={`rotate(${a})`}
          />
        );
      })}
      {CARDINALS.map(({ label, a }) => (
        <g key={label} transform={`rotate(${a})`}>
          <text
            y="-146"
            textAnchor="middle"
            fontSize="15"
            fill="currentColor"
            className={mono.className}
            style={{ letterSpacing: "0.1em" }}
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Needle() {
  return (
    <svg viewBox="-200 -200 400 400" className="h-full w-full">
      <path d="M0 -176 L7 0 L-7 0 Z" fill="#E43D12" />
      <path d="M0 176 L7 0 L-7 0 Z" fill="#2A1610" />
      <path d="M0 -176 L0 0" stroke="#EBE9E1" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function Compass({
  dialRotate,
  needleRotate,
  blockLabel,
}: {
  dialRotate: MotionValue<number>;
  needleRotate: MotionValue<number>;
  blockLabel: MotionValue<string>;
}) {
  const heading = useTransform(
    needleRotate,
    (v) => `HDG ${String(Math.round(((v % 360) + 360) % 360)).padStart(3, "0")}°`
  );

  return (
    <div className="relative aspect-square w-[min(74vh,34rem)]">
      <motion.div style={{ rotate: dialRotate }} className="absolute inset-0 will-change-transform">
        <Dial />
      </motion.div>

      <motion.div style={{ rotate: needleRotate }} className="absolute inset-[6%] will-change-transform">
        <Needle />
      </motion.div>

      {/* hub */}
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2A1610] bg-[#EFB11D]">
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A1610]" />
      </div>

      {/* live readout */}
      <div
        className={`${mono.className} absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-6 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] text-[#D6536D]`}
      >
        <motion.span>{heading}</motion.span>
        <motion.span>{blockLabel}</motion.span>
      </div>
    </div>
  );
}

/* ───────────────── OPERATIONAL LEDGER (EXPERIENCE) ───────────────── */
type LedgerRole = { title: string; time: string };
type ProgressionEntry = { company: string; type: "progression"; roles: LedgerRole[] };
type SingleEntry = { company: string; type: "single"; title: string; time: string };
type LedgerEntry = ProgressionEntry | SingleEntry;

const OPERATIONAL_HISTORY: LedgerEntry[] = [
  { company: "ExCoLearn Pvt. Ltd.", type: "progression", roles: [{ title: "Chief Innovation Officer", time: "Sep 2026—Present" }, { title: "Team Lead", time: "Feb 2026—Sep 2026" }, { title: "Digital Marketing Executive", time: "Oct 2025—Feb 2026" }] },
  { company: "Google Student Ambassadors (India)", type: "single", title: "Google Student Ambassador", time: "May 2026—Present" },
  { company: "Amazon Web Services (AWS)", type: "single", title: "Student Builder Campus Leader", time: "Jul 2026—Sep 2026" },
  { company: "ElevanceSkills", type: "single", title: "Full Stack Development Intern", time: "Apr 2026—Jul 2026" },
  { company: "Universal AI Toastmasters Club", type: "single", title: "VP Public Relations", time: "Feb 2026—Present" }
];

const LEDGER_EASE = [0.22, 1, 0.36, 1] as const;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Everything below is derived from the data, nothing is hardcoded per entry. */
function splitTime(time: string) {
  const [from = "", to = ""] = time.split("—").map((s) => s.trim());
  return { from, to };
}

function isPresent(time: string) {
  return /present/i.test(splitTime(time).to);
}

function monthIndex(label: string) {
  const [m, y] = label.split(" ");
  const mi = MONTH_NAMES.indexOf(m);
  const yr = Number(y);
  return mi < 0 || !yr ? null : yr * 12 + mi;
}

function tenureLabel(time: string) {
  const { from, to } = splitTime(time);
  const a = monthIndex(from);
  const b = monthIndex(to);
  if (a === null || b === null || b < a) return null;
  return `${String(b - a).padStart(2, "0")} mos`;
}

function entryIsActive(entry: LedgerEntry) {
  return entry.type === "progression"
    ? entry.roles.some((r) => isPresent(r.time))
    : isPresent(entry.time);
}

const LEDGER_ACTIVE_COUNT = OPERATIONAL_HISTORY.filter(entryIsActive).length;

/* Title scale by rank: newest role is loudest, earlier roles recede. */
const ROLE_RANK_STYLES = [
  "text-[1.6rem] italic text-[#E43D12] md:text-4xl",
  "text-[1.35rem] text-[#2A1610] md:text-[1.7rem]",
  "text-[1.15rem] text-[#2A1610]/60 md:text-[1.4rem]",
];

function LedgerNode({ active, className = "" }: { active: boolean; className?: string }) {
  return (
    <div
      className={`absolute left-[15px] z-10 flex h-4 w-4 items-center justify-center rounded-full border border-[#E43D12] bg-[#EBE9E1] ${
        active ? "shadow-[0_0_15px_rgba(228,61,18,0.55)]" : "shadow-[0_0_10px_rgba(228,61,18,0.3)]"
      } ${className}`}
    >
      {active && <span className="absolute inset-0 animate-ping rounded-full bg-[#E43D12]/40" />}
      <span
        className={`relative h-1.5 w-1.5 rounded-full ${
          active ? "bg-[#E43D12]" : "border border-[#E43D12] bg-transparent"
        }`}
      />
    </div>
  );
}

function LedgerTime({ time }: { time: string }) {
  const { from, to } = splitTime(time);
  const live = isPresent(time);
  const tenure = tenureLabel(time);
  return (
    <p
      className={`${mono.className} flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2A1610]/60`}
    >
      <span>{from}</span>
      <span className="text-[#E43D12]">→</span>
      <span className={live ? "text-[#E43D12]" : ""}>{to}</span>
      {live ? (
        <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[#E43D12]/20 bg-[#E43D12]/5 px-2 py-0.5 text-[8px] font-bold tracking-[0.2em] text-[#E43D12]">
          <span className="h-1 w-1 animate-pulse rounded-full bg-[#E43D12]" />
          Live
        </span>
      ) : tenure ? (
        <span className="text-[#2A1610]/35">· {tenure}</span>
      ) : null}
    </p>
  );
}

/* Minimal text node that branches off the main spine. */
function LedgerSingle({ entry, index }: { entry: SingleEntry; index: number }) {
  const live = isPresent(entry.time);
  return (
    <motion.div
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -20 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: LEDGER_EASE }}
      className="group relative pl-16 md:pl-24"
    >
      <LedgerNode active={live} className="top-px" />

      {/* branch from spine to text */}
      <span
        aria-hidden
        className="absolute left-[31px] top-2 h-px w-5 bg-[#E43D12]/30 transition-all duration-500 group-hover:w-8 group-hover:bg-[#E43D12] md:w-8 md:group-hover:w-14"
      />

      {/* ledger entry number */}
      <span
        aria-hidden
        className={`${display.className} pointer-events-none absolute right-0 top-0 hidden select-none text-[5rem] font-light leading-none tracking-[-0.05em] text-[#E43D12]/[0.07] md:block`}
        style={WONKY}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <LedgerTime time={entry.time} />
      <h4
        className={`${display.className} mt-4 break-words text-[1.6rem] font-light leading-[1.1] tracking-[-0.03em] text-[#2A1610] transition-colors duration-500 group-hover:text-[#E43D12] sm:text-[2rem] md:text-[2.5rem]`}
        style={WONKY}
      >
        {entry.title}
      </h4>
      <p className={`${mono.className} mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D6536D]`}>
        {entry.company}
      </p>
    </motion.div>
  );
}

/* Frosted card with a nested promotion ladder inside it. */
function LedgerProgression({ entry }: { entry: ProgressionEntry }) {
  const live = entry.roles.some((r) => isPresent(r.time));
  const promotions = entry.roles.length - 1;
  return (
    <motion.div
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -20 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: LEDGER_EASE }}
      className="relative pl-16 md:pl-24"
    >
      <LedgerNode active={live} className="top-8" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-[0_20px_40px_-10px_rgba(228,61,18,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all hover:bg-white/50 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E43D12]/5 blur-xl md:blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`${mono.className} rounded-full border border-[#E43D12]/20 bg-[#E43D12]/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E43D12]`}
            >
              Promotion Track
            </span>
            <span
              className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.18em] text-[#D6536D]`}
            >
              {String(promotions).padStart(2, "0")} Promotions · {String(entry.roles.length).padStart(2, "0")} Levels
            </span>
          </div>
          <h4
            className={`${display.className} break-words text-[1.6rem] font-normal tracking-[-0.03em] text-[#2A1610] sm:text-[2rem] md:text-[2.5rem]`}
            style={WONKY}
          >
            {entry.company}
          </h4>
        </div>

        {/* nested ladder: newest level on top */}
        <div className="relative z-10 mt-12 flex flex-col gap-10">
          <div
            aria-hidden
            className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-[#E43D12] via-[#E43D12]/40 to-[#E43D12]/10"
          />

          {entry.roles.map((role, i) => {
            const roleLive = isPresent(role.time);
            const rank = ROLE_RANK_STYLES[Math.min(i, ROLE_RANK_STYLES.length - 1)];
            const prev = entry.roles[i + 1];
            return (
              <motion.div
                key={role.title}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.15, ease: LEDGER_EASE }}
                className="relative pl-10"
              >
                <span
                  className={`absolute left-0 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#E43D12] bg-[#EBE9E1] ${
                    roleLive ? "shadow-[0_0_14px_rgba(228,61,18,0.6)]" : "shadow-[0_0_8px_rgba(228,61,18,0.25)]"
                  }`}
                >
                  {roleLive && <span className="absolute inset-0 animate-ping rounded-full bg-[#E43D12]/40" />}
                  <span
                    className={`relative h-1.5 w-1.5 rounded-full ${roleLive ? "bg-[#E43D12]" : "bg-[#E43D12]/40"}`}
                  />
                </span>

                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
                  <div>
                    <p
                      className={`${mono.className} text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6536D]`}
                    >
                      Level {String(entry.roles.length - i).padStart(2, "0")}
                      {roleLive ? " · Current" : ""}
                    </p>
                    <h5
                      className={`${display.className} mt-3 break-words hyphens-auto font-light leading-[1.1] tracking-[-0.03em] ${rank}`}
                      style={WONKY}
                    >
                      {role.title}
                    </h5>
                    {prev && (
                      <p
                        className={`${mono.className} mt-3 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#E43D12]`}
                      >
                        <span aria-hidden>↑</span>
                        Promoted from {prev.title}
                      </p>
                    )}
                  </div>
                  <LedgerTime time={role.time} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function OperationalLedger() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });
  const headTop = useTransform(scrollYProgress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  return (
    <div ref={ref} className="relative flex flex-col gap-14 pb-4">
      {/* continuous 1px spine */}
      <div aria-hidden className="absolute bottom-0 left-[23px] top-0 w-px bg-[#E43D12]/20" />
      {/* scroll-lit portion of the spine */}
      <motion.div
        aria-hidden
        style={{ scaleY: scrollYProgress }}
        className="absolute bottom-0 left-[23px] top-0 w-px origin-top bg-[#E43D12] shadow-[0_0_10px_rgba(228,61,18,0.7)]"
      />
      {/* glowing head that travels down the spine */}
      <motion.div
        aria-hidden
        style={{ top: headTop }}
        className="absolute left-[21px] -mt-[3px] h-[5px] w-[5px] rounded-full bg-[#E43D12] shadow-[0_0_14px_4px_rgba(228,61,18,0.6)]"
      />

      {OPERATIONAL_HISTORY.map((entry, i) =>
        entry.type === "progression" ? (
          <LedgerProgression key={entry.company} entry={entry} />
        ) : (
          <LedgerSingle key={entry.company} entry={entry} index={i} />
        )
      )}
    </div>
  );
}

export default function ProfilePage() {
  // Master container ref that dictates the GSAP ScrollTrigger "pin" equivalent
  const trackRef = useRef<HTMLElement>(null);

  const { scrollYProgress: visible } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  
  // Replicating exactly: `tl.to("#pin-windmill-svg", { rotateZ: 900 });`
  const needleRotate = useTransform(visible, [0, 1], [-35, 865]); 
  // Counter-rotating the dial gently for parallax
  const dialRotate = useTransform(visible, [0, 1], [0, -90]);

  const blockLabel = useTransform(visible, (progress) =>
    `BLOCK 0${Math.min(4, Math.floor(progress * PHILOSOPHY_BLOCKS.length) + 1)} / 04`
  );

  // --- HARD-PINNED OPACITY MATH ---
  // Guarantees each block crossfades perfectly without overlapping
  const o1 = useTransform(visible, [0, 0.15, 0.25], [1, 1, 0]);
  const o2 = useTransform(visible, [0.2, 0.25, 0.4, 0.5], [0, 1, 1, 0]);
  const o3 = useTransform(visible, [0.45, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const o4 = useTransform(visible, [0.7, 0.75, 1], [0, 1, 1]);
  const opacities = [o1, o2, o3, o4];

  // --- HARD-PINNED Y-TRANSLATION MATH ---
  // Guarantees the text physically "pops up" into view then slides away
  const y1 = useTransform(visible, [0, 0.15, 0.25], [0, 0, -40]);
  const y2 = useTransform(visible, [0.2, 0.25, 0.4, 0.5], [40, 0, 0, -40]);
  const y3 = useTransform(visible, [0.45, 0.5, 0.65, 0.75], [40, 0, 0, -40]);
  const y4 = useTransform(visible, [0.7, 0.75, 1], [40, 0, 0]);
  const ys = [y1, y2, y3, y4];

  return (
    <div className={`flex w-full flex-col gap-0 overflow-x-clip pb-32 text-[#2A1610] ${sans.className}`}>
      
      {/* ───────── 1. HERO ───────── */}
      <section className="relative px-6 pb-24 pt-32 md:px-0">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] md:gap-8 lg:gap-14">
          <div className="order-2 min-w-0 md:order-1">
            <p
              className={`${mono.className} mb-8 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}
            >
              Dossier / Identity
            </p>

            <h1
              className={`${display.className} text-[clamp(3.5rem,10vw,10rem)] font-light leading-[0.86] tracking-[-0.045em] text-[#2A1610]`}
              style={WONKY}
            >
              Rudraksh <br />
              <span className="bg-gradient-to-br from-[#E43D12] via-[#E43D12] to-[#D6536D] bg-clip-text pr-[0.08em] italic text-transparent">
                Gupta.
              </span>
            </h1>

            <div className="mt-12 flex max-w-4xl flex-col gap-8 md:mt-16 md:flex-row md:gap-10">
              <FiArrowDownRight className="shrink-0 text-4xl text-[#E43D12]" />
              <p
                className={`${display.className} text-2xl font-light leading-[1.35] text-[#2A1610] sm:text-[2rem]`}
                style={WONKY}
              >
                <span className="italic text-[#D6536D]">&ldquo;Code is not just logic.</span> It is poetry
                written in the syntax of machines, orchestrating chaos into deterministic, living grace.&rdquo;
              </p>
            </div>
          </div>

          <div className="order-1 min-w-0 md:order-2">
            <HeroPortrait3D
              monoClass={mono.className}
              displayClass={display.className}
            />
          </div>
        </div>
      </section>

      {/* ───────── 2. NEW GSAP-STYLE PINNED SCROLL SECTION ───────── */}
      <section ref={trackRef} className="relative h-[400vh] w-full border-t border-[#E43D12]/20">
        
        {/* The entire viewport is locked into a sticky container */}
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          
          {/* LEFT: Absolutely Stacked Texts (0% chance of overlapping bounds) */}
          <div className="relative z-10 flex h-full w-full items-center px-6 md:ml-[16%] md:w-[45%]">
            <div className="relative h-[300px] w-full">
              {PHILOSOPHY_BLOCKS.map((block, i) => (
                <motion.div
                  key={block.num}
                  style={{ opacity: opacities[i], y: ys[i] }}
                  className="absolute left-0 top-1/2 right-0 -translate-y-1/2 will-change-transform"
                >
                  <h2
                    className={`${mono.className} mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#D6536D]`}
                  >
                    <span className={`h-2 w-2 rounded-full ${block.color}`} />
                    {block.num} / {block.title}
                  </h2>
                  <p
                    className={`${display.className} text-[1.6rem] font-light leading-[1.32] tracking-[-0.015em] md:text-[2.2rem]`}
                    style={WONKY}
                  >
                    {block.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Pinned Compass rotating exactly 900 deg as requested */}
          <div className="pointer-events-none absolute right-[-10vw] flex items-center justify-center md:right-[5vw]">
            <motion.div className="opacity-[0.10] md:opacity-[0.12]">
              <Compass dialRotate={dialRotate} needleRotate={needleRotate} blockLabel={blockLabel} />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ───────── 3. CORE METRICS & LIQUID GLASS RAG PIPELINE ───────── */}
      <section className="relative z-10 border-y border-[#E43D12]/15 bg-[#EBE9E1]/80 px-6 py-24 backdrop-blur-3xl md:px-0">
        <div className="max-w-5xl md:ml-[16%]">
          <div className="grid grid-cols-2 gap-12 border-b border-[#E43D12]/15 pb-16 md:grid-cols-4">
            {[
              { v: "08+", l: "Tier-1 Deployments", accent: true },
              { v: "99.9%", l: "System Uptime" },
              { v: "L4", l: "Clearance Level" },
              { v: "24/7", l: "Systems Online" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className={`${display.className} mb-3 text-5xl font-light tracking-[-0.04em] md:text-6xl ${
                    s.accent ? "text-[#E43D12]" : "text-[#2A1610]"
                  }`}
                  style={WONKY}
                >
                  {s.v}
                </div>
                <div
                  className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.18em] text-[#D6536D]`}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-24">
            <h3
              className={`${mono.className} mb-16 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}
            >
              Systems Pipeline &amp; Competencies
            </h3>

            <div className="relative space-y-16 pb-8">
              <div className="absolute bottom-12 left-[23px] top-8 w-[2px] bg-gradient-to-b from-[#E43D12]/50 via-[#E43D12]/10 to-transparent" />

              {PIPELINE_NODES.map((node, i) => (
                <div key={node.id} className="relative pl-16 md:pl-24">
                  <div className="absolute left-[15px] top-8 z-10 flex h-4 w-4 items-center justify-center rounded-full border border-[#E43D12] bg-[#EBE9E1] shadow-[0_0_15px_rgba(228,61,18,0.5)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#E43D12]" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-[0_20px_40px_-10px_rgba(228,61,18,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all hover:bg-white/50 sm:p-10"
                  >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E43D12]/5 blur-xl md:blur-3xl" />

                    <div className="relative z-10 mb-10">
                      <div className="mb-4 flex items-center gap-4">
                        <span
                          className={`${mono.className} rounded-full border border-[#E43D12]/20 bg-[#E43D12]/5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E43D12]`}
                        >
                          Node {node.id}
                        </span>
                      </div>
                      <h4
                        className={`${display.className} break-words text-[1.6rem] font-normal tracking-[-0.03em] text-[#2A1610] sm:text-[2rem] md:text-[2.5rem]`}
                        style={WONKY}
                      >
                        {node.title}
                      </h4>
                      <p className="mt-3 max-w-lg text-[15px] font-medium text-[#D6536D]">
                        {node.description}
                      </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                      {node.skills.map((skill) => (
                        <div key={skill.name} className="group flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[#2A1610]">
                            <span
                              className={`${mono.className} flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors group-hover:text-[#E43D12]`}
                            >
                              <skill.icon className="text-base text-[#E43D12]" />
                              {skill.name}
                            </span>
                            <span
                              className={`${mono.className} rounded-md border border-white/80 bg-white/60 px-2 py-0.5 text-[10px] font-medium text-[#D6536D] shadow-sm`}
                            >
                              {skill.progress}%
                            </span>
                          </div>

                          <div className="h-2 w-full overflow-hidden rounded-full border border-white/80 bg-white/60 shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.progress}%` }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                              className="relative h-full rounded-full bg-gradient-to-r from-[#E43D12] to-[#D6536D]"
                            >
                              <div className="absolute bottom-0 right-0 top-0 w-4 bg-white/40 blur-[2px]" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* ───────── 3B. OPERATIONAL LEDGER ───────── */}
          <div className="pt-32">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-4">
              <h3
                className={`${mono.className} text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}
              >
                Operational Ledger &amp; Experience
              </h3>
              <p
                className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.2em] text-[#2A1610]/45`}
              >
                {String(OPERATIONAL_HISTORY.length).padStart(2, "0")} Entries ·{" "}
                {String(LEDGER_ACTIVE_COUNT).padStart(2, "0")} Active
              </p>
            </div>

            <OperationalLedger />
          </div>
        </div>
      </section>

      {/* ───────── 4. COMM CHANNELS ───────── */}
      <section className="px-6 pt-24 md:px-0">
        <div className="flex flex-col gap-6 sm:flex-row md:ml-[16%]">
          {[
            {
              href: "https://github.com/Rudrakshgupta22",
              icon: FiGithub,
              label: "Access GitHub Registry",
            },
            {
              href: "https://linkedin.com/in/rudraksh-gupta-188890380",
              icon: FiLinkedin,
              label: "Secure Comm Channel",
            },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="group relative flex flex-1 items-center justify-between overflow-hidden rounded-2xl border border-[#E43D12]/20 bg-[#E43D12]/5 p-8 transition-all hover:bg-[#E43D12] hover:shadow-xl"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <Icon className="text-3xl text-[#E43D12] transition-colors group-hover:text-[#EBE9E1]" />
                <span
                  className={`${mono.className} text-[11px] font-bold uppercase tracking-[0.18em] text-[#2A1610] transition-colors group-hover:text-[#EBE9E1]`}
                >
                  {label}
                </span>
              </div>
              <FiArrowDownRight className="relative z-10 -rotate-45 text-2xl text-[#E43D12] opacity-0 transition-all group-hover:text-[#EBE9E1] group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}