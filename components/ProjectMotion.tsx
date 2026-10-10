"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/* Minimal, deliberate motion. No dependencies. */
export function MotionStyles() {
  return (
    <style>{`
      .rv{opacity:0;transform:translateY(36px);
        transition:opacity 1.1s cubic-bezier(.19,1,.22,1),transform 1.1s cubic-bezier(.19,1,.22,1);
        transition-delay:var(--d,0ms)}
      .rv[data-in="1"]{opacity:1;transform:none}

      .mask{display:block;overflow:hidden;padding:.08em 0 .14em;margin:-.08em 0 -.14em}
      .mask>span{display:inline-block;transform:translateY(105%);
        animation:maskUp 1.25s cubic-bezier(.19,1,.22,1) forwards;animation-delay:var(--d,0ms)}
      @keyframes maskUp{to{transform:none}}

      .ul{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;
        transition:background-size .5s cubic-bezier(.19,1,.22,1)}
      .ul:hover{background-size:100% 1px}

      .rule{transform:scaleX(0);transform-origin:left;transition:transform 1.4s cubic-bezier(.19,1,.22,1);transition-delay:var(--d,0ms)}
      .rv[data-in="1"] .rule,.rule[data-in="1"]{transform:scaleX(1)}

      @media (prefers-reduced-motion:reduce){
        .rv,.mask>span,.rule{transition:none!important;animation:none!important;opacity:1!important;transform:none!important}
      }
    `}</style>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.in = "1";
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`rv ${className}`} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* Hairline that draws itself in */
export function Rule({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.dataset.in = "1";
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`rule h-px w-full bg-[#2A1610]/25 ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    />
  );
}

/* Big title: each line rises out of a mask. `italicFrom` flips later words to italic. */
export function SplitTitle({
  text,
  className = "",
  style,
  italicFrom = -1,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  italicFrom?: number;
}) {
  const words = text.split(" ");
  return (
    <h1 className={className} style={style} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="mask" aria-hidden>
          <span
            style={
              {
                "--d": `${200 + i * 140}ms`,
                fontStyle: italicFrom >= 0 && i >= italicFrom ? "italic" : "normal",
              } as CSSProperties
            }
          >
            {w}
          </span>
        </span>
      ))}
    </h1>
  );
}

/* Words light up from faint to full as you scroll through the paragraph */
export function ScrollWords({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.6)));
      const n = spans.length;
      spans.forEach((s, i) => {
        const v = Math.min(1, Math.max(0, p * (n + 3) - i));
        s.style.opacity = String(0.16 + 0.84 * v);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} data-w style={{ opacity: 0.16, transition: "opacity .15s linear" }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}