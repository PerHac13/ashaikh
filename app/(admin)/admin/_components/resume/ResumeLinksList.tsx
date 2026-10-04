"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ExternalLink,
  Trash2,
  CheckCircle,
  Pencil,
  Copy,
  Share2,
} from "lucide-react";
import { ResumeLink } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

interface ResumeLinksListProps {
  links: ResumeLink[];
  onEdit: (link: ResumeLink) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
  isDeleting: string | null;
  isSettingActive: string | null;
}

const ResumeLinksList: React.FC<ResumeLinksListProps> = ({
  links,
  onEdit,
  onDelete,
  onSetActive,
  isDeleting,
  isSettingActive,
}) => {
  const { toast } = useToast();

  const handleCopyShareLink = (slugOrId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/resume/${slugOrId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share link copied",
      description: `Copied: ${shareUrl}`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-4 mt-6 max-w-4xl">
      {links.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No resume links found. Create one to get started.
        </Card>
      ) : (
        links.map((link) => {
          const shareIdentifier = link.slug || link._id;
          return (
            <Card key={link._id} className="transition-all hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg font-semibold">
                        {link.name}
                      </CardTitle>
                      {link.isActive && (
                        <Badge
                          variant="outline"
                          className="text-green-500 border-green-500 bg-green-500/10 flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Default / Active
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                        /resume/{shareIdentifier}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Direct PDF
                      </a>
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyShareLink(shareIdentifier)}
                      className="text-xs"
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      Copy Share Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(link)}
                      className="text-xs"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="pt-2 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(link.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!link.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetActive(link._id)}
                      disabled={isSettingActive === link._id}
                      className="text-xs"
                    >
                      {isSettingActive === link._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : null}
                      Set As Default
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(link._id)}
                    disabled={isDeleting === link._id}
                    className="text-xs"
                  >
                    {isDeleting === link._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default ResumeLinksList;
