"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X, Link as LinkIcon, BookOpen } from "lucide-react";
import { IBlog, IRelatedLink } from "@/types/blog";
import { useBlogActions } from "@/hooks/useBlogActions";

interface BlogFormModalProps {
  blog?: IBlog | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlogFormModal({
  blog,
  isOpen,
  onClose,
  onSuccess,
}: BlogFormModalProps) {
  const isEditMode = !!blog;
  const { createBlog, updateBlog, isSubmitting } = useBlogActions();

  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isSeries, setIsSeries] = useState<boolean>(blog?.isSeries || false);
  const [relatedLinks, setRelatedLinks] = useState<IRelatedLink[]>(
    blog?.relatedLinks || []
  );
  const [newRelatedTitle, setNewRelatedTitle] = useState("");
  const [newRelatedUrl, setNewRelatedUrl] = useState("");

  const formatDateForInput = (dateString?: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      description: blog?.description || "",
      redirectUrl: blog?.redirectUrl || "",
      platform: blog?.platform || "Medium",
      publishedAt: blog?.publishedAt
        ? formatDateForInput(blog.publishedAt)
        : formatDateForInput(new Date()),
      seriesName: blog?.seriesName || "",
      seriesPart: blog?.seriesPart || 1,
      readTime: blog?.readTime || "5 min read",
      featured: blog?.featured ?? true,
    },
  });

  useEffect(() => {
    if (blog) {
      setValue("title", blog.title || "");
      setValue("slug", blog.slug || "");
      setValue("description", blog.description || "");
      setValue("redirectUrl", blog.redirectUrl || "");
      setValue("platform", blog.platform || "Medium");
      setValue("publishedAt", formatDateForInput(blog.publishedAt));
      setValue("seriesName", blog.seriesName || "");
      setValue("seriesPart", blog.seriesPart || 1);
      setValue("readTime", blog.readTime || "5 min read");
      setValue("featured", blog.featured ?? true);
      setTags(blog.tags || []);
      setIsSeries(blog.isSeries || false);
      setRelatedLinks(blog.relatedLinks || []);
    } else {
      reset({
        title: "",
        slug: "",
        description: "",
        redirectUrl: "",
        platform: "Medium",
        publishedAt: formatDateForInput(new Date()),
        seriesName: "",
        seriesPart: 1,
        readTime: "5 min read",
        featured: true,
      });
      setTags([]);
      setIsSeries(false);
      setRelatedLinks([]);
    }
  }, [blog, setValue, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    if (!isEditMode && !watch("slug")) {
      setValue(
        "slug",
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const addTag = () => {
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addRelatedLink = () => {
    if (newRelatedTitle.trim() && newRelatedUrl.trim()) {
      setRelatedLinks([
        ...relatedLinks,
        { title: newRelatedTitle.trim(), url: newRelatedUrl.trim() },
      ]);
      setNewRelatedTitle("");
      setNewRelatedUrl("");
    }
  };

  const removeRelatedLink = (idx: number) => {
    setRelatedLinks(relatedLinks.filter((_, i) => i !== idx));
  };

  const onSubmit = async (formData: any) => {
    const payload: Partial<IBlog> = {
      title: formData.title,
      slug: formData.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      description: formData.description,
      redirectUrl: formData.redirectUrl,
      platform: formData.platform,
      publishedAt: new Date(formData.publishedAt),
      tags,
      isSeries,
      seriesName: isSeries ? formData.seriesName : "",
      seriesPart: isSeries ? Number(formData.seriesPart) || 1 : 1,
      relatedLinks,
      featured: formData.featured,
      readTime: formData.readTime || "5 min read",
    };

    let ok = false;
    if (isEditMode && blog?._id) {
      ok = await updateBlog(blog._id, payload);
    } else {
      ok = await createBlog(payload);
    }

    if (ok) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {isEditMode ? `Edit Blog: ${blog.title}` : "Publish New Blog / Article"}
          </DialogTitle>
          <DialogDescription>
            Add articles with redirect links, series collections, or related blogs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              onChange={handleTitleChange}
              placeholder="e.g. Building Scalable Web Apps with Next.js 15"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug Identifier *</Label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-mono">
                  /blog/
                </span>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug is required" })}
                  placeholder="building-scalable-web-apps"
                  className="font-mono text-sm"
                />
              </div>
              {errors.slug && (
                <p className="text-red-500 text-xs">{errors.slug.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform / Host</Label>
              <select
                id="platform"
                {...register("platform")}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Medium">Medium</option>
                <option value="Dev.to">Dev.to</option>
                <option value="Substack">Substack</option>
                <option value="Hashnode">Hashnode</option>
                <option value="Personal Blog">Personal Blog</option>
                <option value="External">External Article</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectUrl">Redirect URL (External Link) *</Label>
            <Input
              id="redirectUrl"
              {...register("redirectUrl", {
                required: "Redirect URL is required",
              })}
              placeholder="https://medium.com/@ashaikh/... or https://dev.to/..."
            />
            {errors.redirectUrl && (
              <p className="text-red-500 text-xs">
                {errors.redirectUrl.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description / Excerpt *</Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="A brief summary of key takeaways and architectural patterns discussed..."
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date *</Label>
              <Input
                id="publishedAt"
                type="date"
                {...register("publishedAt", { required: "Date is required" })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                {...register("readTime")}
                placeholder="e.g. 5 min read"
              />
            </div>
          </div>

          {/* Series Options */}
          <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isSeries"
                checked={isSeries}
                onCheckedChange={(c) => setIsSeries(!!c)}
              />
              <Label htmlFor="isSeries" className="font-semibold cursor-pointer">
                Part of a Blog Series / Multi-part guide
              </Label>
            </div>

            {isSeries && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="seriesName">Series Name</Label>
                  <Input
                    id="seriesName"
                    {...register("seriesName")}
                    placeholder="e.g. Distributed Systems Deep Dive"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="seriesPart">Part #</Label>
                  <Input
                    id="seriesPart"
                    type="number"
                    min="1"
                    {...register("seriesPart")}
                    placeholder="1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags / Topics</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g. TypeScript, System Design) and press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Related Blogs / Sub-links */}
          <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
            <Label className="font-semibold flex items-center gap-1.5">
              <LinkIcon className="h-4 w-4" />
              Related Blogs / Series Links
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                value={newRelatedTitle}
                onChange={(e) => setNewRelatedTitle(e.target.value)}
                placeholder="Related article title"
              />
              <div className="flex gap-2">
                <Input
                  value={newRelatedUrl}
                  onChange={(e) => setNewRelatedUrl(e.target.value)}
                  placeholder="https://..."
                />
                <Button type="button" variant="outline" onClick={addRelatedLink}>
                  Add
                </Button>
              </div>
            </div>

            {relatedLinks.length > 0 && (
              <div className="space-y-2 pt-2">
                {relatedLinks.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-background p-2 rounded border"
                  >
                    <div className="truncate mr-2">
                      <span className="font-semibold">{item.title}:</span>{" "}
                      <span className="text-muted-foreground">{item.url}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRelatedLink(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(c) => setValue("featured", !!c)}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature on Portfolio Homepage
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Update Blog"
              ) : (
                "Publish Blog"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
