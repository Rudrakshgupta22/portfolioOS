import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { portfolioData, type AnomalyReport, type Mission } from "@/lib/intel";

export type SanityProject = {
  id: string;
  title?: string | null;
  status?: string | null;
  directive?: string | null;
  stack?: string[] | null;
  impactMetrics?: string[] | null;
  anomalyReport?: AnomalyReport | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  gallery?: (string | null)[] | null;
};

export type ProjectData = {
  id: string;
  title: string;
  status: string;
  stack: string[];
  directive: string;
  impact_metrics: string[];
  anomaly_report?: AnomalyReport;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  gallery: string[];
};

const projectFields = groq`{
  "id": slug.current,
  title,
  status,
  directive,
  "stack": techStack,
  impactMetrics,
  anomalyReport,
  githubUrl,
  liveUrl,
  "imageUrl": mainImage.asset->url,
  "gallery": gallery[].asset->url
}`;

export function fromMission(mission: Mission): ProjectData {
  return {
    id: mission.id,
    title: mission.title,
    status: mission.status,
    stack: mission.stack ?? [],
    directive: mission.directive ?? "",
    impact_metrics: mission.impact_metrics ?? [],
    anomaly_report: mission.anomaly_report,
    github_url: mission.github_url ?? mission.repository_url,
    live_url: mission.live_url,
    image_url: mission.image_url,
    gallery: mission.gallery ?? [],
  };
}

export function fromSanityProject(project: SanityProject): ProjectData {
  return {
    id: project.id,
    title: project.title ?? project.id,
    status: project.status ?? "DEPLOYED",
    stack: project.stack ?? [],
    directive: project.directive ?? "",
    impact_metrics: project.impactMetrics ?? [],
    anomaly_report: project.anomalyReport ?? undefined,
    github_url: project.githubUrl ?? undefined,
    live_url: project.liveUrl ?? undefined,
    image_url: project.imageUrl ?? undefined,
    gallery: project.gallery?.filter((url): url is string => Boolean(url)) ?? [],
  };
}

export async function getProjects(): Promise<ProjectData[]> {
  const sanityProjects = await client.fetch<SanityProject[]>(
    groq`*[_type == "project" && defined(slug.current)]${projectFields}`,
  );
  const projects = new Map<string, ProjectData>();

  for (const mission of portfolioData.missions.tier_1_deployments) {
    projects.set(mission.id.toLowerCase(), fromMission(mission));
  }

  for (const project of sanityProjects ?? []) {
    if (project.id) {
      projects.set(project.id.toLowerCase(), fromSanityProject(project));
    }
  }

  return Array.from(projects.values());
}
