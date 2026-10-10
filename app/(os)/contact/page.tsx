"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Fraunces, Manrope, Martian_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent, ReactNode } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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

/* ───────────────── CONFIG ───────────────── */
const EMAIL_ADDRESS = "grudraksh2007@gmail.com"; 
const GITHUB_HANDLE = "Rudrakshgupta22";
const LINKEDIN_HANDLE = "rudraksh-gupta-188890380";
const TIMEZONE = "Asia/Kolkata";
const TIMEZONE_LABEL = "IST";
const MAX_CHARS = 600;

const INTRO =
  "Building something with *models*, data, or just a stubborn idea? I'd love to hear about it. My inbox is *open*, and I read every message.";

const TOPICS = [
  "a collaboration",
  "a role on your team",
  "some research",
  "a wild idea",
  "nothing in particular",
];

type StoryLink = {
  label: string;
  href: string;
  external: boolean;
  after?: string; 
  copy?: boolean; 
};
type Part = string | StoryLink;

const STORY: Part[][] = [
  [
    "The quickest way in is",
    { label: "Email", href: `mailto:${EMAIL_ADDRESS}`, external: false, after: ".", copy: true },
    "I read everything that lands there.",
  ],
  [
    "Want to see how I think first? The half-finished experiments live on",
    { label: `github.com/${GITHUB_HANDLE}`, href: `https://github.com/${GITHUB_HANDLE}`, external: true, after: "." },
  ],
  [
    "And if you like things official, find me on",
    { label: `in/rudraksh-gupta`, href: `https://linkedin.com/in/${LINKEDIN_HANDLE}/`, external: true, after: "." },
  ],
];

/* ───────────────── COMPONENTS ───────────────── */

function MaskLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.14em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Word({
  word,
  em,
  range,
  progress,
}: {
  word: string;
  em: boolean;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const o = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      style={{ opacity: reduce ? 1 : o }}
      className={`mr-[0.28em] inline-block ${em ? "italic text-[#E43D12]" : ""}`}
    >
      {word}
    </motion.span>
  );
}

function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  const tokens = text.split(" ").map((raw) => {
    const m = raw.match(/^\*(.+)\*(\W*)$/);
    return m ? { w: m[1] + m[2], em: true } : { w: raw, em: false };
  });

  return (
    <p
      ref={ref}
      className={`${display.className} max-w-4xl text-[clamp(1.8rem,4vw,3.6rem)] font-light leading-[1.18] tracking-[-0.025em]`}
      style={WONKY}
    >
      <span className="sr-only">{text.replace(/\*/g, "")}</span>
      <span aria-hidden>
        {tokens.map((t, i) => {
          const start = (i / tokens.length) * 0.8;
          return (
            <Word
              key={i}
              word={t.w}
              em={t.em}
              range={[start, Math.min(start + 0.2, 1)]}
              progress={scrollYProgress}
            />
          );
        })}
      </span>
    </p>
  );
}

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: TIMEZONE,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t ? `${t} ${TIMEZONE_LABEL}` : "—"}</span>;
}

