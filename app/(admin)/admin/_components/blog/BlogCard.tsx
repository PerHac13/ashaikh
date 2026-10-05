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
  BookOpen,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar,
  Layers,
  Star,
  Loader2,
  Clock,
  Link as LinkIcon,
} from "lucide-react";
import { IBlog } from "@/types/blog";

interface BlogCardProps {
  blog: IBlog;
  onEdit: (item: IBlog) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function BlogCard({
  blog,
  onEdit,
  onDelete,
  isDeleting,
}: BlogCardProps) {
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className="hover:border-primary/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg font-semibold">
                {blog.title}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-0.5 font-mono">
                <span>/blog/{blog.slug}</span>
                {blog.platform && (
                  <Badge variant="outline" className="text-xs font-sans">
                    {blog.platform}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {blog.isSeries && blog.seriesName && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1 text-xs"
              >
                <Layers className="h-3 w-3" />
                {blog.seriesName} (Part {blog.seriesPart || 1})
              </Badge>
            )}
            {blog.featured && (
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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {blog.description}
        </p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {blog.relatedLinks && blog.relatedLinks.length > 0 && (
          <div className="pt-2 text-xs text-muted-foreground">
            <span className="font-semibold flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              Related Blogs ({blog.relatedLinks.length}):
            </span>
            <ul className="list-disc pl-4 mt-1 space-y-0.5">
              {blog.relatedLinks.map((rel, idx) => (
                <li key={idx}>
                  <a
                    href={rel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {rel.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          {blog.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.readTime}
            </span>
          )}
          {blog.redirectUrl && (
            <a
              href={blog.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Redirect Target
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(blog)}
            className="text-xs"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(blog._id)}
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
