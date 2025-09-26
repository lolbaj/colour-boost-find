import { Resource, Collection, Comment, Notification } from '@/types/resources';

export interface ResourcesContextType {
  resources: Resource[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredResources: Resource[];
  getResourceById: (id: string) => Resource | undefined;
  toggleLike: (id: string) => void;
  likedResources: Set<string>;
  downloadedResources: Set<string>;
  addDownload: (id: string) => void;
  addResource: (newResource: Omit<Resource, 'id' | 'downloads' | 'likes' | 'author' | 'dateAdded'>) => Resource;
  isLoading: boolean;
  isError: boolean;
  advancedSearch: (params: {
    query?: string;
    category?: string;
    license?: string;
    format?: string;
    dateAdded?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minFileSize?: string;
    maxFileSize?: string;
    colors?: string;
  }) => Promise<Resource[]>;
  rateResource: (id: string, rating: number) => void;
  userRatings: Record<string, number>;
  setUserRating: (id: string, rating: number) => void;
  getUserRating: (id: string) => number | undefined;
  // Collections functionality
  collections: Collection[];
  loadCollections: () => void;
  createCollection: (name: string, description?: string) => Promise<void>;
  addToCollection: (collectionId: string, resourceId: string) => Promise<void>;
  removeFromCollection: (collectionId: string, resourceId: string) => Promise<void>;
  isResourceInCollection: (resourceId: string) => boolean;
  getCollectionByResourceId: (resourceId: string) => Collection | undefined;
  // Comments functionality
  comments: Comment[];
  loadComments: (resourceId: string) => void;
  addComment: (resourceId: string, content: string, parentId?: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => void;
  getCommentsForResource: (resourceId: string) => Comment[];
  // Notifications functionality
  notifications: Notification[];
  loadNotifications: () => void;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  unreadNotificationsCount: number;
}