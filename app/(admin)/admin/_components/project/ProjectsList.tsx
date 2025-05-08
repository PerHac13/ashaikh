"use client";

import { useState } from "react";
import { IProject } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectEditModal from "./ProjectEditModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ProjectsListProps {
  projects: IProject[];
  onDelete: (id: string) => Promise<void>;
  onSetFeatured: (id: string) => Promise<void>;
  isDeleting: string | null;
  // isSettingFeatured: string | null;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onDelete,
  onSetFeatured,
  isDeleting,
  // isSettingFeatured,
}) => {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleViewDetails = (project: IProject) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (project: IProject) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await onDelete(projectToDelete);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-2">
          Create your first project by clicking the Create Project button above.
        </p>
      </div>
    );
  }

  // Separate featured projects
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <>
      {featuredProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeletePrompt}
                onEdit={handleEdit}
                onSetFeatured={onSetFeatured}
                onViewDetails={handleViewDetails}
                isDeleting={isDeleting === project._id}
                isSettingFeatured={false} // isSettingFeatured === project._id
              />
            ))}
          </div>
        </div>
      )}

      <div>
        {featuredProjects.length > 0 && (
          <h2 className="text-xl font-bold mb-4">All Projects</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDeletePrompt}
              onEdit={handleEdit}
              onSetFeatured={onSetFeatured}
              onViewDetails={handleViewDetails}
              isDeleting={isDeleting === project._id}
              isSettingFeatured={false} // isSettingFeatured === project._id
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <>
          <ProjectDetailModal
            project={selectedProject}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
          />

          <ProjectEditModal
            project={selectedProject}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProject(null);
            }}
          />
        </>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectsList;
