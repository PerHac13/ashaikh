"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateProjectForm from "./CreateProjectForm";
import ProjectFileUploadSection from "./ProjectFileUploadSection";
import { useProjectActions } from "@/hooks/useProjectActions";

interface ProjectEditModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [uploadedUrl, setUploadedUrl] = useState<string>(
    project.imageUrl || ""
  );
  const { getProjects } = useProjectActions();

  const handleSuccess = async () => {
    await getProjects();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Project: {project.title}</DialogTitle>
          <DialogDescription>
            Update your project details or upload a new image
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="form" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Edit Details</TabsTrigger>
            <TabsTrigger value="upload">Upload New Image</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="py-4">
            <CreateProjectForm
              onSuccess={handleSuccess}
              initialUrl={uploadedUrl}
              projectToEdit={project}
            />
          </TabsContent>

          <TabsContent value="upload" className="py-4">
            <ProjectFileUploadSection
              onLinkGenerated={(url) => setUploadedUrl(url)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
