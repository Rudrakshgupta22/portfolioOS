"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/lib/intel";
import UnicornScene from "unicornstudio-react/next";

export default function BootSequence({ onBootComplete }: { onBootComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [terminalText, setTerminalText] = useState("");

  // Stage 0: Terminal Typewriter Effect
  useEffect(() => {
    const text = "> SECURE UPLINK ESTABLISHED...\n> INITIATING BIOMETRIC SCAN...\n> FETCHING OPERATOR DOSSIER...";
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  // Timeline Controller
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1800); // Show ID Card
    const t2 = setTimeout(() => setStage(2), 4800); // Trigger exit animation
    const t3 = setTimeout(() => onBootComplete(), 5500); // Unmount and load OS

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center overflow-hidden">
      
      {/* Unicorn Studio WebGL Background */}
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
        <UnicornScene projectId="tqK6K8sgwSX36dXid22m" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center justify-center">
        
        {/* Terminal Handshake */}
        {stage === 0 && (
          <div className="w-full text-left">
            <pre className="text-[var(--color-active)] font-mono text-sm sm:text-base tracking-widest whitespace-pre-wrap drop-shadow-[0_0_8px_rgba(13,148,136,0.5)]">
              {terminalText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-[var(--color-active)] ml-1 align-middle"
              />
            </pre>
          </div>
        )}

        {/* Operator ID Card */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-80 sm:w-96 bg-[#121418]/80 backdrop-blur-md border border-[#21252b] rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="bg-[#21252b]/80 px-4 py-2 border-b border-[#333] flex justify-between items-center">
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">Operator Dossier</span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">ID: 8492-AX</span>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-md overflow-hidden bg-[#0a0a0a] border border-[#333] mb-4 flex items-center justify-center">
                  {/* Photo Placeholder */}
                  <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/150?img=11')] bg-cover bg-center grayscale opacity-80" />
                  
                  {/* Laser Scan Animation */}
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ delay: 0.5, duration: 1.8, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-[2px] bg-[var(--color-active)] shadow-[0_0_15px_3px_rgba(13,148,136,0.6)] z-20"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(13,148,136,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.1)_1px,transparent_1px)] bg-[size:10px_10px] z-10" />
                </div>

                <h2 className="text-3xl font-bold tracking-[0.2em] text-white uppercase mb-1">
                  {portfolioData.operator.name}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                  {portfolioData.operator.role}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3 }}
                  className="w-full bg-[var(--color-active)]/10 border border-[var(--color-active)] text-[var(--color-active)] py-2 text-center text-xs tracking-widest uppercase font-bold"
                >
                  [ Identity Verified // {portfolioData.operator.clearance} ]
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}