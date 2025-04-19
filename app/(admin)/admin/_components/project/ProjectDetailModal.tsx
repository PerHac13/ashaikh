"use client";

import { IProject } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Clock,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";
import { format } from "date-fns";

interface ProjectDetailModalProps {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  // Format dates
  const startDate = new Date(project.timeline.start);
  const endDate = project.timeline.end ? new Date(project.timeline.end) : null;

  const formatDate = (date: Date) => format(date, "MMMM d, yyyy");

  const timelineText = endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : `Started ${formatDate(startDate)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-2xl mr-2">{project.title}</DialogTitle>
            <div className="flex flex-wrap gap-1">
              {project.featured && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Featured Project
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
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{timelineText}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Team Size: {project.teamSize}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {project.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Github className="mr-1 h-4 w-4" />
                    GitHub Repository
                  </a>
                </Button>
              )}

              {project.liveUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Live Project
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            {project.description.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {project.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">
                No description provided
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
                {project.skills.length === 0 && (
                  <p className="text-muted-foreground italic">
                    No skills listed
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length === 0 && (
                  <p className="text-muted-foreground italic">No tags listed</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
