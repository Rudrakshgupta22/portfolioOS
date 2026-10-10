"use client";
import { motion } from "framer-motion";
import { JetBrains_Mono, Manrope } from "next/font/google";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";

const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function OperatorProfile() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full flex flex-col lg:flex-row gap-8 xl:gap-12 items-center lg:items-stretch"
    >
      {/* 
        LEFT: The Biometric Portrait Container 
        Kept dark to preserve the cinematic "Verified Subject" effect.
      */}
      <div className="w-full lg:w-5/12 relative rounded-3xl overflow-hidden border border-[#E43D12]/20 bg-[#0a0b0e] shadow-2xl group flex-shrink-0 min-h-[400px] lg:min-h-0">
        
        {/* Placeholder for your actual photo. Replace /your-photo.jpg with your image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.5] contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          style={{ backgroundImage: "url('/philosophy-bg.jpg')" }} // Swap this!
        />

        {/* The Animated "Scanner" Line */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-[#E43D12]/50 shadow-[0_0_15px_rgba(228,61,18,0.8)] z-10 will-change-transform"
        />

        {/* Floating HUD Badge (Like the 'Systems Online' badge) */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md">
             <span className="w-1.5 h-1.5 rounded-full bg-[#EFB11D] animate-pulse" />
             <span className={`${mono.className} text-[9px] uppercase tracking-widest text-white`}>Subject Verified</span>
          </div>
        </div>

        {/* Framing brackets */}
        <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#E43D12]/50 z-20" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#E43D12]/50 z-20" />
        
        {/* Dark gradient to blend the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0b0e] to-transparent z-10" />
      </div>

      {/* 
        RIGHT: The Light Theme Dossier 
        Updated to high-contrast Espresso and Orange.
      */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center relative z-10 py-4">
        
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
            href="https://github.com/yourusername" 
            target="_blank"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#E43D12]/30 bg-[#E43D12]/5 hover:bg-[#E43D12] hover:text-[#EBE9E1] transition-all duration-300 overflow-hidden text-[#E43D12]"
          >
            <FiGithub className="text-lg relative z-10" />
            <span className={`${mono.className} text-[10px] uppercase tracking-[0.2em] relative z-10 font-bold`}>Access GitHub</span>
          </Link>

          <Link 
            href="https://linkedin.com/in/yourusername" 
            target="_blank"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#2A1610]/20 bg-[#2A1610]/5 hover:bg-[#2A1610] hover:text-[#EBE9E1] transition-all duration-300 overflow-hidden text-[#2A1610]"
          >
            <FiLinkedin className="text-lg relative z-10" />
            <span className={`${mono.className} text-[10px] uppercase tracking-[0.2em] relative z-10 font-bold`}>Secure Comms</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}