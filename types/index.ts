export type Role = 'USER' | 'ADMIN';

export interface UserProfile {
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface AppItem {
  id: string;
  name: string;
  url: string;
  description: string;
  iconUrl: string;
  categoryId: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PortalSettings {
  portalName: string;
  logoUrl: string;
}
