import Link from "next/link";
import { notFound } from "next/navigation";
import { JetBrains_Mono, Manrope } from "next/font/google";
import CenterPanel from "@/components/Centralpanel";
import { portfolioData } from "@/lib/intel";

export async function generateStaticParams() {
  return portfolioData.missions.tier_1_deployments.map((mission) => ({ id: mission.id }));
}

const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const SILVER = "#8d939d";
const MUTED = "rgba(235,232,226,0.66)";

export default async function ProjectPage({ params }: PageProps<"/project/[id]">) {
  const { id } = await params;
  const mission = portfolioData.missions.tier_1_deployments.find((item) => item.id === id);

  if (!mission) notFound();

  return (
    <section className={`${sans.className} mx-auto flex w-full max-w-6xl flex-1 flex-col py-4 sm:py-8`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className={`${mono.className} text-[10px] uppercase tracking-[0.24em] text-[#8d939d]`}>Deployment / Project Specs</p>
          <h2 className="mt-3 text-3xl font-light tracking-tight text-[#ebe8e2] sm:text-5xl">{mission.title}</h2>
        </div>
        <Link href="/hub" className={`${mono.className} shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[9px] uppercase tracking-widest text-[#8d939d] transition hover:border-[#cfc29f]/40 hover:text-[#ebe8e2]`}>Back to Hub</Link>
      </div>

      <div className="grid flex-1 gap-4 lg:min-h-[520px] lg:grid-cols-2">
        <CenterPanel activeViewId={mission.id} activeMissionStack={mission.stack} monoClass={mono.className} silver={SILVER} />

        <article className="overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className={`${mono.className} text-[10px] uppercase tracking-widest text-[#8d939d]`}>Directive</p>
            <span className={`${mono.className} rounded-full border border-[#cfc29f]/20 bg-[#cfc29f]/[0.04] px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#cfc29f]`}>{mission.status}</span>
          </div>
          <h3 className="mt-4 text-xl font-light leading-relaxed text-[#ebe8e2] sm:text-2xl">{mission.directive}</h3>

          <div className="mt-8">
            <h4 className={`${mono.className} mb-3 text-[10px] uppercase tracking-widest text-[#8d939d]`}>Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {mission.stack.map((tech) => (
                <span key={tech} className={`${mono.className} rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] tracking-wide text-[#ebe8e2]`}>{tech}</span>
              ))}
            </div>
          </div>

          {mission.impact_metrics && mission.impact_metrics.length > 0 && (
            <div className="mt-8">
              <h4 className={`${mono.className} mb-3 text-[10px] uppercase tracking-widest text-[#8d939d]`}>Impact Metrics</h4>
              <ul className="space-y-3">
                {mission.impact_metrics.map((metric) => (
                  <li key={metric} className="flex gap-3 text-sm font-light leading-relaxed" style={{ color: MUTED }}>
                    <span aria-hidden className="mt-[0.65em] h-px w-4 shrink-0 bg-[#cfc29f]" />{metric}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mission.anomaly_report && (
            <div className="relative mt-8 overflow-hidden rounded-xl border border-[#cfc29f]/20 bg-[#cfc29f]/[0.03] p-5">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#cfc29f]/40" />
              <h4 className={`${mono.className} mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#cfc29f]`}>Anomaly Report / Critical Pivot</h4>
              <div className="space-y-4">
                <p className="text-[13px] font-light leading-relaxed" style={{ color: MUTED }}>
                  <span className={`${mono.className} mb-1 block text-[9px] uppercase tracking-widest text-[#cfc29f]/70`}>Issue</span>
                  {mission.anomaly_report.issue}
                </p>
                <p className="text-[13px] font-light leading-relaxed text-[#ebe8e2]">
                  <span className={`${mono.className} mb-1 block text-[9px] uppercase tracking-widest text-[#cfc29f]/70`}>Resolution</span>
                  {mission.anomaly_report.resolution}
                </p>
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
