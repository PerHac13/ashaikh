"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoveUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProjectModal from "@/components/ui/projectModal";
import ProjectDetailModal from "@/app/(admin)/admin/_components/project/ProjectDetailModal";
import { IProject } from "@/types/project";

interface Props {
  projects: IProject[];
}
function getFormattedTimeline(timeline: { start: Date; end?: Date }): string {
  const startDate = timeline.start && new Date(timeline?.start);
  const endDate = timeline.end ? new Date(timeline.end) : null;

  const formatDate = (date: Date) => format(date, "MMMM, yyyy");

  return endDate ? formatDate(endDate) : formatDate(startDate);
}
export default function ProjectArchiveTable({ projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-border">
            <th className="py-2 pr-4">What</th>
            <th className="py-2 pr-4 hidden md:table-cell">When</th>
            <th className="py-2 pr-4 hidden lg:table-cell">At</th>
            <th className="py-2 pr-4">How</th>
            <th className="py-2 pr-4 hidden sm:table-cell">Where</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index} className="border-b border-border">
              <td className="py-4 pr-4 font-medium text-foreground">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="hover:underline text-left"
                >
                  {project.title}
                </button>
              </td>
              <td className="py-4 pr-4 hidden md:table-cell">
                {getFormattedTimeline(project.timeline)}
              </td>
              <td className="py-4 pr-4 hidden lg:table-cell">
                {project.madeAt}
              </td>
              <td className="py-4 pr-4">
                <div className="flex flex-wrap gap-2">
                  {[...(project.skills || []), ...(project.tags || [])]
                    .slice(0, 4)
                    .map((skill, index) => (
                      <Badge key={index}>{skill}</Badge>
                    ))}
                  {(project.skills?.length || 0) + (project.tags?.length || 0) >
                    4 && (
                    <Badge>
                      +
                      {(project.skills?.length || 0) +
                        (project.tags?.length || 0) -
                        4}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-4 hidden sm:table-cell">
                {project.liveUrl || project.githubUrl ? (
                  <a
                    href={project.liveUrl || project.githubUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline group"
                  >
                    <div className="text-primary flex">
                      Link{" "}
                      <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                    </div>
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
