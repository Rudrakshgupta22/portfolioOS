"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JetBrains_Mono, Manrope } from "next/font/google";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the cursor to prevent hydration mismatch
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { 
  ssr: false 
});

const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function OSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Hub", path: "/hub" },
    { name: "Profile", path: "/profile" },
    { name: "Deployments", path: "/projects" }, 
    { name: "Architecture", path: "/stack" },
    { name: "Comms", path: "/contact" },
  ];

  return (
    <div className={`${sans.className} relative min-h-dvh w-full bg-[#EBE9E1] text-[#E43D12] selection:bg-[#EFB11D]/30 cursor-none`}>
      
      <CustomCursor />

      {/* WARM BACKGROUND EFFECTS */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(228,61,18,0.05)_0%,rgba(235,233,225,0)_100%)] z-0" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.05] mix-blend-multiply z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* LIGHT GLASS HUD */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl flex items-center justify-between px-2 sm:px-4 py-2 rounded-full border border-[#E43D12]/15 bg-white/40 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(228,61,18,0.1),inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(228,61,18,0.05)] transition-all duration-500">
         
         <div className="flex flex-shrink-0 items-center gap-3 pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EFB11D] animate-pulse shadow-[0_0_8px_#EFB11D]" />
            <div className="whitespace-nowrap font-semibold tracking-tight text-sm sm:text-base text-[#E43D12]">
              Rudraksh <span className="text-[#D6536D] font-normal hidden md:inline">/ AI/ML Architect</span>
            </div>
         </div>

         <nav className={`${mono.className} hidden md:flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pr-2 sm:pr-0`}>
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== "/hub" && pathname.startsWith(`${item.path}/`));
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group relative px-4 sm:px-5 py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap overflow-hidden flex-shrink-0 ${
                    isActive
                      ? "bg-[#E43D12] text-[#EBE9E1] font-medium shadow-[0_4px_12px_rgba(228,61,18,0.2),inset_0_1px_2px_rgba(255,255,255,0.2)]"
                      : "text-[#D6536D] hover:text-[#E43D12] border border-transparent hover:bg-[#E43D12]/5"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
         </nav>

         <button
           type="button"
           aria-expanded={isMenuOpen}
           aria-controls="mobile-navigation"
           onClick={() => setIsMenuOpen((open) => !open)}
           className={`${mono.className} md:hidden flex-shrink-0 rounded-full border border-[#E43D12]/20 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-[#D6536D] transition-colors hover:bg-[#E43D12]/5 hover:text-[#E43D12]`}
         >
           Menu
         </button>

         <nav
           id="mobile-navigation"
           className={`${mono.className} ${isMenuOpen ? "flex" : "hidden"} absolute right-0 top-[calc(100%+0.5rem)] min-w-44 flex-col gap-1 rounded-2xl border border-[#E43D12]/15 bg-[#EBE9E1]/95 p-2 shadow-[0_12px_30px_rgba(228,61,18,0.12)] backdrop-blur-2xl md:hidden`}
         >
             {navItems.map((item) => {
               const isActive = pathname === item.path || (item.path !== "/hub" && pathname.startsWith(`${item.path}/`));

               return (
                 <Link
                   key={item.path}
                   href={item.path}
                   onClick={() => setIsMenuOpen(false)}
                   className={`flex-shrink-0 rounded-xl px-4 py-3 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                     isActive
                       ? "bg-[#E43D12] text-[#EBE9E1] font-medium"
                       : "text-[#D6536D] hover:bg-[#E43D12]/5 hover:text-[#E43D12]"
                   }`}
                 >
                   {item.name}
                 </Link>
               );
             })}
         </nav>
      </header>

      <main className="relative z-10 pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto h-full min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}