"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { MoveLeft, MoveUpRight } from "lucide-react";
import { jobProjects } from "@/constants/jobProjects";
import ProjectModal from "@/components/ui/projectModal";
import { Badge } from "@/components/ui/badge";

const inter = Inter({ subsets: ["latin"] });

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <div className="mx-auto  max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
      {" "}
      <div className="mt-4 md:mt-12">
        <a
          className="inline-flex items-center font-medium leading-tight text-foreground group cursor-pointer"
          onClick={() => window.history.back()}
        >
          <span className="pb-px transition motion-reduce:transition-none">
            <MoveLeft className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:-translate-x-2 group-focus-visible:-translate-x-2 motion-reduce:transition-none" />
            {"  "} ashaikh
          </span>
        </a>
      </div>
      <h1 className="text-4xl font-bold text-primary mb-12 mt-2">
        All Projects
      </h1>{" "}
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
            {jobProjects.map((project, index) => (
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
                  {project.timeline}
                </td>
                <td className="py-4 pr-4 hidden lg:table-cell">
                  {project.madeAt}
                </td>
                <td className="py-4 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(project.skill) &&
                      project.skill
                        // .reverse()
                        .slice(0, 4)
                        .map((skill, index) => (
                          <Badge key={index}>{skill}</Badge>
                        ))}
                    {Array.isArray(project.skill) &&
                      project.skill.length > 4 && (
                        <Badge>+{project.skill.length - 4}</Badge>
                      )}
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  {project.link && (
                    <a
                      href={
                        project.link && project.link.length > 0
                          ? project.link[0]
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline group"
                    >
                      <div className="text-primary flex">
                        {"Link"}{" "}
                        <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </div>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Use the ProjectModal Component */}
      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
