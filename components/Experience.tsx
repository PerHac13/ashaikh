import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";
import { getExperiences } from "@/actions/experienceActions";
import Link from "next/link";
import { IExperience } from "@/models/Experience";

export default async function Experience() {
  let experiences = [];

  try {
    experiences = await getExperiences({ featured: true });
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
  }

  return (
    <section id="experience" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Experience
        </h2>
      </div>
      {experiences.length > 0 ? (
        experiences.map((job: IExperience) => (
          <Card
            key={job._id}
            className="lg:p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200"
          >
            <CardHeader className="h-full w-full p-0">
              <CardTitle className="text-base text-slate-400 whitespace-nowrap">
                {job.startDate &&
                  `${new Date(job.startDate).toLocaleString("default", {
                    month: "short",
                  })} ${new Date(job.startDate).getFullYear()}`}{" "}
                -{" "}
                {job.currentlyWorking
                  ? "Present"
                  : job.endDate &&
                    `${new Date(job.endDate).toLocaleString("default", {
                      month: "short",
                    })} ${new Date(job.endDate).getFullYear()}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col p-0">
              <p className="text-primary font-bold">
                {job.currentPosition} • {job.organization}
              </p>
              {job.previousPositions &&
                job.previousPositions.map((position, index) => (
                  <p key={index} className="text-slate-400 text-sm font-bold">
                    {position}
                  </p>
                ))}
              <CardDescription className="py-3 text-muted-foreground">
                {job.description &&
                  job.description.map((desc, index) => (
                    <p key={index}>{desc}</p>
                  ))}
              </CardDescription>
              <CardFooter className="p-0 flex flex-wrap gap-2">
                {job.skills &&
                  job.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
              </CardFooter>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No experiences found.</div>
      )}
      <div className="lg:px-12 mt-12">
        <Link
          href="/resume"
          className="inline-flex items-center font-medium leading-tight text-foreground group"
          target="_blank"
        >
          <span className="border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none">
            View Full Resume
          </span>
          <MoveRight className="ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
        </Link>
      </div>
    </section>
  );
}
