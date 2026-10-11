"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { JetBrains_Mono, Manrope } from "next/font/google";

/* -------------------------------------------------------------------------- */
/*  Fonts                                                                     */
/* -------------------------------------------------------------------------- */
const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* -------------------------------------------------------------------------- */
/*  Tokens                                                                    */
/* -------------------------------------------------------------------------- */
const INK = "#ebe8e2"; // soft off-white
const MUTED = "rgba(235,232,226,0.66)"; // body copy
const SILVER = "#8d939d"; // labels
const CHAMPAGNE = "#2dd4bf"; // single restrained accent

const LABEL = `${mono.className} text-[10px] uppercase tracking-widest`;

/* Deck geometry: deliberately tight */
const STEP_DEG = 4; // rotation between neighbouring cards
const INACTIVE_OPACITY = 0.3; // every card that is not in front
const INACTIVE_BLUR_PX = 4; // every card that is not in front
const AUTO_MS = 4200; // time between automatic advances
const HOVER_INTENT_MS = 160; // how long the pointer must rest on a card
const SETTLE_MS = 900; // hover is ignored while the deck is still moving

/* -------------------------------------------------------------------------- */
/*  Card data (hardcoded)                                                     */
/* -------------------------------------------------------------------------- */
/**
 * Full-bleed art that sits behind a card's text.
 * Use `src` for a photo or illustration, `element` for any JSX (SVG, CSS, a
 * component), or both. See the "How to add art to a card" notes in CARDS.
 */
type Backdrop = {
  /** Image path from /public, e.g. "/cards/me.jpg". */
  src?: string;
  /** Any custom JSX: inline SVG, gradients, a component. Fills the card. */
  element?: ReactNode;
  /** CSS object-position for `src`. Aim it at the subject, e.g. "50% 20%" for a face. */
  position?: string;
  /** Which dark gradient keeps the text legible over the art. */
  scrim?: "bottom" | "left" | "full" | "none";
  /** 0 = full colour, 1 = black and white. */
  grayscale?: number;
};

type CardBase = { id: string; label: string; backdrop?: Backdrop };

type CardData = CardBase &
  (
    | {
        kind: "intro";
        greeting: string;
        name: string;
        role: string;
        blurb: string;
      }
    | { kind: "statement"; headline: string; body: string }
    | {
        kind: "stack";
        items: ReadonlyArray<{ name: string; note: string }>;
      }
    | { kind: "method"; title: string; steps: ReadonlyArray<string> }
    | {
        kind: "status";
        headline: string;
        rows: ReadonlyArray<{ k: string; v: string }>;
      }
  );

/*
 * HOW TO ADD ART TO A CARD
 * ------------------------
 * Every card accepts an optional `backdrop`. That is the whole API.
 *
 *   1. A photo or illustration (put the file in /public):
 *        backdrop: { src: "/cards/philosophy.jpg", position: "50% 30%", scrim: "left" }
 *
 *   2. Hand-made graphics (any JSX, including inline SVG):
 *        backdrop: {
 *          scrim: "none",
 *          element: (
 *            <svg viewBox="0 0 300 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
 *              ...paths, circles, gradients...
 *            </svg>
 *          ),
 *        }
 *
 *   3. Both at once: `src` renders first, `element` is layered on top.
 *
 * The card handles the rest: parallax with the deck, the slow drift, the
 * blur/dim when the card is not in front, and the scrim for text contrast.
 * Pick `scrim` by where your text sits: "bottom" (text low), "left", "full",
 * or "none" when your art is already dark enough.
 */
