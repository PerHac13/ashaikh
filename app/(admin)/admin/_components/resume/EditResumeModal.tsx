"use client";

import { useState, useEffect, FormEvent } from "react";
import { useResumeLinkActions } from "@/hooks/useResumeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import FileUploadSection from "./FileUploadSection";
import { ResumeLink } from "@/types/resume";

interface EditResumeModalProps {
  resume: ResumeLink | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditResumeModal({
  resume,
  isOpen,
  onClose,
  onSuccess,
}: EditResumeModalProps) {
  const { updateResumeLink, isSubmitting } = useResumeLinkActions();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    url: "",
  });

  useEffect(() => {
    if (resume) {
      setFormData({
        name: resume.name || "",
        slug: resume.slug || "",
        url: resume.url || "",
      });
    }
  }, [resume]);

  if (!resume) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("url", formData.url);

    const result = await updateResumeLink(resume._id, form);
    if (result) {
      onSuccess();
      onClose();
    }
  };

  const handleUploadSuccess = (uploadedUrl: string) => {
    setFormData((prev) => ({ ...prev, url: uploadedUrl }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resume: {resume.name}</DialogTitle>
          <DialogDescription>
            Update your resume information, slug identifier, or upload a replacement file
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="form" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Edit Details</TabsTrigger>
            <TabsTrigger value="upload">Upload New PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="py-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Resume Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Software Engineer Resume"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">
                  Slug / Identifier (e.g. software, 1, fullstack)
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    /resume/
                  </span>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    placeholder="software"
                    className="font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Share link: <span className="font-mono">/resume/{formData.slug || "your-slug"}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-url">Resume File URL</Label>
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://res.cloudinary.com/..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
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
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="upload" className="py-4">
            <FileUploadSection onLinkGenerated={handleUploadSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
