import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveUpRight, MoveRight } from "lucide-react";
import { IProject } from "@/types/project";
import { getProjects } from "@/actions/projectActions";

export default async function Projects() {
  let projects: IProject[] = [];
  try {
    const projectList = await getProjects();
    projects = projectList.data.filter(
      (item: IProject) => item.featured === true
    );
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
  return (
    <section id="projects" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Projects
        </h2>
      </div>

      {projects.map((project) => (
        <a
          key={project._id}
          href={project.liveUrl || project.githubUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:cursor-pointer"
        >
          <Card className="group lg:p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200">
            <CardHeader className="h-full w-full lg:w-1/3 mb-4 p-0">
              <Image
                src={project.imgUrl || "/projects/placeholder.svg"}
                alt={`Screenshot of ${project.title}`}
                width={1920}
                height={1080}
                priority
                className="bg-transparent mt-2  rounded-[0.5rem]"
              />
            </CardHeader>
            <CardContent className="flex flex-col p-0 w-full lg:w-2/3">
              <div className="text-primary font-bold">
                {project.title}{" "}
                <MoveUpRight className="ml-1 inline-block h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none" />
              </div>
              <CardDescription className="py-3 text-muted-foreground">
                {project.description?.map((desc, index) => (
                  <p key={index} className="">
                    {desc}
                  </p>
                ))}
              </CardDescription>
              <CardFooter className="p-0 flex flex-wrap gap-2">
                {Array.isArray(project.skills) || Array.isArray(project.tags)
                  ? [...(project.skills || []), ...(project.tags || [])].map(
                      (skill, index) => <Badge key={index}>{skill}</Badge>
                    )
                  : null}
              </CardFooter>
            </CardContent>
          </Card>
        </a>
      ))}

      <div className="lg:px-12 mt-12">
        <Link
          href="/archive"
          className="inline-flex items-center font-medium leading-tight text-foreground group"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View Full Project Archive
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </Link>
      </div>
    </section>
  );
}
