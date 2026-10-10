// npm i react-icons framer-motion
"use client";

import { memo, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiPython, SiPytorch, SiNextdotjs, SiVercel, SiPostgresql, SiDocker,
  SiReact, SiTypescript, SiJavascript, SiNodedotjs, SiTailwindcss,
  SiFastapi, SiTensorflow, SiMongodb, SiRedis, SiGit, SiGithub,
  SiSupabase, SiPrisma, //SiOpenai,
   SiLangchain, SiFigma, //SiAmazonwebservices,
} from "react-icons/si";
import { LuNetwork, LuCpu } from "react-icons/lu";

/* ------------------------------------------------------------------ */
/* Static data (module scope -> created once, never re-allocated)      */
/* ------------------------------------------------------------------ */

const GOLD = "#cfc29f";
const EASE = [0.22, 1, 0.36, 1] as const;

const PROFILE_STACK = [
  "Python", "PyTorch", "Next.js", "Vercel AI", "PostgreSQL", "Docker", "Architecture",
];

// Keys are lower-cased tech names. Add more as your missions need them.
const ICONS: Record<string, IconType> = {
  python: SiPython,
  pytorch: SiPytorch,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  "vercel ai": SiVercel,
  vercel: SiVercel,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  docker: SiDocker,
  react: SiReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  "node.js": SiNodedotjs,
  nodejs: SiNodedotjs,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  fastapi: SiFastapi,
  tensorflow: SiTensorflow,
  mongodb: SiMongodb,
  redis: SiRedis,
  git: SiGit,
  github: SiGithub,
  supabase: SiSupabase,
  prisma: SiPrisma,
  //openai: SiOpenai,
  langchain: SiLangchain,
  figma: SiFigma,
  //aws: SiAmazonwebservices,
  architecture: LuNetwork,
};

const getIcon = (name: string): IconType => ICONS[name.toLowerCase()] ?? LuCpu;

// Max 8 slots. Anything beyond is dropped instead of stacking on top of another node.
const POSITIONS = [
  { top: "50%", left: "50%" },
  { top: "25%", left: "30%" },
  { top: "30%", left: "70%" },
  { top: "70%", left: "25%" },
  { top: "65%", left: "75%" },
  { top: "15%", left: "50%" },
  { top: "85%", left: "50%" },
  { top: "50%", left: "15%" },
] as const;

const FLOAT_Y = [0, -12, 0, 12, 0];
const FLOAT_X = [0, 8, 0, -8, 0];

/* ------------------------------------------------------------------ */
/* Single floating node                                                */
/* ------------------------------------------------------------------ */

type NodeProps = {
  tech: string;
  index: number;
  monoClass: string;
  reduceMotion: boolean;
};

const FloatingNode = memo(function FloatingNode({ tech, index, monoClass, reduceMotion }: NodeProps) {
  const pos = POSITIONS[index];
  const Icon = getIcon(tech);
  const isHero = index === 0;

  return (
    // 1) Static wrapper handles centering. Framer writes its own inline `transform`
    //    for x/y, which would overwrite Tailwind's -translate classes if they were
    //    on the same element (that's why nodes drift off their anchor points).
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* 2) Inner element only does the floating */}
      <motion.div
        className="will-change-transform"
        animate={reduceMotion ? undefined : { y: FLOAT_Y, x: FLOAT_X }}
        transition={{
          duration: 6 + (index % 3),
          delay: index * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          title={tech}
          className="group flex flex-col items-center gap-2 cursor-default"
        >
          <div
            className={`relative flex items-center justify-center rounded-2xl border border-white/10 bg-[#16171a]/80 transition-colors duration-300 group-hover:border-[#cfc29f]/50 group-hover:bg-[#1d1e22] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] ${
              isHero ? "h-16 w-16" : "h-12 w-12"
            }`}
          >
            {isHero && (
              <span
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full animate-pulse"
                style={{ background: GOLD }}
              />
            )}
            <Icon
              aria-hidden
              className={`text-[#ebe8e2]/75 transition-colors duration-300 group-hover:text-[#cfc29f] ${
                isHero ? "h-8 w-8" : "h-6 w-6"
              }`}
            />
          </div>
          <span
            className={`${monoClass} text-[9px] uppercase tracking-widest text-[#ebe8e2]/50 transition-colors duration-300 group-hover:text-[#ebe8e2]`}
          >
            {tech}
          </span>
        </div>
      </motion.div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* HUD pieces                                                          */
/* ------------------------------------------------------------------ */

const TelemetryHUD = memo(function TelemetryHUD({
  monoClass,
  silver,
  reduceMotion,
}: { monoClass: string; silver: string; reduceMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-5 left-5 z-10 flex items-center gap-4">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <motion.div
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-white/5 border-t-[#cfc29f]/60 will-change-transform"
        />
        <motion.div
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1.5 rounded-full border border-white/5 border-b-[#cfc29f]/60 will-change-transform"
        />
        <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GOLD }} />
      </div>
      <div
        className={`${monoClass} text-[9px] uppercase tracking-[0.2em]`}
        style={{ color: silver }}
      >
        Telemetry<br />Active
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

type CenterPanelProps = {
  activeViewId: string;
  activeMissionStack?: string[];
  monoClass: string; // pass mono.className
  silver: string;    // pass SILVER
};

export default function CenterPanel({
  activeViewId,
  activeMissionStack = [],
  monoClass,
  silver,
}: CenterPanelProps) {
  const reduceMotion = !!useReducedMotion();
  const isProfile = activeViewId === "profile";

  const stack = useMemo(
    () => (isProfile ? PROFILE_STACK : activeMissionStack).slice(0, POSITIONS.length),
    [isProfile, activeMissionStack]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
      className="relative hidden items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-md lg:col-span-5 lg:flex"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(207,194,159,0.03)_0%,transparent_70%)]" />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeViewId}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0 h-full w-full"
        >
          {stack.map((tech, i) => (
            <FloatingNode
              key={tech}
              tech={tech}
              index={i}
              monoClass={monoClass}
              reduceMotion={reduceMotion}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <TelemetryHUD monoClass={monoClass} silver={silver} reduceMotion={reduceMotion} />

      <div className="pointer-events-none absolute right-5 top-5 z-10">
        <span
          className={`${monoClass} rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#ebe8e2]`}
        >
          {isProfile ? "SYS_CORE_STACK" : "DEPL_ARCHITECTURE"}
        </span>
      </div>
    </motion.section>
  );
}

/* Usage in your page:

<CenterPanel
  activeViewId={activeViewId}
  activeMissionStack={activeMission?.stack}
  monoClass={mono.className}
  silver={SILVER}
/>
*/