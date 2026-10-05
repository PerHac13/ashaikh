import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Award } from "lucide-react";
import { getAchievements } from "@/actions/achievementActions";
import { IAchievement } from "@/types/achievement";

export default async function Achievements() {
  let achievements: IAchievement[] = [];

  try {
    const res = await getAchievements({ featured: true });
    if (res.success && res.data) {
      achievements = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
  }

  if (achievements.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className="scroll-mt-16 lg:mt-16">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          Achievements
        </h2>
      </div>

      <div className="space-y-6">
        {achievements.map((item) => {
          const dateStr = item.date
            ? new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "";

          return (
            <Card
              key={item._id}
              className="lg:p-6 mb-8 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-amber-800 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-amber-200 transition-all"
            >
              <CardHeader className="h-full w-full lg:w-1/4 p-0 mb-2 lg:mb-0">
                <CardTitle className="text-sm text-slate-400 font-medium whitespace-nowrap">
                  {dateStr}
                </CardTitle>
                {item.category && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {item.category}
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex flex-col p-0 w-full lg:w-3/4">
                <div className="text-primary font-bold flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-amber-500 inline-block shrink-0" />
                    {item.title}
                  </span>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                      title="View Credential / Proof"
                    >
                      <span>Proof</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {item.organization && (
                  <p className="text-slate-400 text-sm font-semibold mt-0.5">
                    {item.organization}
                  </p>
                )}

                {item.description && item.description.length > 0 && (
                  <CardDescription className="py-3 text-muted-foreground space-y-1">
                    {item.description.map((desc, idx) => (
                      <p key={idx} className="text-sm">
                        {desc}
                      </p>
                    ))}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
