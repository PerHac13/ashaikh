"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  onLinkGenerated: (url: string) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onLinkGenerated,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
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
          title: "File uploaded",
          description: "Your resume has been uploaded successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload your resume",
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
          <h3 className="font-medium">Upload your resume</h3>
          <p className="text-sm text-muted-foreground">
            Upload a PDF file to generate a shareable link
          </p>
          <Input
            id="resume-file"
            type="file"
            accept=".pdf"
            className="mt-2"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Uploading file...</span>
        </div>
      )}

      {uploadedFileUrl && (
        <div className="mt-2">
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
                  description: "Resume link copied to clipboard",
                  variant: "success",
                });
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
