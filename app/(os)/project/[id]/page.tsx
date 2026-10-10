import Link from "next/link";
import { notFound } from "next/navigation";
import { Fraunces, Manrope, Martian_Mono } from "next/font/google";
import CenterPanel from "@/components/Centralpanel";
import { portfolioData } from "@/lib/intel";
import { MotionStyles, Reveal, Rule, ScrollWords, SplitTitle } from "@/components/ProjectMotion";

export const instant = false;

export async function generateStaticParams() {
  return portfolioData.missions.tier_1_deployments.map((mission) => ({ id: mission.id }));
}

const sans = Manrope({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500", "700"] });

const WONKY = { fontVariationSettings: '"SOFT" 100, "WONK" 1' } as const;
const SILVER = "#D6536D";

const label = `${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#2A1610]/55`;

export default async function ProjectPage({ params }: PageProps<"/project/[id]">) {
  const { id } = await params;
  const all = portfolioData.missions.tier_1_deployments;
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) notFound();

  const mission = all[idx];
  const next = all[(idx + 1) % all.length];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className={`${sans.className} mx-auto w-full max-w-6xl px-6 pb-20 pt-40 text-[#2A1610] sm:pt-52 md:px-0`}
    >
      <MotionStyles />

      {/* ───────── Title ───────── */}
      <header>
        <div className="flex items-baseline justify-between">
          <p className={label}>Case study ({pad(idx + 1)}/{pad(all.length)})</p>
          <Link href="/hub" className={`${label} ul pb-1 text-[#2A1610]`}>
            ← All work
          </Link>
        </div>
        <Rule className="mt-4" />

        <SplitTitle
          text={mission.title}
          italicFrom={1}
          className={`${display.className} mt-10 text-[clamp(3.5rem,13vw,11rem)] font-light leading-[0.88] tracking-[-0.045em] sm:mt-14`}
          style={WONKY}
        />
      </header>

      {/* ───────── Meta strip ───────── */}
      <Reveal delay={500} className="mt-14 grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-x-8">
        <div>
          <p className={label}>Status</p>
          <p className="mt-2 text-sm font-medium capitalize">{mission.status}</p>
        </div>
        <div className="col-span-2">
          <p className={label}>Built with</p>
          <p className="mt-2 text-sm font-medium">{mission.stack.join(", ")}</p>
        </div>
        <div>
          <p className={label}>Project</p>
          <p className="mt-2 text-sm font-medium">
            {pad(idx + 1)} of {pad(all.length)}
          </p>
        </div>
      </Reveal>

      {/* ───────── Visual ───────── */}
      <Reveal delay={150} className="mt-16">
        <div className="relative h-[68vh] min-h-[420px] overflow-hidden rounded-md border border-[#2A1610]/15 bg-[#2A1610]/[0.03]">
          <CenterPanel
            activeViewId={mission.id}
            activeMissionStack={mission.stack}
            monoClass={mono.className}
            silver={SILVER}
          />
        </div>
      </Reveal>

      {/* ───────── Directive ───────── */}
      <div className="mt-32 grid gap-8 md:grid-cols-12 md:gap-0">
        <p className={`${label} md:col-span-3`}>(Directive)</p>
        <ScrollWords
          text={mission.directive}
          className={`${display.className} text-3xl font-light leading-[1.2] tracking-[-0.02em] sm:text-5xl md:col-span-9`}
          style={WONKY}
        />
      </div>

      {/* ───────── Stack ───────── */}
      <div className="mt-32 grid gap-8 md:grid-cols-12 md:gap-0">
        <p className={`${label} md:col-span-3`}>(Stack)</p>
        <Reveal className="md:col-span-9">
          <ul
            className={`${display.className} flex flex-wrap gap-x-8 gap-y-2 text-4xl font-light tracking-[-0.02em] sm:text-6xl`}
            style={WONKY}
          >
            {mission.stack.map((tech) => (
              <li
                key={tech}
                className="cursor-default transition-colors duration-300 hover:text-[#E43D12] hover:italic"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* ───────── Impact ───────── */}
      {mission.impact_metrics && mission.impact_metrics.length > 0 && (
        <div className="mt-32 grid gap-8 md:grid-cols-12 md:gap-0">
          <p className={`${label} md:col-span-3`}>(Impact)</p>
          <ul className="md:col-span-9">
            {mission.impact_metrics.map((metric, i) => (
              <li key={metric}>
                <Rule delay={i * 80} />
                <Reveal delay={i * 80}>
                  <div className="group relative flex cursor-default items-baseline gap-6 overflow-hidden px-1 py-7 sm:py-9">
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 bg-[#2A1610] transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-y-100"
                    />
                    <span
                      className={`${mono.className} relative text-[11px] text-[#E43D12] transition-colors duration-500 group-hover:text-[#EFB11D]`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`${display.className} relative text-2xl font-light leading-snug tracking-[-0.01em] transition-colors duration-500 group-hover:text-[#EBE9E1] sm:text-3xl`}
                      style={WONKY}
                    >
                      {metric}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
            <li>
              <Rule delay={mission.impact_metrics.length * 80} />
            </li>
          </ul>
        </div>
      )}

      {/* ───────── Pivot (dark contrast section) ───────── */}
      {mission.anomaly_report && (
        <Reveal className="mt-32">
          <div className="rounded-2xl bg-[#2A1610] px-6 py-14 text-[#EBE9E1] sm:px-14 sm:py-20">
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#EFB11D]`}>
              (Critical pivot)
            </p>
            <h2
              className={`${display.className} mt-6 text-5xl font-light italic leading-none tracking-[-0.03em] sm:text-7xl`}
              style={WONKY}
            >
              Where it broke.
            </h2>

            <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#D6536D]`}>
                  The issue
                </p>
                <p className="mt-4 text-base font-light leading-relaxed text-[#EBE9E1]/75 sm:text-lg">
                  {mission.anomaly_report.issue}
                </p>
              </div>
              <div>
                <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#EFB11D]`}>
                  The fix
                </p>
                <p className="mt-4 text-base font-normal leading-relaxed text-[#EBE9E1] sm:text-lg">
                  {mission.anomaly_report.resolution}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ───────── Next project ───────── */}
      <Rule className="mt-32" />
      <Link href={`/project/${next.id}`} className="group block py-14 sm:py-20">
        <p className={label}>Next deployment</p>
        <div className="mt-6 flex items-end justify-between gap-6">
          <span
            className={`${display.className} text-[clamp(3rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.04em] transition-all duration-500 group-hover:italic group-hover:text-[#E43D12]`}
            style={WONKY}
          >
            {next.title}
          </span>
          <span
            aria-hidden
            className="mb-2 text-4xl transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:translate-x-4 group-hover:text-[#E43D12] sm:text-6xl"
          >
            →
          </span>
        </div>
      </Link>
      <Rule />
    </section>
  );
}