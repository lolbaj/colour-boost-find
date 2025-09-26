export interface Resource {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isPremium: boolean;
  downloads: number;
  likes: number;
  tags: string[];
  author: string;
  dateAdded: string;
  fileSize?: string;
  format?: string;
  license: 'free' | 'premium' | 'commercial';
  colors?: string[]; // For color-based filtering
  averageRating?: number; // Average rating of the resource
  totalRatings?: number; // Total number of ratings
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  resourceIds: string[];
  dateCreated: string;
  dateUpdated: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  author: string;
  content: string;
  dateAdded: string;
  likes: number;
  parentId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'resource_update';
  read: boolean;
  dateAdded: string;
  resourceId?: string;
}