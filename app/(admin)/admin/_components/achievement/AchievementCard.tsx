"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  Loader2,
  Star,
} from "lucide-react";
import { IAchievement } from "@/types/achievement";

interface AchievementCardProps {
  achievement: IAchievement;
  onEdit: (item: IAchievement) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function AchievementCard({
  achievement,
  onEdit,
  onDelete,
  isDeleting,
}: AchievementCardProps) {
  const formattedDate = achievement.date
    ? new Date(achievement.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Card className="hover:border-primary/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <Trophy className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg font-semibold">
                {achievement.title}
              </CardTitle>
              {achievement.organization && (
                <CardDescription className="flex items-center gap-1.5 text-xs sm:text-sm mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {achievement.organization}
                </CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {achievement.category && (
              <Badge variant="secondary" className="text-xs">
                {achievement.category}
              </Badge>
            )}
            {achievement.featured && (
              <Badge
                variant="outline"
                className="text-amber-500 border-amber-500 bg-amber-500/10 flex items-center gap-1 text-xs"
              >
                <Star className="h-3 w-3 fill-amber-500" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {achievement.description && achievement.description.length > 0 && (
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {achievement.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          {achievement.link && (
            <a
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Proof Link
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(achievement)}
            className="text-xs"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(achievement._id)}
            disabled={isDeleting}
            className="text-xs"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
