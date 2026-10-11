"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

interface HeroPortrait3DProps {
  src?: string;
  alt?: string;
  monoClass?: string;
  displayClass?: string;
}

export default function HeroPortrait3D({
  src = "/self.jpeg",
  alt = "Rudraksh — AI/ML Architect",
  monoClass = "font-mono",
  displayClass = "font-serif",
}: HeroPortrait3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized cursor coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D rotation and parallax
  const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Tilt angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-16deg", "16deg"]);

  // Inner image inverse parallax for deep window effect
  const imgX = useTransform(smoothX, [-0.5, 0.5], ["-14px", "14px"]);
  const imgY = useTransform(smoothY, [-0.5, 0.5], ["-14px", "14px"]);

  // Dynamic specular light reflection coordinates
  const glareX = useTransform(smoothX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(239, 177, 29, 0.28) 0%, rgba(228, 61, 18, 0.12) 35%, transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      className="relative mx-auto flex items-center justify-center py-8 select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient 3D Backlight Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#E43D12]/30 via-[#EFB11D]/20 to-[#2A1610]/15 blur-2xl"
      />

      {/* Continuous Floating Wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Main 3D Tilt Container */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="group relative aspect-[16/21] w-full max-w-[320px] cursor-grab active:cursor-grabbing rounded-2xl border border-[#2A1610]/20 bg-[#2A1610] p-3 shadow-[0_28px_60px_-15px_rgba(42,22,16,0.45)] sm:aspect-auto sm:h-[480px] sm:w-[370px]"
        >
          {/* Outer Offset Wireframe Plane (Back Depth Layer) */}
          <div
            style={{ transform: "translateZ(-30px)" }}
            className="pointer-events-none absolute -right-4 -bottom-4 inset-0 rounded-2xl border border-[#E43D12]/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
          />

          {/* Recessed Image Window */}
          <div
            style={{ transform: "translateZ(15px)" }}
            className="relative h-full w-full overflow-hidden rounded-xl border border-[#EBE9E1]/15 bg-[#1A0D09]"
          >
            {/* Parallax Image Layer */}
            <motion.div
              style={{ x: imgX, y: imgY, scale: 1.1 }}
              className="relative h-full w-full"
            >
              <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="(max-width: 640px) 320px, 370px"
                className="object-cover object-center contrast-[1.08] saturate-[1.05] sepia-[0.08] transition-transform duration-700"
              />

              {/* Warm Editorial Duotone Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2A1610] via-transparent to-[#2A1610]/30 opacity-85" />
              <div className="pointer-events-none absolute inset-0 bg-[#E43D12]/10 mix-blend-overlay" />
            </motion.div>

            {/* Interactive Specular Glare Layer */}
            <motion.div
              style={{ background: glareBackground }}
              className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300"
            />

            {/* Subtle Scanline / Print Grid Texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "radial-gradient(#EBE9E1 0.75px, transparent 0.75px)",
                backgroundSize: "12px 12px",
              }}
            />
          </div>

          {/* 3D Popped-Out Top Telemetry Strip (Z: +45px) */}
          <div
            style={{ transform: "translateZ(45px)" }}
            className={`${monoClass} pointer-events-none absolute top-6 right-6 left-6 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#EBE9E1]`}
          >
            <span className="flex items-center gap-2 rounded-full border border-[#EBE9E1]/20 bg-[#2A1610]/80 px-3 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#EFB11D]" />
              SYS.ARCHITECT
            </span>
            <span className="rounded-full border border-[#EBE9E1]/15 bg-[#2A1610]/75 px-2.5 py-1 text-[#EFB11D] backdrop-blur-md">
              3D // LIVE
            </span>
          </div>

          {/* 3D Floating Bottom Editorial Badge (Z: +60px) */}
          <div
            style={{ transform: "translateZ(60px)" }}
            className="pointer-events-none absolute right-6 bottom-6 left-6 rounded-xl border border-[#EBE9E1]/15 bg-[#2A1610]/90 p-4 text-[#EBE9E1] shadow-2xl backdrop-blur-md"
          >
            <p
              className={`${monoClass} text-[9px] uppercase tracking-[0.22em] text-[#E43D12]`}
            >
              (IDENTITY NODE // 01)
            </p>
            <div className="mt-1 flex items-baseline justify-between">
              <h3
                className={`${displayClass} text-2xl font-light italic tracking-tight text-[#EBE9E1]`}
              >
                Rudraksh
              </h3>
              <span
                className={`${monoClass} text-[10px] uppercase tracking-[0.18em] text-[#EFB11D]`}
              >
                AI / ML
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}