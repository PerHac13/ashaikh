export interface IAchievement {
  _id: string;
  title: string;
  organization?: string;
  date: string | Date;
  description: string[];
  category?: string;
  link?: string;
  imagePath?: string;
  featured: boolean;
  score?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface AchievementFormData {
  title: string;
  organization?: string;
  date: string;
  description: string[];
  category?: string;
  link?: string;
  imagePath?: string;
  featured: boolean;
  score?: number;
}

export interface UseAchievementActionsReturn {
  getAchievements: (filter?: { featured?: boolean }) => Promise<IAchievement[]>;
  createAchievement: (data: Partial<IAchievement>) => Promise<boolean>;
  updateAchievement: (id: string, data: Partial<IAchievement>) => Promise<boolean>;
  deleteAchievement: (id: string) => Promise<boolean>;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
}
