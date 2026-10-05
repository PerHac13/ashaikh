"use client";

import { useState, useEffect, useCallback } from "react";
import { useResumeLinkActions } from "@/hooks/useResumeActions";
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

import CreateResumeLinkForm from "../_components/resume/CreateResumeLinkForm";
import FileUploadSection from "../_components/resume/FileUploadSection";
import ResumeLinksList from "../_components/resume/ResumeLinksList";
import EditResumeModal from "../_components/resume/EditResumeModal";
import { ResumeLink, UseResumeLinkActionsReturn } from "@/types/resume";

const ResumePage: React.FC = () => {
  const [links, setLinks] = useState<ResumeLink[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingResume, setEditingResume] = useState<ResumeLink | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [setActiveId, setSetActiveId] = useState<string | null>(null);

  const { getResumeLinks, deleteResumeLink, setActiveResumeLink } =
    useResumeLinkActions() as UseResumeLinkActionsReturn;

  const fetchLinks = useCallback(async () => {
    const data = await getResumeLinks();
    setLinks(data || []);
    setInitialLoading(false);
  }, [getResumeLinks]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUploadedUrl("");
  };

  const handleCreate = () => {
    handleDialogClose();
    fetchLinks();
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    const success = await deleteResumeLink(id);
    if (success) {
      fetchLinks();
    }
    setDeleteId(null);
  };

  const handleSetActive = async (id: string) => {
    setSetActiveId(id);
    const result = await setActiveResumeLink(id);
    if (result) {
      fetchLinks();
    }
    setSetActiveId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage multi-resume share links, active resume, and direct files
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Resume Link</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new resume link</DialogTitle>
              <DialogDescription>
                Upload a resume file or provide a link to your existing resume
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="form" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Enter Details</TabsTrigger>
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="py-4">
                <CreateResumeLinkForm
                  onSuccess={handleCreate}
                  initialUrl={uploadedUrl}
                />
              </TabsContent>

              <TabsContent value="upload" className="py-4">
                <FileUploadSection
                  onLinkGenerated={(url) => setUploadedUrl(url)}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {editingResume && (
        <EditResumeModal
          resume={editingResume}
          isOpen={!!editingResume}
          onClose={() => setEditingResume(null)}
          onSuccess={fetchLinks}
        />
      )}

      {initialLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading resume links...</span>
        </div>
      ) : (
        <ResumeLinksList
          links={links}
          onEdit={(resume) => setEditingResume(resume)}
          onDelete={handleDelete}
          onSetActive={handleSetActive}
          isDeleting={deleteId}
          isSettingActive={setActiveId}
        />
      )}
    </div>
  );
};

export default ResumePage;
