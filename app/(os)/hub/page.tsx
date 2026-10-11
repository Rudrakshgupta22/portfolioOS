"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import { portfolioData } from "@/lib/intel";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import HeroPortrait3D from "@/components/HeroPortrait3D";

const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const WONKY = { fontVariationSettings: '"SOFT" 100, "WONK" 1' } as const;

/* Optional: drop a portrait in /public and point this at it.
   If it exists it becomes the top polaroid of the deck. If not, the deck is just your projects. */
const PHOTO = "/self.jpeg";

/* ───────────────────────── THE PINBOARD ─────────────────────────
   A little deck of paper cards built from your real deployments.
   • Drag the top card and flick it away — it slides back underneath the pile.
   • Arrow keys / the ← → buttons do the same.
   • "Open ↗" on a card goes to that project. */
const missions = portfolioData.missions.tier_1_deployments;
type Mission = (typeof missions)[number];
type DeckCardData =
  | { kind: "portrait"; id: string }
  | { kind: "project"; id: string; m: Mission };

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
    const far =
      Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 650 || Math.abs(info.offset.y) > 150;
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
        drag={isTop}
        dragMomentum={false}
        dragElastic={0.9}
        onDragStart={() => (moved.current = true)}
        onDragEnd={onDragEnd}
        whileHover={isTop ? { scale: 1.025 } : undefined}
        whileTap={isTop ? { scale: 1.04 } : undefined}
        style={{ x, y, rotate: tilt }}
        className="relative h-full w-full touch-none select-none"
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

        {card.kind === "portrait" ? (
          <div className={PAPER}>
            <div className="h-[80%] overflow-hidden bg-[#0a0b0e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTO}
                alt="Rudraksh Gupta"
                draggable={false}
                className="h-full w-full object-cover"
                style={{ filter: "grayscale(0.3) contrast(1.08) sepia(0.12)" }}
              />
            </div>
            <div className="flex h-[20%] items-end justify-between px-1 pb-1">
              <span className={`${display.className} text-2xl italic text-[#2A1610]`} style={WONKY}>
                Rudraksh
              </span>
              <span className={`${mono.className} text-[8px] uppercase tracking-[0.18em] text-[#D6536D]`}>
                AI/ML Architect
              </span>
            </div>
          </div>
        ) : (
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
                className={`${mono.className} absolute left-3 top-3 text-[8px] uppercase tracking-[0.25em] text-[#EBE9E1]/75`}
              >
                {card.m.stack.slice(0, 3).join(" · ")}
              </p>
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
                  className={`${mono.className} text-[9px] font-bold uppercase tracking-[0.2em] text-[#E43D12] underline-offset-4 hover:underline`}
                >
                  Open ↗
                </Link>
              </div>
            </div>

            {/* rubber stamp */}
            <span
              className={`${mono.className} pointer-events-none absolute bottom-[3.4rem] right-4 -rotate-[9deg] border border-[#E43D12] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.22em] text-[#E43D12] opacity-80 mix-blend-multiply`}
            >
              {card.m.status}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Pinboard() {
  const [photo, setPhoto] = useState<"loading" | "ok" | "none">("loading");
  const [top, setTop] = useState(0);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setPhoto("ok");
    img.onerror = () => setPhoto("none");
    img.src = PHOTO;
  }, []);

  const cards: DeckCardData[] = useMemo(
    () => [
      ...(photo === "ok" ? [{ kind: "portrait", id: "portrait" } as DeckCardData] : []),
      ...missions.map((m) => ({ kind: "project", id: m.id, m }) as DeckCardData),
    ],
    [photo]
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
    "flex h-9 w-9 items-center justify-center rounded-full border border-[#2A1610]/20 bg-white/50 text-[#2A1610] transition-colors hover:bg-[#E43D12] hover:text-[#EBE9E1]";

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Deck of deployments. Use the arrow keys to flip through."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="relative flex min-h-[460px] w-full flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#2A1610]/10 bg-[#E4DED0] shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#E43D12]/40 lg:min-h-0 lg:w-5/12"
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
      className="flex w-full flex-col gap-12"
    >
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-stretch xl:gap-12">
        <div className="w-full min-w-0 lg:w-5/12">
          <HeroPortrait3D
            monoClass={mono.className}
            displayClass={display.className}
          />
        </div>

        <div className="relative z-10 flex w-full min-w-0 flex-col justify-center py-4 lg:w-7/12">
        
        <div className="mb-2">
           <span className={`${mono.className} text-[10px] uppercase tracking-[0.3em] text-[#D6536D] font-bold`}>
              System Overview
           </span>
        </div>

        {/* Deep Espresso to Vibrant Orange Gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8 bg-gradient-to-br from-[#2A1610] to-[#E43D12] text-transparent bg-clip-text">
          Architecting the <br />
          <span className="italic">Intelligent</span> Web.
        </h1>

        <div className="space-y-6 text-[#2A1610] font-medium leading-relaxed text-sm sm:text-base max-w-2xl">
          <p>
            I am an <strong className="text-[#E43D12] font-bold">AI/ML Systems Architect</strong> bridging the gap between complex neural research and reliable, real-world deployment. 
          </p>
          <p>
            With extensive experience in Python ecosystems and edge deployments, I don't just build algorithms—I engineer deterministic, living systems that learn, adapt, and scale. From predictive models to seamless user interfaces, I craft solutions that perform flawlessly in production environments.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 my-10 py-6 border-y border-[#E43D12]/15">
          <div>
            <div className="text-2xl sm:text-3xl text-[#2A1610] font-bold mb-1">08+</div>
            <div className={`${mono.className} text-[9px] uppercase tracking-widest text-[#D6536D] font-bold`}>Tier-1 Deployments</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-[#2A1610] font-bold mb-1">99.9%</div>
            <div className={`${mono.className} text-[9px] uppercase tracking-widest text-[#D6536D] font-bold`}>System Uptime</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl text-[#2A1610] font-bold mb-1">L4</div>
            <div className={`${mono.className} text-[9px] uppercase tracking-widest text-[#D6536D] font-bold`}>Clearance Level</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="https://github.com/Rudrakshgupta22" 
            target="_blank"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#E43D12]/30 bg-[#E43D12]/5 hover:bg-[#E43D12] hover:text-[#EBE9E1] transition-all duration-300 overflow-hidden text-[#E43D12]"
          >
            <FiGithub className="text-lg relative z-10" />
            <span className={`${mono.className} text-[10px] uppercase tracking-[0.2em] relative z-10 font-bold`}>Access GitHub</span>
          </Link>

          <Link 
            href="https://linkedin.com/in/rudraksh-gupta-188890380/" 
            target="_blank"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#2A1610]/20 bg-[#2A1610]/5 hover:bg-[#2A1610] hover:text-[#EBE9E1] transition-all duration-300 overflow-hidden text-[#2A1610]"
          >
            <FiLinkedin className="text-lg relative z-10" />
            <span className={`${mono.className} text-[10px] uppercase tracking-[0.2em] relative z-10 font-bold`}>Secure Comms</span>
          </Link>
        </div>

        </div>
      </div>

      <section className="w-full" aria-label="Project deployment deck">
        <p className={`${mono.className} mb-5 text-[9px] font-medium uppercase tracking-[0.22em] text-[#D6536D]`}>
          Project deployment deck
        </p>
        <Pinboard />
      </section>
    </motion.div>
  );
}