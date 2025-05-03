"use client";

import { useState, useEffect } from "react";
import { useProjectActions } from "@/hooks/useProjectActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import CreateProjectForm from "../_components/project/CreateProjectForm";
import ProjectFileUploadSection from "../_components/project/ProjectFileUploadSection";
import ProjectsList from "../_components/project/ProjectsList";
import { IProject as Project, UseProjectActionsReturn } from "@/types/project";

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // const [setFeaturedId, setSetFeaturedId] = useState<string | null>(null);

  const { getProjects, deleteProject, isLoading } =
    useProjectActions() as UseProjectActionsReturn;

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUploadedUrl("");
  };

  const handleCreate = () => {
    handleDialogClose();
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const success = await deleteProject(id);
    if (success) {
      fetchProjects();
    }
    setDeleteId(null);
  };

  const handleSetFeatured = async (id: string) => {
    // setSetFeaturedId(id);
    // const result = await setFeaturedProject(id);
    // if (result) {
    //   fetchProjects();
    // }
    // setSetFeaturedId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Upload a project file or manually add project details
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="form" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Enter Details</TabsTrigger>
                <TabsTrigger value="upload">Upload Project</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="py-4">
                <CreateProjectForm
                  onSuccess={handleCreate}
                  initialUrl={uploadedUrl}
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
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : (
        <ProjectsList
          projects={projects}
          onDelete={handleDelete}
          onSetFeatured={handleSetFeatured}
          isDeleting={deleteId}
          // isSettingFeatured={setFeaturedId}
        />
      )}
    </div>
  );
};

export default ProjectPage;
