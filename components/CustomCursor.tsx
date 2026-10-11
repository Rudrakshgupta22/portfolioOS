"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"] });

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const isFineDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
  const [isVisible, setIsVisible] = useState(isFineDesktop);
  const [isView, setIsView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(isFineDesktop);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px) and (pointer: fine)");

    const updateDesktopState = () => {
      const shouldEnable = mediaQuery.matches;
      setIsDesktop(shouldEnable);
      setIsVisible(shouldEnable);
      if (!shouldEnable) {
        setIsHovering(false);
        setIsView(false);
      }
    };

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => mediaQuery.removeEventListener("change", updateDesktopState);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor]")) {
        setIsHovering(true);
        setIsView(true);
      } else if (
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
        setIsView(false);
      } else {
        setIsHovering(false);
        setIsView(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isDesktop, mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <motion.div
      className="hidden md:block pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? (isView ? 88 : 64) : 24,
          height: isHovering ? (isView ? 88 : 64) : 24,
          backgroundColor: isHovering ? "rgba(239, 177, 29, 0.2)" : "rgba(228, 61, 18, 0.05)",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-full border border-[#E43D12]/20 backdrop-blur-md shadow-[0_0_15px_rgba(228,61,18,0.1)] flex items-center justify-center"
      >
        <motion.span 
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
          transition={{ duration: 0.2 }}
          className={`${mono.className} text-[7px] uppercase tracking-widest text-[#E43D12] font-bold`}
        >
          {isView ? "View" : (isHovering ? "Target" : "")}
        </motion.span>
      </motion.div>

      <motion.div
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="w-1.5 h-1.5 bg-[#E43D12] rounded-full shadow-[0_0_10px_#E43D12]"
      />
    </motion.div>
  );
}