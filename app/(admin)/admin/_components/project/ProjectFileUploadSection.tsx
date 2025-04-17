"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectFileUploadSectionProps {
  onLinkGenerated: (url: string) => void;
}

const ProjectFileUploadSection: React.FC<ProjectFileUploadSectionProps> = ({
  onLinkGenerated,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept images
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, WEBP)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setUploadedFileUrl(data.secure_url);
        onLinkGenerated(data.secure_url);
        toast({
          title: "Image uploaded",
          description: "Your project image has been uploaded successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload your image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-medium">Upload project image</h3>
          <p className="text-sm text-muted-foreground">
            Upload an image to showcase your project (JPEG, PNG, GIF, WEBP)
          </p>
          <Input
            id="project-image"
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Uploading image...</span>
        </div>
      )}

      {uploadedFileUrl && (
        <div className="mt-4 space-y-4">
          <div>
            <Label className="text-sm font-medium">Preview:</Label>
            <div className="mt-2 flex justify-center">
              <img
                src={uploadedFileUrl}
                alt="Project preview"
                className="max-h-48 rounded-md object-contain border"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Generated Link:</Label>
            <div className="flex mt-1">
              <Input value={uploadedFileUrl} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(uploadedFileUrl);
                  toast({
                    title: "Link copied",
                    description: "Image link copied to clipboard",
                    variant: "success",
                  });
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFileUploadSection;
