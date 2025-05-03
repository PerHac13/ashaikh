"use client";

import {
  Clock,
  ExternalLink,
  Github,
  Loader2,
  Star,
  Trash,
  Edit,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IProject } from "@/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectCardProps {
  project: IProject;
  onDelete: (id: string) => void;
  onEdit: (project: IProject) => void;
  onSetFeatured: (id: string) => void;
  onViewDetails: (project: IProject) => void;
  isDeleting: boolean;
  isSettingFeatured: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDelete,
  onEdit,
  onSetFeatured,
  onViewDetails,
  isDeleting,
  isSettingFeatured,
}) => {
  // Format dates
  const startDate = new Date(project.timeline.start);
  const endDate = project.timeline.end ? new Date(project.timeline.end) : null;

  const formatDate = (date: Date) => format(date, "MMM yyyy");

  const timelineText = endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : `Started ${formatDate(startDate)}`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{project.title}</CardTitle>
          <div className="flex gap-1">
            {project.featured && (
              <Badge variant="default" className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {project.completed && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Clock className="h-3 w-3 mr-1 inline" />
          {timelineText}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="mb-4">
          {project.description.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1">
              {project.description.slice(0, 2).map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {item.length > 80 ? `${item.substring(0, 80)}...` : item}
                </li>
              ))}
              {project.description.length > 2 && (
                <li className="text-sm text-muted-foreground italic">
                  + {project.description.length - 2} more...
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No description provided
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium uppercase text-muted-foreground">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase text-muted-foreground">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {project.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={() => onViewDetails(project)}
            variant="outline"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => onEdit(project)}
            variant="outline"
            title="Edit project"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => onDelete(project._id)}
            variant="outline"
            className="text-red-500 hover:text-red-700"
            disabled={isDeleting}
            title="Delete project"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex gap-1">
          {project.githubUrl && (
            <Button
              size="sm"
              variant="outline"
              asChild
              title="View GitHub repository"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}

          {project.liveUrl && (
            <Button
              size="sm"
              variant="outline"
              asChild
              title="Visit live project"
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}

          <Button
            size="sm"
            variant={project.featured ? "default" : "outline"}
            className={cn(
              project.featured ? "bg-yellow-500 hover:bg-yellow-600" : ""
            )}
            onClick={() => onSetFeatured(project._id)}
            disabled={isSettingFeatured}
            title={project.featured ? "Featured project" : "Set as featured"}
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
