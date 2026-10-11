"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { portfolioData } from "@/lib/intel";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const WONKY = { fontVariationSettings: '"SOFT" 100, "WONK" 1' } as const;

/* ───────────────────────── THE PINBOARD ─────────────────────────
   A little deck of paper cards built from your real deployments.
   • Drag the top card and flick it away — it slides back underneath the pile.
   • Arrow keys / the ← → buttons do the same.
   • "Open ↗" on a card goes to that project. */
const missions = portfolioData.missions.tier_1_deployments;
type Mission = (typeof missions)[number];
type DeckCardData = { id: string; m: Mission };

const COVERS = [
  "from-[#1a1d23] via-[#111827] to-[#2a3344]",
  "from-[#11151a] via-[#191914] to-[#3a3327]",
  "from-[#11191b] via-[#171d1a] to-[#243b38]",
];
const ROT = [-2.5, 3, -4, 2, -1.5, 4];
const TAPE = ["#EFB11D", "#D6536D", "#EFB11D", "#E43D12"];
const PAPER =
  "relative h-full w-full rounded-[5px] bg-[#F6F2E9] p-3 shadow-[0_22px_34px_-14px_rgba(42,22,16,0.4),0_2px_0_rgba(255,255,255,0.8)_inset]";
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;

function DeckCard({
  card,
  index,
  pos,
  n,
  onNext,
}: {
  card: DeckCardData;
  index: number;
  pos: number; // 0 = top of the pile
  n: number;
  onNext: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useTransform(x, [-220, 0, 220], [-14, 0, 14]); // paper leans into the drag
  const moved = useRef(false);
  const isTop = pos === 0;

  /* when a card stops being the top one, glide it back to the pile */
  useEffect(() => {
    if (!isTop) {
      animate(x, 0, SPRING);
      animate(y, 0, SPRING);
    }
  }, [isTop, x, y]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setTimeout(() => (moved.current = false), 0);
    const far = Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 650;
    if (far) {
      const dir = info.offset.x >= 0 ? 1 : -1;
      animate(x, dir * 460, { duration: 0.24, ease: "easeOut", onComplete: onNext });
    } else {
      animate(x, 0, SPRING);
      animate(y, 0, SPRING);
    }
  };

  const rot = ROT[index % ROT.length];

  return (
    <motion.div
      initial={false}
      animate={{
        scale: 1 - Math.min(pos, 3) * 0.045,
        rotate: rot,
        y: Math.min(pos, 3) * 16,
        opacity: pos > 3 ? 0 : 1,
      }}
      transition={SPRING}
      style={{ zIndex: n - pos, pointerEvents: isTop ? "auto" : "none" }}
      className="absolute inset-0"
    >
      <motion.div
        data-cursor="Drag"
        drag={isTop ? "x" : false}
        dragMomentum={false}
        dragElastic={0.9}
        onDragStart={() => (moved.current = true)}
        onDragEnd={onDragEnd}
        whileHover={isTop ? { scale: 1.025 } : undefined}
        whileTap={isTop ? { scale: 1.04 } : undefined}
        style={{ x, y, rotate: tilt }}
        className="relative h-full w-full touch-manipulation select-none"
      >
        {/* washi tape */}
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 backdrop-blur-[1px]"
          style={{
            background: TAPE[index % TAPE.length],
            opacity: 0.72,
            rotate: `${index % 2 ? 4 : -3}deg`,
            clipPath:
              "polygon(0 8%, 4% 0, 8% 10%, 12% 0, 16% 10%, 20% 0, 100% 0, 100% 100%, 20% 100%, 16% 90%, 12% 100%, 8% 90%, 4% 100%, 0 92%)",
          }}
        />

        <div className={PAPER}>
            <div className={`relative h-[62%] overflow-hidden bg-gradient-to-br ${COVERS[index % COVERS.length]}`}>
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(207,194,159,0.2),transparent_40%)]" />
              <p
                className={`${mono.className} absolute left-3 top-3 max-w-[62%] truncate text-[8px] uppercase tracking-[0.2em] text-[#EBE9E1]/75`}
              >
                {card.m.stack.slice(0, 3).join(" · ")}
              </p>
              <span
                className={`${mono.className} pointer-events-none absolute right-3 top-3 -rotate-[5deg] whitespace-nowrap border border-[#E43D12] bg-[#F6F2E9]/90 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#E43D12]`}
              >
                {card.m.status}
              </span>
              <h3
                className={`${display.className} absolute bottom-3 left-3 right-3 text-[1.9rem] font-light leading-[0.95] tracking-[-0.03em] text-[#EBE9E1]`}
                style={WONKY}
              >
                {card.m.title}
              </h3>
            </div>

            <div className="px-1 pt-3">
              <p className={`${display.className} line-clamp-3 text-[13px] italic leading-snug text-[#2A1610]/80`}>
                {card.m.directive}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`${mono.className} text-[8px] uppercase tracking-[0.2em] text-[#2A1610]/45`}>
                  No. {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/project/${card.m.id}`}
                  onClick={(e: React.MouseEvent) => {
                    if (moved.current) e.preventDefault();
                  }}
                  className={`${mono.className} inline-flex min-h-11 items-center px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E43D12] underline-offset-4 hover:underline active:text-[#2A1610]`}
                >
                  Open ↗
                </Link>
              </div>
            </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

function Pinboard() {
  const [top, setTop] = useState(0);
  const [used, setUsed] = useState(false);

  const cards: DeckCardData[] = useMemo(
    () => missions.map((m) => ({ id: m.id, m })),
    []
  );
  const n = cards.length;

  const next = useCallback(() => {
    setUsed(true);
    setTop((t) => (t + 1) % Math.max(n, 1));
  }, [n]);
  const prev = useCallback(() => {
    setUsed(true);
    setTop((t) => (t - 1 + n) % Math.max(n, 1));
  }, [n]);

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#2A1610]/20 bg-white/50 text-[#2A1610] transition-colors hover:bg-[#E43D12] hover:text-[#EBE9E1] active:scale-95 active:bg-[#E43D12] active:text-[#EBE9E1]";

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Deck of deployments. Use the arrow keys to flip through."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="relative flex min-h-[460px] w-full flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#2A1610]/10 bg-[#E4DED0] shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#E43D12]/40"
    >
      {/* paper grain + soft vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(42,22,16,0.16))" }}
      />

      {/* label */}
      <div className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full border border-[#2A1610]/15 bg-white/50 px-3 py-1.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E43D12]" />
        <span className={`${mono.className} text-[9px] uppercase tracking-widest text-[#2A1610]`}>
          Deployments · {String(n).padStart(2, "0")}
        </span>
      </div>

      {/* hand-written hint, fades once you've touched the deck */}
      <div
        aria-hidden
        className={`pointer-events-none absolute right-6 top-5 z-20 rotate-[5deg] text-right transition-opacity duration-700 ${
          used ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className={`${display.className} text-xl italic text-[#E43D12]`} style={WONKY}>
          flick one
        </p>
        <svg width="64" height="40" viewBox="0 0 64 40" fill="none" stroke="#E43D12" strokeWidth="1.6" strokeLinecap="round">
          <path d="M60 4 C 40 2, 14 10, 8 32" />
          <path d="M2 24 L8 33 L17 27" />
        </svg>
      </div>

      {/* the deck */}
      <div className="relative z-10 aspect-[3/4] w-[min(74%,20rem)]">
        {cards.map((card, i) => (
          <DeckCard key={card.id} card={card} index={i} pos={(i - top + n) % n} n={n} onNext={next} />
        ))}
      </div>

      {/* counter + controls */}
      <div className="absolute inset-x-6 bottom-6 z-20 flex items-center justify-between">
        <span className={`${mono.className} text-[9px] uppercase tracking-[0.22em] text-[#2A1610]/60`}>
          {String(n ? (top % n) + 1 : 0).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          <button type="button" onClick={prev} aria-label="Previous card" className={btn}>
            ←
          </button>
          <button type="button" onClick={next} aria-label="Next card" className={btn}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}


export default function OperatorProfile() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 overflow-x-hidden px-4 pt-32 sm:px-6 sm:pt-40"
    >
      <div className="grid w-full min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <section className="order-1 w-full lg:col-span-5" aria-label="Project deployment deck">
            <p className={`${mono.className} mb-5 text-center text-[9px] font-medium uppercase tracking-[0.22em] text-[#D6536D]`}>
              Project deployment deck
            </p>
            <Pinboard />
          </section>

          <div className="order-2 flex w-full min-w-0 flex-col justify-center py-4 lg:col-span-7">
            <div className="mb-2">
              <span className={`${mono.className} text-[10px] font-bold uppercase tracking-[0.3em] text-[#D6536D]`}>
                System Overview
              </span>
            </div>

            <h1 className="mb-8 bg-gradient-to-br from-[#2A1610] to-[#E43D12] bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl md:text-6xl">
              Architecting the <br />
              <span className="italic">Intelligent</span> Web.
            </h1>

            <div className="max-w-2xl space-y-6 text-sm font-medium leading-relaxed text-[#2A1610] sm:text-base">
              <p>
                I am an <strong className="font-bold text-[#E43D12]">AI/ML Systems Architect</strong> bridging the gap between complex neural research and reliable, real-world deployment.
              </p>
              <p>
                With extensive experience in Python ecosystems and edge deployments, I don&apos;t just build algorithms—I engineer deterministic, living systems that learn, adapt, and scale. From predictive models to seamless user interfaces, I craft solutions that perform flawlessly in production environments.
              </p>
            </div>

            <div className="my-10 grid grid-cols-3 gap-3 border-y border-[#E43D12]/15 py-6 sm:gap-8">
              <div className="min-w-0">
                <div className="mb-1 text-2xl font-bold text-[#2A1610] sm:text-3xl">08+</div>
                <div className={`${mono.className} text-[8px] font-bold uppercase tracking-[0.12em] text-[#D6536D] sm:text-[9px] sm:tracking-widest`}>Tier-1 Deployments</div>
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-2xl font-bold text-[#2A1610] sm:text-3xl">99.9%</div>
                <div className={`${mono.className} text-[8px] font-bold uppercase tracking-[0.12em] text-[#D6536D] sm:text-[9px] sm:tracking-widest`}>System Uptime</div>
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-2xl font-bold text-[#2A1610] sm:text-3xl">L4</div>
                <div className={`${mono.className} text-[8px] font-bold uppercase tracking-[0.12em] text-[#D6536D] sm:text-[9px] sm:tracking-widest`}>Clearance Level</div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="https://github.com/Rudrakshgupta22"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-[#E43D12]/30 bg-[#E43D12]/5 px-8 py-4 text-[#E43D12] transition-all duration-300 hover:bg-[#E43D12] hover:text-[#EBE9E1] active:scale-95 active:bg-[#E43D12] active:text-[#EBE9E1]"
              >
                <FiGithub className="relative z-10 text-lg" />
                <span className={`${mono.className} relative z-10 text-[10px] font-bold uppercase tracking-[0.2em]`}>Access GitHub</span>
              </Link>

              <Link
                href="https://linkedin.com/in/rudraksh-gupta-188890380/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex min-h-11 items-center justify-center gap-3 overflow-hidden rounded-full border border-[#2A1610]/20 bg-[#2A1610]/5 px-8 py-4 text-[#2A1610] transition-all duration-300 hover:bg-[#2A1610] hover:text-[#EBE9E1] active:scale-95 active:bg-[#2A1610] active:text-[#EBE9E1]"
              >
                <FiLinkedin className="relative z-10 text-lg" />
                <span className={`${mono.className} relative z-10 text-[10px] uppercase tracking-[0.2em]`}>Secure Comms</span>
              </Link>
            </div>
          </div>
      </div>

    </motion.div>
  );
}