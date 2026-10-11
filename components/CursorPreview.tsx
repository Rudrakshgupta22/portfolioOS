"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";
import { useEffect } from "react";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export type PreviewItem = {
  title: string;
  caption?: string; // small mono line on the card, e.g. "DJANGO · PYTHON · SQLITE"
  gradient?: string; // tailwind gradient classes, e.g. "from-[#1a1d23] via-[#111827] to-[#2a3344]"
};

type Ctx = { show: (item: PreviewItem) => void; hide: () => void };
const PreviewContext = createContext<Ctx>({ show: () => {}, hide: () => {} });

/** Call inside any component under <CursorPreviewProvider>. */
export const useCursorPreview = () => useContext(PreviewContext);

/**
 * Wrap the page/section that contains your project cards.
 * It does NOT change their layout — it only renders one floating card that
 * follows the cursor while `show(item)` is active.
 */
export function CursorPreviewProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<PreviewItem | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.7 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.7 });

  // tilt the card a little in the direction it is moving (like the reference)
  const vx = useVelocity(x);
  const rotate = useTransform(vx, [-1500, 0, 1500], [-9, 0, 9]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const updatePointer = () => {
      const enabled = finePointer.matches && !coarsePointer.matches;
      setIsFinePointer(enabled);
      if (!enabled) setItem(null);
    };

    updatePointer();
    finePointer.addEventListener("change", updatePointer);
    coarsePointer.addEventListener("change", updatePointer);
    return () => {
      finePointer.removeEventListener("change", updatePointer);
      coarsePointer.removeEventListener("change", updatePointer);
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isFinePointer, mx, my]);

  const show = useCallback((next: PreviewItem) => {
    if (isFinePointer) setItem(next);
  }, [isFinePointer]);
  const hide = useCallback(() => setItem(null), []);
  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <PreviewContext.Provider value={value}>
      {children}

      {/* pointer-events-none so it never blocks hover/click on the cards */}
      {isFinePointer && (
        <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[55]">
          <motion.div style={{ x, y, rotate }} className="-translate-x-1/2 -translate-y-1/2">
            <AnimatePresence>
              {item && (
                <motion.div
                  key={item.title}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative h-[250px] w-[280px] overflow-hidden rounded-xl border border-[#cfc29f]/25 bg-gradient-to-br ${item.gradient ?? "from-[#10131a] via-[#171c27] to-[#2b3446]"} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]`}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "radial-gradient(rgba(235,232,226,0.35) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {item.caption && (
                    <p className={`${mono.className} absolute left-5 top-5 text-[9px] uppercase tracking-[0.28em] text-[#cfc29f]/80`}>
                      {item.caption}
                    </p>
                  )}
                  <p className="absolute bottom-5 left-5 right-5 text-[34px] font-semibold leading-none tracking-tight text-[#ebe8e2]">
                    {item.title}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </PreviewContext.Provider>
  );
}