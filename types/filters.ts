import { RoleType } from '@/models/Experience';

export interface ExperienceFilter {
  featured?: boolean;
  currentlyWorking?: boolean;
  organization?: string;
  roleType?: RoleType;
}