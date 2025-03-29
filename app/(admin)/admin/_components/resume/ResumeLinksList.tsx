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
import { Loader2, Link, Trash2, CheckCircle } from "lucide-react";
import { ResumeLink } from "@/types/resume";

interface ResumeLinksListProps {
  links: ResumeLink[];
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
  isDeleting: string | null;
  isSettingActive: string | null;
}

const ResumeLinksList: React.FC<ResumeLinksListProps> = ({
  links,
  onDelete,
  onSetActive,
  isDeleting,
  isSettingActive,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {links.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No resume links found. Create one to get started.
        </p>
      ) : (
        links.map((link) => (
          <Card key={link._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{link.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Link className="h-4 w-4 mr-1" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-blue-500 hover:text-blue-700"
                    >
                      View Resume
                    </a>
                  </CardDescription>
                </div>
                {link.isActive && (
                  <Badge
                    variant="outline"
                    className="text-green-500 border-green-500 flex gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardFooter className="pt-2">
              <div className="flex justify-between w-full">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(link.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {!link.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetActive(link._id)}
                      disabled={isSettingActive === link._id}
                    >
                      {isSettingActive === link._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Set Active"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(link._id)}
                    disabled={isDeleting === link._id}
                  >
                    {isDeleting === link._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default ResumeLinksList;
