export interface ResumeLink {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
  createdAt: string;
}

export interface FormDataType {
  name: string;
  url: string;
}

export interface UseResumeLinkActionsReturn {
  getResumeLinks: () => Promise<ResumeLink[]>;
  createResumeLink: (formData: FormData) => Promise<boolean>;
  deleteResumeLink: (id: string) => Promise<boolean>;
  setActiveResumeLink: (id: string) => Promise<boolean>;
  isSubmitting: boolean;
  isLoading: boolean;
}
