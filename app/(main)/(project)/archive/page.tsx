import { MoveLeft } from "lucide-react";
import { getProjects } from "@/actions/projectActions";
import ProjectArchiveTable from "@/components/ProjectAchriveTable";
import BackLink from "@/components/ui/BackLink";

export default async function ProjectsPage() {
  let projects = [];
  try {
    const response = await getProjects();
    projects = response.data;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="mt-4 md:mt-12">
        <BackLink />
      </div>

      <h1 className="text-4xl font-bold text-primary mb-12 mt-2">
        All Projects
      </h1>

      <ProjectArchiveTable projects={projects} />
    </div>
  );
}
