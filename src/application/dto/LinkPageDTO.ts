export interface LinkPageThemeDTO {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
}

export interface LinkPageDTO {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: LinkPageThemeDTO;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLinkPageDTO {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  theme?: LinkPageThemeDTO;
}