const CARDS: ReadonlyArray<CardData> = [
 {
  id: "intro",
  kind: "intro",
  label: "Identity",
  greeting: "Hello, I'm",
  name: "Rudraksh Gupta",
  role: "AI/ML Engineer & Researcher",
  blurb:
    "I build intelligent systems, full-stack products, and research-driven solutions at the intersection of AI and technology.",
backdrop: {
      src: "/src/assets/images/self.jpeg", 
      position: "60% 30%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }
},
{
  id: "philosophy",
  kind: "statement",
  label: "Philosophy",
  headline: "Building Intelligence.",
  body: "Exploring AI through research, experimentation, and real-world systems.",
backdrop: {
      src: "/src/assets/images/buils.png", 
      position: "60% 30%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }

},
{
  id: "stack",
  kind: "stack",
  label: "Core stack",
  items: [
    { name: "Python", note: "AI / ML" },
    { name: "Next.js", note: "Web" },
    { name: "Django", note: "Backend" },
    { name: "PyTorch", note: "Deep Learning" },
  ],
  backdrop: {
      src: "/src/assets/images/tech.png", 
      position: "60% 30%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }
},
{
  id: "method",
  kind: "method",
  label: "Method",
  title: "How I build",
  steps: [
    "Learn through research and experimentation.",
    "Turn ideas into working prototypes.",
    "Build, test, deploy, and iterate.",
  ],
  backdrop: {
      src: "/src/assets/images/howibuild.png", 
      position: "50% 20%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }
},
  {
    id: "method",
    kind: "method",
    label: "Method",
    title: "How I work",
    steps: [
      "Measure before optimizing.",
      "Ship small, iterate fast.",
      "Instrument everything.",
    ],
    backdrop: {
      src: "/src/assets/images/howiwork.png", 
      position: "50% 20%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }
  },
  {
    id: "clearance",
    kind: "status",
    label: "Clearance",
    headline: "Ready for deployment.",
    rows: [
      { k: "Status", v: "ONLINE" },
      { k: "Deployment", v: "Ready" },
      { k: "Clearance", v: "Level L4" },
    ],
    backdrop: {
      src: "/src/assets/images/deployment.png", 
      position: "60% 30%", // Keeps the focus on the top of the image
      scrim: "bottom"      // Claude will automatically fade the bottom to black for your text
    }
  },
];

const wrapIndex = (v: number, total: number): number =>
  ((Math.round(v) % total) + total) % total;

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */
export interface PremiumIntroProps {
  /** Skip the intro and enter the main dashboard. Fires immediately. */
  onEnter: () => void;
  /** Optional portrait shown on the Identity card. Nothing is drawn without it. */
  photoSrc?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
export default function PremiumIntro({ onEnter, photoSrc }: PremiumIntroProps) {
  const reduced = useReducedMotion() ?? false;
  const total = CARDS.length;

  // Continuous index. Whole numbers = that card is squared up in front.
  const active = useMotionValue(0);
  // 0 = closed deck, 1 = fully set. Plays once on load.
  const spread = useMotionValue(reduced ? 1 : 0);

  const [idx, setIdx] = useState(0);
  useMotionValueEvent(active, "change", (v) => {
    const next = wrapIndex(v, total);
    setIdx((cur) => (cur === next ? cur : next));
  });

  const hovering = useRef(false);
  const panning = useRef(false);
  const dragged = useRef(false);
  const lockUntil = useRef(0);
  const hoverTimer = useRef<number | null>(null);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  const clearHover = useCallback(() => {
    if (hoverTimer.current !== null) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const moveTo = useCallback(
    (target: number) => {
      clearHover();
      lockUntil.current = performance.now() + SETTLE_MS;
      anim.current?.stop();
      anim.current = animate(
        active,
        target,
        reduced
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 80, damping: 19, mass: 0.95 },
      );
    },
    [active, clearHover, reduced],
  );

  const step = useCallback(
    (dir: 1 | -1) => moveTo(Math.round(active.get()) + dir),
    [active, moveTo],
  );

  /** Bring card `index` to the front by the shortest route. */
  const goTo = useCallback(
    (index: number) => {
      const base = Math.round(active.get());
      let delta = (((index - base) % total) + total) % total;
      if (delta > total / 2) delta -= total;
      if (delta === 0) return;
      moveTo(base + delta);
    },
    [active, moveTo, total],
  );

  /**
   * Hover-to-front with intent: the pointer has to rest on a background card
   * briefly, and hover is ignored while the deck is still settling. That stops
   * a resting pointer from chain-flipping through the deck as cards slide
   * underneath it.
   */
  const hoverCard = useCallback(
    (index: number) => {
      if (performance.now() < lockUntil.current) return;
      if (index === wrapIndex(active.get(), total)) return;
      clearHover();
      hoverTimer.current = window.setTimeout(() => {
        hoverTimer.current = null;
        goTo(index);
      }, HOVER_INTENT_MS);
    },
    [active, clearHover, goTo, total],
  );

  // Opening move: the closed deck settles into its offsets.
  useEffect(() => {
    if (reduced) {
      spread.set(1);
      return;
    }
    const c = animate(spread, 1, {
      type: "spring",
      stiffness: 60,
      damping: 16,
      delay: 0.3,
    });
    return () => c.stop();
  }, [reduced, spread]);

  // Automatic circulation.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (hovering.current || panning.current) return;
      if (document.visibilityState !== "visible") return;
      step(1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduced, step]);

  useEffect(() => clearHover, [clearHover]);

  return (
    <div
      className={`${sans.className} relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#0a0b0e] text-[#ebe8e2] antialiased`}
    >
      {/* Wide ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(160,172,190,0.10) 0%, rgba(160,172,190,0.03) 45%, rgba(10,11,14,0) 75%)",
        }}
      />
      {/* Edge falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,11,14,0) 50%, rgba(4,5,7,0.78) 100%)",
        }}
      />
      {/* Grain keeps dark gradients from banding */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top bar */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <span className={LABEL} style={{ color: INK }}>
          Rudraksh
        </span>
        <span className={LABEL} style={{ color: SILVER }}>
          Portfolio / 2026
        </span>
      </motion.header>

      {/* Deck stage */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-4">
        <motion.div
          role="group"
          aria-roledescription="carousel"
          aria-label="Operator dossier"
          className="relative w-full [--h:372px] [--w:244px] sm:[--h:448px] sm:[--w:332px]"
          style={{
            height: "calc(var(--h) + 40px)",
            perspective: "1200px",
            perspectiveOrigin: "50% 80%",
            touchAction: "pan-y",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") hovering.current = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") {
              hovering.current = false;
              clearHover();
            }
          }}
          onPanStart={() => {
            panning.current = true;
            dragged.current = true;
            clearHover();
            anim.current?.stop();
          }}
          onPan={(_, info) => {
            active.set(active.get() - info.delta.x * 0.008);
          }}
          onPanEnd={(_, info) => {
            panning.current = false;
            moveTo(Math.round(active.get() - info.velocity.x * 0.0002));
            // Swallow the click that follows a drag.
            window.setTimeout(() => {
              dragged.current = false;
            }, 60);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          {/* Ambient glow directly behind the deck: white at 5% */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(120vw,860px)] w-[min(150vw,1180px)] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.028) 45%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Contact shadow */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 h-8 w-[48%] max-w-[460px] -translate-x-1/2 rounded-full bg-black/80 blur-2xl"
          />

          {CARDS.map((card, i) => (
            <DeckCard
              key={card.id}
              card={card}
              index={i}
              total={total}
              active={active}
              spread={spread}
              photoSrc={photoSrc}
              onSelect={(n) => {
                if (!dragged.current) goTo(n);
              }}
              onHover={hoverCard}
              onHoverEnd={clearHover}
            />
          ))}
        </motion.div>
      </div>

      {/* Card selector */}
      <nav
        aria-label="Select dossier card"
        className="relative z-10 flex flex-col items-center gap-1"
      >
        <div className="flex items-center gap-2">
          {CARDS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Show ${c.label}`}
              aria-current={i === idx}
              onClick={() => goTo(i)}
              className="group flex min-h-11 min-w-11 items-center justify-center px-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#cfc29f]"
            >
              <span
                className={`block h-px transition-all duration-500 ${
                  i === idx
                    ? "w-12 bg-[#cfc29f]"
                    : "w-7 bg-white/20 group-hover:bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>
        <span className={LABEL} style={{ color: SILVER }}>
          {CARDS[idx].label}
        </span>
      </nav>

      {/* CTA: zero-wait entry */}
      <motion.footer
        className="relative z-10 flex flex-col items-center gap-3 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 sm:pb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <motion.button
          type="button"
          autoFocus
          onClick={onEnter}
          whileTap={{ scale: 0.98 }}
          className={`${mono.className} group relative min-h-11 touch-manipulation overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-[11px] font-medium uppercase tracking-widest text-[#ebe8e2] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.09] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#cfc29f] sm:px-10`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <span className="relative">[ Initialize Console ]</span>
        </motion.button>
        <span className={LABEL} style={{ color: SILVER }}>
          Press Enter to skip
        </span>
      </motion.footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  One card in the deck                                                      */
/*                                                                            */
/*  `d` is the signed, wrapped distance from the front card (0 = front).      */
/*  Everything below is derived from it, so any move, whether auto, drag,     */
/*  hover or click, animates the same way: the card that was in front        */
/*  blurs, dims and drops behind while the chosen card rises to focus.        */
/* -------------------------------------------------------------------------- */
const DeckCard = memo(function DeckCard({
  card,
  index,
  total,
  active,
  spread,
  photoSrc,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  card: CardData;
  index: number;
  total: number;
  active: MotionValue<number>;
  spread: MotionValue<number>;
  photoSrc?: string;
  onSelect: (index: number) => void;
  onHover: (index: number) => void;
  onHoverEnd: () => void;
}) {
  const half = total / 2;

  const d = useTransform(active, (a) => {
    let v = (((index - a) % total) + total) % total;
    if (v >= half) v -= total;
    return v;
  });

  // Geometry: small rotation, small offset, shallow drop, gentle depth.
  const rotate = useTransform([d, spread], ([v, s]: number[]) => v * STEP_DEG * s);
  const x = useTransform(
    [d, spread],
    ([v, s]: number[]) => `calc(var(--w) * ${(v * 0.045 * s).toFixed(4)})`,
  );
  const y = useTransform([d, spread], ([v, s]: number[]) => Math.abs(v) * 8 * s);
  const z = useTransform([d, spread], ([v, s]: number[]) => -Math.abs(v) * 70 * s);
  const scale = useTransform(d, (v) => 1 - Math.min(Math.abs(v), half) * 0.035);

  // Depth of field: front = 1 / sharp, every other card = 0.3 / blur(4px).
  // The wrap fade only affects a card while it travels the long way round
  // behind the deck, so nothing visibly teleports. At rest it never applies.
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    const base = 1 - (1 - INACTIVE_OPACITY) * Math.min(a, 1);
    const edge = half - 0.5;
    const wrapFade = a <= edge ? 1 : Math.max(0, (half - a) / 0.5);
    return base * wrapFade;
  });
  const filter = useTransform(d, (v) => {
    const b = Math.min(Math.abs(v), 1) * INACTIVE_BLUR_PX;
    return b < 0.05 ? "none" : `blur(${b.toFixed(2)}px)`;
  });

  const zIndex = useTransform(d, (v) =>
    Math.round(1000 - Math.abs(v) * 100 + (v > 0 ? 1 : 0)),
  );
  const rim = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v)));

  // `photoSrc` is a shortcut for the Identity card's backdrop image.
  const backdrop: Backdrop | undefined =
    card.kind === "intro" && photoSrc
      ? { ...card.backdrop, src: photoSrc }
      : card.backdrop;

  return (
    <motion.div
      tabIndex={0}
      role="group"
      aria-roledescription="slide"
      aria-label={`${card.label}, ${index + 1} of ${total}`}
      onClick={() => onSelect(index)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onHover(index);
      }}
      onPointerLeave={onHoverEnd}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(index);
        }
      }}
      // Glass lives on this element so backdrop-blur can see the cards behind it.
      className="absolute cursor-pointer overflow-hidden rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-xl outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#cfc29f]"
      style={{
        left: "50%",
        bottom: "20px",
        width: "var(--w)",
        height: "var(--h)",
        marginLeft: "calc(var(--w) / -2)",
        transformOrigin: "50% 100%", // center bottom
        boxShadow:
          "0 40px 80px -32px rgba(0,0,0,0.9), 0 8px 24px -12px rgba(0,0,0,0.6)",
        x,
        y,
        z,
        rotate,
        scale,
        opacity,
        filter,
        zIndex,
      }}
    >
      {/* Layer 1: art behind everything (photo, SVG, whatever you pass in) */}
      {backdrop && <CardBackdrop backdrop={backdrop} d={d} />}

      {/* Layer 2: very subtle sheen so the art still reads as glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Layer 3: text */}
      <div className="relative flex h-full flex-col p-6 sm:p-8">
        <header className="flex items-center justify-between">
          <span className={LABEL} style={{ color: SILVER }}>
            {card.label}
          </span>
          <span className={LABEL} style={{ color: "rgba(141,147,157,0.55)" }}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </header>

        <div className="mt-auto">
          <CardBody card={card} />
        </div>
      </div>

      {/* Crisp rim on the front card so its glass edge separates from the glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          opacity: rim,
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      />
    </motion.div>
  );
});

/* -------------------------------------------------------------------------- */
/*  CardBackdrop: the art layer                                               */
/*                                                                            */
/*  Structure (outer to inner):                                               */
/*    wrapper   oversized by 10% on every side so it can move without ever    */
/*              exposing an edge. Its x / scale follow `d` (parallax).        */
/*      img     slow Ken Burns drift (scale + y loop), independent of `d`.    */
/*      element your custom JSX, if any, layered over the image.             */
/*    scrims    fixed to the card (NOT oversized, NOT moving) so text         */
/*              contrast never shifts while the art does.                     */
/* -------------------------------------------------------------------------- */
const SCRIMS: Record<NonNullable<Backdrop["scrim"]>, string> = {
  bottom:
    "linear-gradient(to top, rgba(10,11,14,0.96) 0%, rgba(10,11,14,0.84) 36%, rgba(10,11,14,0.4) 64%, rgba(10,11,14,0.06) 100%)",
  left: "linear-gradient(to right, rgba(10,11,14,0.92) 0%, rgba(10,11,14,0.62) 52%, rgba(10,11,14,0.1) 100%)",
  full: "rgba(10,11,14,0.66)",
  none: "transparent",
};

function CardBackdrop({
  backdrop,
  d,
}: {
  backdrop: Backdrop;
  d: MotionValue<number>;
}) {
  const reduced = useReducedMotion() ?? false;
  const { src, element, position = "50% 30%", scrim = "bottom", grayscale = 0 } =
    backdrop;

  // Parallax: as the deck turns, the art slides the opposite way (clamped to
  // +-26px so it never outruns the 10% oversize), and it eases from slightly
  // zoomed (background card) to 1.0 (front card), so it "settles" on arrival.
  const shift = useTransform(d, [-1, 0, 1], [26, 0, -26]);
  const settle = useTransform(d, [-1, 0, 1], [1.1, 1, 1.1]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute"
        style={{ inset: "-10%", x: shift, scale: settle }}
      >
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            src={src}
            alt=""
            draggable={false}
            className="h-full w-full max-w-none select-none object-cover"
            style={{
              objectPosition: position,
              filter: `grayscale(${grayscale}) contrast(1.05)`,
            }}
            animate={reduced ? undefined : { scale: [1, 1.06, 1], y: [0, -8, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {element && <div className="absolute inset-0">{element}</div>}
      </motion.div>

      {/* Contrast scrims stay locked to the card */}
      {scrim !== "none" && (
        <div className="absolute inset-0" style={{ background: SCRIMS[scrim] }} />
      )}
      {/* Keeps the header labels legible over any art */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,11,14,0.55), rgba(10,11,14,0))",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card bodies: typography only (art lives in CardBackdrop)                  */
/* -------------------------------------------------------------------------- */
function CardBody({ card }: { card: CardData }): ReactNode {
  switch (card.kind) {
    case "intro":
      return (
        <>
          <p className="text-[13px] font-light" style={{ color: "rgba(235,232,226,0.6)" }}>
            {card.greeting}
          </p>
          <h2
            className="mt-1.5 text-[36px] font-semibold leading-[0.98] tracking-tight sm:text-[48px]"
            style={{ color: INK }}
          >
            {card.name}
          </h2>
          <p className={`${LABEL} mt-4`} style={{ color: CHAMPAGNE }}>
            {card.role}
          </p>
          <div className="my-5 h-px w-full bg-white/10 sm:my-6" />
          <p
            className="text-[13px] font-light leading-relaxed sm:text-[14px]"
            style={{ color: "rgba(235,232,226,0.78)" }}
          >
            {card.blurb}
          </p>
        </>
      );

    case "statement":
      return (
        <>
          <h2
            className="text-[30px] font-light leading-[1.08] tracking-tight sm:text-[42px]"
            style={{ color: INK }}
          >
            {card.headline}
          </h2>
          <div className="my-5 h-px w-12 bg-white/25 sm:my-6" />
          <p
            className="max-w-[26ch] text-[13px] font-light leading-relaxed sm:text-[15px]"
            style={{ color: MUTED }}
          >
            {card.body}
          </p>
        </>
      );

    case "stack":
      return (
        <ul className="border-t border-white/10">
          {card.items.map((item) => (
            <li
              key={item.name}
              className="flex items-baseline justify-between border-b border-white/10 py-3.5 sm:py-[18px]"
            >
              <span
                className="text-[20px] font-light tracking-tight sm:text-[26px]"
                style={{ color: INK }}
              >
                {item.name}
              </span>
              <span className={LABEL} style={{ color: SILVER }}>
                {item.note}
              </span>
            </li>
          ))}
        </ul>
      );

    case "method":
      return (
        <>
          <h2
            className="text-[26px] font-light leading-none tracking-tight sm:text-[34px]"
            style={{ color: INK }}
          >
            {card.title}
          </h2>
          <div className="my-5 h-px w-12 bg-white/25 sm:my-6" />
          <ul className="space-y-3.5 sm:space-y-4">
            {card.steps.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3 text-[13px] font-light leading-snug sm:text-[15px]"
                style={{ color: MUTED }}
              >
                <span
                  aria-hidden
                  className="mt-[0.7em] h-px w-4 shrink-0"
                  style={{ background: CHAMPAGNE }}
                />
                {s}
              </li>
            ))}
          </ul>
        </>
      );

    case "status":
      return (
        <>
          <h2
            className="text-[28px] font-light leading-[1.08] tracking-tight sm:text-[38px]"
            style={{ color: INK }}
          >
            {card.headline}
          </h2>
          <dl className="mt-6 border-t border-white/10 sm:mt-8">
            {card.rows.map((r) => (
              <div
                key={r.k}
                className="flex items-baseline justify-between border-b border-white/10 py-3 sm:py-3.5"
              >
                <dt className={LABEL} style={{ color: SILVER }}>
                  {r.k}
                </dt>
                <dd
                  className={`${mono.className} flex items-center gap-2 text-[12px] tracking-wider`}
                  style={{ color: INK }}
                >
                  {r.v === "ONLINE" && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full motion-safe:animate-pulse"
                      style={{ background: CHAMPAGNE }}
                    />
                  )}
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
        </>
      );
  }
}