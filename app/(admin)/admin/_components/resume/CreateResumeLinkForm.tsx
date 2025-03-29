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
    form.append("url", formData.url);

    const result = await createResumeLink(form);
    if (result) {
      setFormData({ name: "", url: "" });
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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Software Developer Resume"
          required
        />
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
