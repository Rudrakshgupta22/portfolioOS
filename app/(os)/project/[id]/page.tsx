import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Fraunces, Manrope, Martian_Mono } from "next/font/google";
import CenterPanel from "@/components/Centralpanel";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { MotionStyles, Reveal, Rule, ScrollWords, SplitTitle } from "@/components/ProjectMotion";
import { portfolioData } from "@/lib/intel";
import { fromMission, fromSanityProject, getProjects, type ProjectData, type SanityProject } from "@/lib/projects";

export const instant = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(({ id }) => ({ id }));
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

  const sanityMission = await client.fetch<SanityProject | null>(
    groq`*[_type == "project" && slug.current == $id][0]{
      "id": slug.current,
      title,
      directive,
      status,
      "stack": techStack,
      impactMetrics,
      anomalyReport,
      githubUrl,
      liveUrl,
      "imageUrl": mainImage.asset->url,
      "gallery": gallery[].asset->url
    }`,
    { id }
  );
  const hardcodedMission = portfolioData.missions.tier_1_deployments.find(
    (project) => project.id.toLowerCase() === id.toLowerCase(),
  );
  const mission: ProjectData | null = sanityMission
    ? fromSanityProject(sanityMission)
    : hardcodedMission
      ? fromMission(hardcodedMission)
      : null;

  if (!mission) notFound();

  const allProjects = (await getProjects()) ?? [];
  const stack = mission.stack ?? [];
  const impactMetrics = mission.impact_metrics ?? [];
  const idx = allProjects.findIndex((item) => item.id.toLowerCase() === mission.id.toLowerCase());
  const next = allProjects[(idx + 1) % allProjects.length] || mission;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      className={`${sans.className} mx-auto w-full max-w-6xl overflow-x-hidden px-6 pb-20 pt-28 text-[#2A1610] sm:pt-40 md:px-0 md:pt-52`}
    >
      <MotionStyles />

      {/* ───────── Title ───────── */}
      <header>
        <div className="flex items-baseline justify-between">
          <p className={label}>Case study ({pad(idx !== -1 ? idx + 1 : 1)}/{pad(allProjects.length)})</p>
          <Link href="/hub" className={`${label} ul inline-flex min-h-11 items-center px-2 pb-1 text-[#2A1610] active:text-[#E43D12]`}>
            ← All work
          </Link>
        </div>
        <Rule className="mt-4" />

        <SplitTitle
          text={mission.title}
          italicFrom={1}
          className={`${display.className} mt-10 break-words text-[clamp(2.25rem,11vw,11rem)] font-light leading-[0.88] tracking-[-0.045em] sm:mt-14`}
          style={WONKY}
        />
      </header>

      {/* ───────── Meta strip ───────── */}
      <Reveal delay={500} className="mt-10 grid min-w-0 grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 md:grid-cols-4 md:gap-x-8">
        <div className="min-w-0">
          <p className={label}>Status</p>
          <p className="mt-2 break-words text-sm font-medium capitalize">{mission.status || "Deployed"}</p>
        </div>
        <div className="min-w-0">
          <p className={label}>Built with</p>
          <p className="mt-2 break-words text-sm font-medium">{stack.join(", ")}</p>
        </div>
        <div className="min-w-0">
          <p className={label}>Project</p>
          <p className="mt-2 text-sm font-medium">
            {pad(idx !== -1 ? idx + 1 : 1)} of {pad(allProjects.length)}
          </p>
        </div>
        <div className="min-w-0">
          {mission.github_url && (
            <a
              href={mission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mono.className} inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-[#2A1610]/20 px-3 text-[9px] font-medium uppercase tracking-[0.12em] text-[#2A1610] transition-colors hover:border-[#E43D12] hover:bg-[#E43D12] hover:text-[#EBE9E1] active:scale-95 active:border-[#E43D12] active:bg-[#E43D12] active:text-[#EBE9E1] sm:px-5 sm:text-[10px]`}
            >
              GitHub Repository <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </Reveal>

      {/* ───────── Visual ───────── */}
      <Reveal delay={150} className="mt-12 sm:mt-16">
        <div className="relative h-[42vh] min-h-[260px] overflow-hidden rounded-md border border-[#2A1610]/15 bg-[#2A1610]/[0.03] sm:h-[68vh] sm:min-h-[420px]">
          {mission.image_url ? (
            <Image
              src={mission.image_url}
              alt={`${mission.title} project cover`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
            />
          ) : (
            <CenterPanel
              activeViewId={mission.id}
              activeMissionStack={stack}
              monoClass={mono.className}
              silver={SILVER}
            />
          )}
        </div>
      </Reveal>

      {/* ───────── Directive ───────── */}
      <div className="mt-16 grid gap-6 sm:mt-32 sm:gap-8 md:grid-cols-12 md:gap-0">
        <p className={`${label} md:col-span-3`}>(Directive)</p>
        <ScrollWords
          text={mission.directive}
          className={`${display.className} break-words text-xl font-light leading-[1.2] tracking-[-0.02em] sm:text-3xl md:col-span-9 md:text-5xl`}
          style={WONKY}
        />
      </div>

      {/* ───────── Stack ───────── */}
      <div className="mt-16 grid gap-6 sm:mt-32 sm:gap-8 md:grid-cols-12 md:gap-0">
        <p className={`${label} md:col-span-3`}>(Stack)</p>
        <Reveal className="md:col-span-9">
          <ul
            className={`${display.className} flex flex-wrap gap-x-4 gap-y-2 break-words text-2xl font-light tracking-[-0.02em] sm:gap-x-8 sm:text-4xl md:text-6xl`}
            style={WONKY}
          >
            {stack.map((tech: string) => (
              <li
                key={tech}
                className="min-w-0 max-w-full break-words cursor-default transition-colors duration-300 hover:text-[#E43D12] hover:italic"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {mission.gallery.length > 0 && (
        <section className="mt-16 sm:mt-32" aria-label={`${mission.title} project screenshots`}>
          <p className={label}>Project screenshots</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {mission.gallery.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-md border border-[#2A1610]/15 bg-[#2A1610]/[0.03]"
              >
                <Image
                  src={imageUrl}
                  alt={`${mission.title} screenshot ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Impact ───────── */}
      {impactMetrics.length > 0 && (
        <div className="mt-16 grid gap-6 sm:mt-32 sm:gap-8 md:grid-cols-12 md:gap-0">
          <p className={`${label} md:col-span-3`}>(Impact)</p>
          <ul className="md:col-span-9">
            {impactMetrics.map((metric: string, i: number) => (
              <li key={metric}>
                <Rule delay={i * 80} />
                <Reveal delay={i * 80}>
                  <div className="group relative flex cursor-default items-baseline gap-4 overflow-hidden px-1 py-5 active:scale-[0.99] sm:gap-6 sm:py-9">
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 bg-[#2A1610] transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-y-100 group-active:scale-y-100"
                    />
                    <span
                      className={`${mono.className} relative text-[11px] text-[#E43D12] transition-colors duration-500 group-hover:text-[#EFB11D]`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`${display.className} relative text-lg font-light leading-snug tracking-[-0.01em] transition-colors duration-500 group-hover:text-[#EBE9E1] group-active:text-[#EBE9E1] sm:text-2xl md:text-3xl`}
                      style={WONKY}
                    >
                      {metric}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
            <li>
              <Rule delay={impactMetrics.length * 80} />
            </li>
          </ul>
        </div>
      )}

      {/* ───────── Pivot (dark contrast section) ───────── */}
      {mission.anomaly_report && (
        <Reveal className="mt-16 sm:mt-32">
          <div className="rounded-2xl bg-[#2A1610] px-5 py-10 text-[#EBE9E1] sm:px-14 sm:py-20">
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] text-[#EFB11D]`}>
              (Critical pivot)
            </p>
            <h2
              className={`${display.className} mt-6 text-3xl font-light italic leading-none tracking-[-0.03em] sm:text-5xl md:text-7xl`}
              style={WONKY}
            >
              Where it broke.
            </h2>

            <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 md:grid-cols-2 md:gap-16">
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
      <Rule className="mt-16 sm:mt-32" />
      <Link href={`/project/${next.id}`} className="group block min-h-11 py-10 active:text-[#E43D12] sm:py-20">
        <p className={label}>Next deployment</p>
        <div className="mt-6 flex min-w-0 items-end justify-between gap-4 sm:gap-6">
          <span
            className={`${display.className} min-w-0 max-w-full flex-1 break-words text-[clamp(2rem,9vw,8rem)] font-light leading-[0.9] tracking-[-0.04em] transition-all duration-500 group-hover:italic group-hover:text-[#E43D12]`}
            style={WONKY}
          >
            {next.title}
          </span>
          <span
            aria-hidden
            className="mb-2 shrink-0 text-4xl transition-transform duration-500 ease-[cubic-bezier(.19,1,.22,1)] group-hover:translate-x-4 group-hover:text-[#E43D12] sm:text-6xl"
          >
            →
          </span>
        </div>
      </Link>
      <Rule />
    </section>
  );
}