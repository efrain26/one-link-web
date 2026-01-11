export interface LinkDTO {
  id: string;
  userId: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  position: number;
  isActive: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkDTO {
  title: string;
  url: string;
  description?: string;
  position: number;
}

export interface UpdateLinkDTO {
  title?: string;
  url?: string;
  description?: string;
  isActive?: boolean;
}
