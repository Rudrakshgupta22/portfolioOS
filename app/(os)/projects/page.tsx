import ProjectsGrid from "./ProjectsGrid";
import { getProjects } from "@/lib/projects";

export const instant = false;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsGrid missions={projects ?? []} />;
}
