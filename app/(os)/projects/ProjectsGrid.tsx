"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Fraunces, Martian_Mono } from "next/font/google";
import type { ProjectData } from "@/lib/projects";
import { CursorPreviewProvider, useCursorPreview } from "@/components/CursorPreview";

/* ── FONT SYSTEM ── */
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

const WONKY = { fontVariationSettings: '"SOFT" 100, "WONK" 1' } as const;

/* ── NEW POP THEME GRADIENTS ── */
const coverStyles = [
  "from-[#FFA2B6] via-[#D6536D] to-[#E43D12]", // Pink to Orange
  "from-[#EFB11D] via-[#FFA2B6] to-[#D6536D]", // Mustard to Rose
  "from-[#EBE9E1] via-[#EFB11D] to-[#E43D12]", // Off-White to Orange
];

function ProjectsContent({ missions }: { missions: ProjectData[] }) {
  const { show, hide } = useCursorPreview(); 

  return (
    <div className="relative left-1/2 -mt-28 w-screen -translate-x-1/2 overflow-x-clip text-[#E43D12]">
      <section className="px-6 pt-48 md:px-0 md:pt-64">
        <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#D6536D] font-bold md:ml-[16%]`}>
          Deployment / Portfolio
        </p>

        {/* Updated to Fraunces Espresso */}
        <h1 
          className={`${display.className} mt-8 text-[clamp(2.5rem,5.5vw,5.5rem)] font-light leading-[0.95] tracking-[-0.02em] md:ml-[16%] md:max-w-[56vw] text-[#2A1610]`}
          style={WONKY}
        >
          Production systems & experiments.
        </h1>
      </section>

      <section className="px-6 pb-24 pt-16 md:px-[8%] md:pb-32">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {missions.map((mission, index) => (
            <article
              key={mission.id}
              className="group/card overflow-hidden rounded-[1.75rem] border border-[#E43D12]/15 bg-white/50 p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#E43D12]/40 hover:bg-white/90 hover:shadow-xl"
            >
              <Link
                href={`/project/${mission.id}`}
                data-cursor="View"
                onMouseEnter={() =>
                  show({
                    title: mission.title,
                    caption: mission.stack.slice(0, 3).join(" · "),
                    gradient: coverStyles[index % coverStyles.length],
                  })
                }
                onMouseLeave={hide}
                className="group block"
              >
                <div
                  className={`relative overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${coverStyles[index % coverStyles.length]} p-5`}
                >
                  {mission.image_url && (
                    <Image
                      src={mission.image_url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent_35%)]" />
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(rgba(42,22,16,0.3) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

                  <div className="relative flex items-start justify-between gap-4">
                    <span className={`${mono.className} rounded-full border border-[#2A1610]/20 bg-white/30 backdrop-blur-md px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#2A1610] font-bold`}>
                      {mission.status}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[#2A1610]/70 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#2A1610]" />
                  </div>

                  <div className="relative mt-36 flex min-h-[170px] items-end">
                    <h2
                      className={`${display.className} max-w-[90%] text-[clamp(2rem,3vw,3.2rem)] font-normal leading-[0.95] tracking-[-0.02em] text-[#2A1610]`}
                      style={WONKY}
                    >
                      {mission.title}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <h3
                    className={`${display.className} text-[clamp(1.5rem,2vw,2.2rem)] font-normal tracking-[-0.02em] text-[#E43D12]`}
                    style={WONKY}
                  >
                    {mission.title}
                  </h3>
                  <div className="mt-4 h-px w-full bg-[#E43D12]/15" />
                  <p className="mt-5 text-[15px] font-medium leading-relaxed text-[#2A1610]">
                    {mission.directive}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {mission.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className={`${mono.className} rounded-full border border-[#E43D12]/20 bg-[#E43D12]/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-[#E43D12] font-bold`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>

              {mission.github_url && (
                <div className="px-2 pb-2 pt-5">
                  <a
                    href={mission.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={hide}
                    className={`${mono.className} inline-flex items-center gap-2 rounded-full border border-[#2A1610]/20 px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.15em] text-[#2A1610] transition-colors hover:border-[#E43D12] hover:bg-[#E43D12] hover:text-[#EBE9E1]`}
                  >
                    GitHub <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32 md:px-[8%]">
        <div className="flex flex-col items-start justify-between gap-8 border-t border-[#E43D12]/20 pt-10 sm:flex-row sm:items-end">
          <div>
            <p className={`${mono.className} text-[9px] font-medium uppercase tracking-[0.2em] text-[#D6536D]`}>
              Open source / repository index
            </p>
            <h2
              className={`${display.className} mt-3 text-4xl font-light tracking-[-0.03em] text-[#2A1610] sm:text-5xl`}
              style={WONKY}
            >
              More in the archive.
            </h2>
          </div>
          <a
            href="https://github.com/Rudrakshgupta22?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={`${mono.className} inline-flex items-center gap-3 rounded-full border border-[#2A1610]/20 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-[#2A1610] transition-colors hover:border-[#E43D12] hover:bg-[#E43D12] hover:text-[#EBE9E1]`}
          >
            View Full Archive on GitHub <ArrowUpRight aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

/* ← Wrapper logic preserved */
export default function ProjectsGrid({ missions }: { missions: ProjectData[] }) {
  return (
    <CursorPreviewProvider>
      <ProjectsContent missions={missions} />
    </CursorPreviewProvider>
  );
}