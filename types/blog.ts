export interface IRelatedLink {
  title: string;
  url: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  redirectUrl: string;
  platform?: string;
  publishedAt: string | Date;
  tags: string[];
  isSeries: boolean;
  seriesName?: string;
  seriesPart?: number;
  relatedLinks: IRelatedLink[];
  featured: boolean;
  readTime?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  redirectUrl: string;
  platform?: string;
  publishedAt: string;
  tags: string[];
  isSeries: boolean;
  seriesName?: string;
  seriesPart?: number;
  relatedLinks: IRelatedLink[];
  featured: boolean;
  readTime?: string;
}

export interface UseBlogActionsReturn {
  getBlogs: (filter?: { featured?: boolean; seriesName?: string }) => Promise<IBlog[]>;
  getBlogBySlug: (slug: string) => Promise<IBlog | null>;
  createBlog: (data: Partial<IBlog>) => Promise<boolean>;
  updateBlog: (id: string, data: Partial<IBlog>) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
}