function SectionTag({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className={`${mono.className} mb-10 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}>
      <span className="text-[#E43D12]">( {n} )</span>
      {children}
    </p>
  );
}

function Reveal({
  range,
  progress,
  children,
}: {
  range: [number, number];
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const o = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : o }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

function InlineLink({
  link,
  copied,
  onCopy,
}: {
  link: StoryLink;
  copied: boolean;
  onCopy?: () => void;
}) {
  return (
    <>
      <a
        href={link.href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        className="group/il relative inline-block italic text-[#E43D12]"
      >
        <span
          aria-hidden
          className="absolute -inset-x-2 inset-y-[0.08em] origin-left scale-x-0 rounded-lg bg-[#E43D12]/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/il:scale-x-100"
        />
        <span className="relative">
          {link.label}
          <span
            aria-hidden
            className="ml-[0.12em] inline-block align-super text-[0.5em] not-italic transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/il:-translate-y-1 group-hover/il:translate-x-1"
          >
            ↗
          </span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          className="absolute -bottom-[0.06em] left-0 h-[0.16em] w-full overflow-visible"
        >
          <motion.path
            d="M0 4 Q 12 0 25 4 T 50 4 T 75 4 T 100 4"
            fill="none"
            stroke="#E43D12"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: EASE }}
          />
        </svg>
      </a>
      {link.after}
      {link.copy && onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          className={`${mono.className} ml-4 inline-block rounded-full border border-[#E43D12]/25 bg-[#E43D12]/5 px-3 py-1.5 align-middle text-[9px] font-bold uppercase not-italic leading-none tracking-[0.2em] text-[#E43D12] transition-colors hover:bg-[#E43D12] hover:text-[#EBE9E1]`}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      ) : null}
    </>
  );
}

function StoryParagraph({
  parts,
  className = "",
  copied,
  onCopy,
}: {
  parts: Part[];
  className?: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.55"] });

  type Tok = { kind: "w"; w: string } | { kind: "l"; link: StoryLink };
  const toks: Tok[] = parts.flatMap((p): Tok[] =>
    typeof p === "string"
      ? p
          .split(" ")
          .filter(Boolean)
          .map((w) => ({ kind: "w" as const, w }))
      : [{ kind: "l" as const, link: p }],
  );

  return (
    <p
      ref={ref}
      className={`${display.className} max-w-4xl text-[clamp(1.8rem,4vw,3.6rem)] font-light leading-[1.3] tracking-[-0.025em] ${className}`}
      style={WONKY}
    >
      {toks.map((t, i) => {
        const start = (i / toks.length) * 0.75;
        const range: [number, number] = [start, Math.min(start + 0.22, 1)];
        return t.kind === "w" ? (
          <Word key={i} word={t.w} em={false} range={range} progress={scrollYProgress} />
        ) : (
          <Reveal key={i} range={range} progress={scrollYProgress}>
            <InlineLink link={t.link} copied={copied} onCopy={onCopy} />
          </Reveal>
        );
      })}
    </p>
  );
}

function Blank({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <span className="relative inline-block border-b-2 border-dashed border-[#E43D12]/35 align-baseline transition-colors duration-300 focus-within:border-solid focus-within:border-[#E43D12]">
      <span aria-hidden className="invisible block min-w-[5ch] whitespace-pre px-1">
        {value || placeholder}
      </span>
      <input
        aria-label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="absolute inset-0 w-full bg-transparent px-1 italic text-[#E43D12] outline-none [font:inherit] placeholder:italic placeholder:text-[#2A1610]/25"
        style={WONKY}
      />
    </span>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  );
}

function Char({
  ch,
  i,
  total,
  progress,
}: {
  ch: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const start = (i / total) * 0.5;
  const y = useTransform(progress, [start, start + 0.5], ["112%", "0%"]);
  return (
    <motion.span style={{ y: reduce ? "0%" : y }} className="inline-block">
      {ch === " " ? "\u00A0" : ch}
    </motion.span>
  );
}

function SignOff() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "end end"] });
  const text = "Talk soon.";
  const chars = text.split("");
  return (
    <div ref={ref} aria-label={text} role="img">
      <div
        aria-hidden
        className={`${display.className} overflow-hidden pb-[0.12em] text-[clamp(4rem,17vw,15rem)] font-light leading-[0.88] tracking-[-0.055em]`}
        style={WONKY}
      >
        {chars.map((c, i) => (
          <span key={i} className={i >= 5 ? "italic text-[#E43D12]" : ""}>
            <Char ch={c} i={i} total={chars.length} progress={scrollYProgress} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────── PAGE ───────────────── */
type SendState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [topicIdx, setTopicIdx] = useState(0);
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState(""); 
  const [state, setState] = useState<SendState>("idle");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [message, state]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback if clipboard fails
    }
  }

  const canSend =
    name.trim() && /\S+@\S+\.\S+/.test(replyTo) && message.trim().length > 4 && state !== "sending";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honey || !canSend) return;
    setState("sending");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          replyTo, 
          topic: TOPICS[topicIdx], 
          message 
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      // Give the animation a moment to breathe before showing the success state
      await new Promise((r) => setTimeout(r, 600)); 
      
      setState("sent");
      setName("");
      setReplyTo("");
      setMessage("");
    } catch {
      setState("error");
    }
  }

  return (
    <div className={`flex w-full flex-col overflow-x-clip pb-12 text-[#2A1610] ${sans.className}`}>
      
      {/* ───────── 1. HEADER ───────── */}
      <section className="relative px-6 pb-20 pt-40 md:px-0">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className={`${mono.className} mb-6 text-[10px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}>
              Network / Contact
            </p>
            <h1
              className={`${display.className} text-[clamp(3rem,6vw,6rem)] font-light leading-[0.9] tracking-[-0.04em] text-[#2A1610]`}
              style={WONKY}
            >
              <MaskLine>Secure</MaskLine>
              <MaskLine delay={0.12}>
                <span className="italic text-[#E43D12]">Comms.</span>
              </MaskLine>
            </h1>
          </div>

          <Link
            href="/hub"
            className="group flex shrink-0 items-center gap-3 self-start rounded-full border border-[#E43D12]/20 bg-[#E43D12]/5 px-6 py-3 transition-all hover:bg-[#E43D12] hover:shadow-xl md:self-auto"
          >
            <FiArrowLeft className="text-[#E43D12] transition-colors group-hover:text-[#EBE9E1]" />
            <span
              className={`${mono.className} text-[9px] font-bold uppercase tracking-[0.2em] text-[#E43D12] transition-colors group-hover:text-[#EBE9E1]`}
            >
              Back to Hub
            </span>
          </Link>
        </div>
      </section>

      {/* ───────── 2. SCROLL-LINKED INTRO ───────── */}
      <section className="px-6 pb-28 pt-6 md:px-0 md:pb-40">
        <div className="mx-auto max-w-6xl">
          <ScrollWords text={INTRO} />
        </div>
      </section>

      {/* ───────── 3. CHANNEL INDEX ───────── */}
      <section className="relative z-10 px-6 md:px-0">
        <div className="relative mx-auto max-w-6xl">
          {/* Ambient light flare for depth */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E43D12]/5 blur-[80px]" />

          <div className="relative flex items-end justify-between">
            <SectionTag n="01">Where to find me</SectionTag>
            <p className={`${mono.className} mb-10 text-[9px] uppercase tracking-[0.25em] text-[#2A1610]/45`}>
              Local time · <LocalTime />
            </p>
          </div>

          <div className="relative flex flex-col gap-14 md:gap-24">
            {STORY.map((parts, i) => (
              <StoryParagraph
                key={i}
                parts={parts}
                copied={copied}
                onCopy={copyEmail}
                className={["", "md:ml-[10%]", "md:ml-[20%]"][i] ?? ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 4. THE LETTER ───────── */}
      <section className="relative z-10 px-6 pt-28 md:px-0 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <SectionTag n="02">Or write it here</SectionTag>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-[0_20px_40px_-10px_rgba(228,61,18,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] backdrop-blur-xl sm:p-14"
          >
            <AnimatePresence mode="wait">
              {state === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[340px] flex-col items-start justify-center gap-8"
                >
                  <h3
                    className={`${display.className} text-[clamp(2.8rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.04em]`}
                    style={WONKY}
                  >
                    Sent. <span className="italic text-[#E43D12]">I&apos;ll write back.</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className={`${mono.className} text-[10px] font-bold uppercase tracking-[0.2em] text-[#E43D12] underline decoration-[#E43D12]/30 underline-offset-4 hover:decoration-[#E43D12]`}
                  >
                    Write another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-12"
                >
                  <p
                    className={`${display.className} text-[clamp(1.7rem,3.6vw,3.4rem)] font-light leading-[1.45] tracking-[-0.02em]`}
                    style={WONKY}
                  >
                    Hi Rudraksh, I&apos;m{" "}
                    <Blank
                      value={name}
                      onChange={setName}
                      placeholder="your name"
                      label="Your name"
                      autoComplete="name"
                    />{" "}
                    and I&apos;m reaching out about{" "}
                    <button
                      type="button"
                      onClick={() => setTopicIdx((i) => (i + 1) % TOPICS.length)}
                      aria-label={`Topic: ${TOPICS[topicIdx]}. Click to change.`}
                      className="relative inline-block border-b-2 border-dashed border-[#E43D12]/35 align-baseline italic text-[#E43D12] transition-colors hover:border-[#E43D12]"
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={topicIdx}
                          initial={{ y: "55%", opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: "-55%", opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="inline-block px-1"
                        >
                          {TOPICS[topicIdx]}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                    . You can reply to me at{" "}
                    <Blank
                      value={replyTo}
                      onChange={setReplyTo}
                      placeholder="you@email.com"
                      label="Your email"
                      type="email"
                      autoComplete="email"
                    />
                    .
                  </p>

                  <p className={`${mono.className} -mt-6 text-[9px] uppercase tracking-[0.22em] text-[#2A1610]/40`}>
                    Tap the highlighted words to change them
                  </p>

                  <label className="block">
                    <span className="flex items-baseline justify-between">
                      <span className={`${mono.className} text-[10px] font-bold uppercase tracking-[0.25em] text-[#D6536D]`}>
                        Here&apos;s the longer story
                      </span>
                      <span
                        className={`${mono.className} text-[9px] tabular-nums tracking-[0.15em] ${
                          message.length > MAX_CHARS * 0.9 ? "text-[#E43D12]" : "text-[#2A1610]/35"
                        }`}
                      >
                        {message.length}/{MAX_CHARS}
                      </span>
                    </span>
                    <textarea
                      ref={areaRef}
                      rows={1}
                      value={message}
                      maxLength={MAX_CHARS}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What are you working on? What would you like from me?"
                      className="mt-4 block min-h-[3.5rem] w-full resize-none border-b border-[#2A1610]/15 bg-transparent pb-4 text-lg leading-relaxed text-[#2A1610] outline-none transition-colors duration-300 placeholder:text-[#2A1610]/30 focus:border-[#E43D12] sm:text-xl"
                    />
                  </label>

                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    name="company"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <p
                      className={`${mono.className} text-[9px] uppercase tracking-[0.2em] ${
                        state === "error" ? "text-[#E43D12]" : "text-[#2A1610]/40"
                      }`}
                      role={state === "error" ? "alert" : undefined}
                    >
                      {state === "error" ? "That didn't go through. Try again, or email me directly." : "I read every message"}
                    </p>

                    <Magnetic>
                      <button
                        type="submit"
                        disabled={!canSend}
                        className={`${mono.className} group/send flex items-center gap-4 rounded-full bg-[#E43D12] px-9 py-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#EBE9E1] transition-all duration-300 hover:shadow-[0_18px_40px_-10px_rgba(228,61,18,0.55)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:shadow-none`}
                      >
                        {state === "sending" ? "Sending" : "Send it"}
                        <FiArrowRight className="transition-transform duration-500 group-hover/send:-rotate-45" />
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ───────── 5. SIGN-OFF ───────── */}
      <section className="px-6 pt-32 md:px-0 md:pt-48">
        <div className="mx-auto max-w-6xl">
          <SignOff />

          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-[#E43D12]/15 pt-8 sm:flex-row">
            <p className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}>
              System Online · L4 Clearance
            </p>
            <div className="flex gap-4">
              <span className={`h-2 w-2 rounded-full ${state === "sending" ? "bg-[#E43D12]" : "bg-[#EFB11D] animate-pulse"}`} />
              <p className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.25em] text-[#D6536D]`}>
                {state === "sending" ? "Transmitting" : state === "sent" ? "Message Delivered" : "Awaiting Input"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}