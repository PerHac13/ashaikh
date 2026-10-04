"use client";

import { useState, useEffect, FormEvent } from "react";
import { useResumeLinkActions } from "@/hooks/useResumeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { FormDataType } from "@/types/resume";

interface CreateResumeLinkFormProps {
  onSuccess: () => void;
  initialUrl?: string;
}

const CreateResumeLinkForm: React.FC<CreateResumeLinkFormProps> = ({
  onSuccess,
  initialUrl = "",
}) => {
  const { createResumeLink, isSubmitting } = useResumeLinkActions();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    slug: "",
    url: initialUrl,
  });

  // Update URL when initialUrl changes (from file upload)
  useEffect(() => {
    if (initialUrl) {
      setFormData((prev) => ({ ...prev, url: initialUrl }));
    }
  }, [initialUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug || "");
    form.append("url", formData.url);

    const result = await createResumeLink(form);
    if (result) {
      setFormData({ name: "", slug: "", url: "" });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Resume Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value;
            setFormData((prev) => ({
              ...prev,
              name,
              slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
            }));
          }}
          placeholder="e.g. Software Developer Resume"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Custom Share Slug / Identifier (Optional)</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">/resume/</span>
          <Input
            id="slug"
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
          Allows sharing via <span className="font-mono">/resume/{formData.slug || "your-slug"}</span> (or /resume/1)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Resume URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com/resume.pdf"
          required
        />
        <p className="text-xs text-muted-foreground">
          Paste the URL of your resume or upload a file in the upload tab
        </p>
      </div>

      <Button type="submit" className="mt-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Resume Link"
        )}
      </Button>
    </form>
  );
};

export default CreateResumeLinkForm;
