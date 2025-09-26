// api.ts
import { Resource, Collection, Comment, Notification } from '@/types/resources';

// Base URL for API endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Generic fetch function with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

// Resource API functions
export const resourceAPI = {
  // Get all resources
  getAllResources: async (): Promise<Resource[]> => {
    try {
      return await fetchAPI('/resources');
    } catch (error) {
      console.warn('Failed to fetch resources from API, using mock data');
      throw error;
    }
  },

  // Get resource by ID
  getResourceById: async (id: string): Promise<Resource> => {
    try {
      return await fetchAPI(`/resources/${id}`);
    } catch (error) {
      console.warn(`Failed to fetch resource ${id} from API`);
      throw error;
    }
  },

  // Search resources
  searchResources: async (query: string): Promise<Resource[]> => {
    try {
      return await fetchAPI(`/resources/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.warn(`Failed to search resources with query "${query}"`);
      throw error;
    }
  },

  // Advanced search resources
  advancedSearch: async (params: {
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
  }): Promise<Resource[]> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.license) queryParams.append('license', params.license);
      if (params.format) queryParams.append('format', params.format);
      if (params.dateAdded) queryParams.append('dateAdded', params.dateAdded);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.minFileSize) queryParams.append('minFileSize', params.minFileSize);
      if (params.maxFileSize) queryParams.append('maxFileSize', params.maxFileSize);
      if (params.colors) queryParams.append('colors', params.colors);
      
      return await fetchAPI(`/resources/search?${queryParams.toString()}`);
    } catch (error) {
      console.warn('Failed to perform advanced search');
      throw error;
    }
  },

  // Get resources by category
  getResourcesByCategory: async (category: string): Promise<Resource[]> => {
    try {
      return await fetchAPI(`/resources/category/${encodeURIComponent(category)}`);
    } catch (error) {
      console.warn(`Failed to fetch resources by category "${category}"`);
      throw error;
    }
  },

  // Update resource likes
  toggleLike: async (id: string, userId: string): Promise<{ likes: number }> => {
    try {
      return await fetchAPI(`/resources/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to toggle like for resource ${id}`);
      throw error;
    }
  },

  // Record download
  recordDownload: async (id: string, userId: string): Promise<{ downloads: number }> => {
    try {
      return await fetchAPI(`/resources/${id}/download`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to record download for resource ${id}`);
      throw error;
    }
  },

  // Rate a resource
  rateResource: async (id: string, userId: string, rating: number): Promise<{ averageRating: number, totalRatings: number }> => {
    try {
      return await fetchAPI(`/resources/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ userId, rating }),
      });
    } catch (error) {
      console.warn(`Failed to rate resource ${id}`);
      throw error;
    }
  },

  // Get resource ratings
  getResourceRatings: async (id: string): Promise<{ averageRating: number, totalRatings: number, userRating?: number }> => {
    try {
      return await fetchAPI(`/resources/${id}/ratings`);
    } catch (error) {
      console.warn(`Failed to get ratings for resource ${id}`);
      throw error;
    }
  },

  // Create a new collection
  createCollection: async (userId: string, collectionData: { name: string; description?: string }): Promise<Collection> => {
    try {
      return await fetchAPI(`/users/${userId}/collections`, {
        method: 'POST',
        body: JSON.stringify(collectionData),
      });
    } catch (error) {
      console.warn(`Failed to create collection for user ${userId}`);
      throw error;
    }
  },

  // Get user's collections
  getUserCollections: async (userId: string): Promise<Collection[]> => {
    try {
      return await fetchAPI(`/users/${userId}/collections`);
    } catch (error) {
      console.warn(`Failed to get collections for user ${userId}`);
      throw error;
    }
  },

  // Add resource to a collection
  addResourceToCollection: async (userId: string, collectionId: string, resourceId: string): Promise<void> => {
    try {
      return await fetchAPI(`/users/${userId}/collections/${collectionId}/resources`, {
        method: 'POST',
        body: JSON.stringify({ resourceId }),
      });
    } catch (error) {
      console.warn(`Failed to add resource to collection ${collectionId}`);
      throw error;
    }
  },

  // Remove resource from a collection
  removeResourceFromCollection: async (userId: string, collectionId: string, resourceId: string): Promise<void> => {
    try {
      return await fetchAPI(`/users/${userId}/collections/${collectionId}/resources/${resourceId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn(`Failed to remove resource from collection ${collectionId}`);
      throw error;
    }
  },

  // Get resources in a collection
  getResourcesInCollection: async (userId: string, collectionId: string): Promise<Resource[]> => {
    try {
      return await fetchAPI(`/users/${userId}/collections/${collectionId}/resources`);
    } catch (error) {
      console.warn(`Failed to get resources in collection ${collectionId}`);
      throw error;
    }
  },
};

// User API functions
export const userAPI = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      return await fetchAPI(`/users/${userId}`);
    } catch (error) {
      console.warn(`Failed to fetch user profile for user ${userId}`);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, data: Partial<{ displayName: string }>) => {
    try {
      return await fetchAPI(`/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn(`Failed to update user profile for user ${userId}`);
      throw error;
    }
  },

  // Get user's liked resources
  getUserLikedResources: async (userId: string): Promise<string[]> => {
    try {
      const response = await fetchAPI(`/users/${userId}/liked-resources`);
      return response.resourceIds || [];
    } catch (error) {
      console.warn(`Failed to fetch liked resources for user ${userId}`);
      throw error;
    }
  },

  // Get user's downloaded resources
  getUserDownloadedResources: async (userId: string): Promise<string[]> => {
    try {
      const response = await fetchAPI(`/users/${userId}/downloaded-resources`);
      return response.resourceIds || [];
    } catch (error) {
      console.warn(`Failed to fetch downloaded resources for user ${userId}`);
      throw error;
    }
  },

  // Get user's collections
  getUserCollections: async (userId: string): Promise<Collection[]> => {
    try {
      return await fetchAPI(`/users/${userId}/collections`);
    } catch (error) {
      console.warn(`Failed to fetch collections for user ${userId}`);
      throw error;
    }
  },

  // Get user notifications
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      return await fetchAPI(`/users/${userId}/notifications`);
    } catch (error) {
      console.warn(`Failed to fetch notifications for user ${userId}`);
      throw error;
    }
  },
};

// Comment API functions
export const commentAPI = {
  // Get comments for a resource
  getResourceComments: async (resourceId: string): Promise<Comment[]> => {
    try {
      return await fetchAPI(`/resources/${resourceId}/comments`);
    } catch (error) {
      console.warn(`Failed to fetch comments for resource ${resourceId}`);
      throw error;
    }
  },

  // Add a comment to a resource
  addComment: async (resourceId: string, userId: string, content: string, parentId?: string): Promise<Comment> => {
    try {
      return await fetchAPI(`/resources/${resourceId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ userId, content, parentId }),
      });
    } catch (error) {
      console.warn(`Failed to add comment to resource ${resourceId}`);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    try {
      return await fetchAPI(`/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.warn(`Failed to update comment ${commentId}`);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string, userId: string): Promise<void> => {
    try {
      await fetchAPI(`/comments/${commentId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to delete comment ${commentId}`);
      throw error;
    }
  },

  // Like a comment
  likeComment: async (commentId: string, userId: string): Promise<{ likes: number }> => {
    try {
      return await fetchAPI(`/comments/${commentId}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to like comment ${commentId}`);
      throw error;
    }
  },
};

// Notification API functions
export const notificationAPI = {
  // Mark notification as read
  markNotificationAsRead: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await fetchAPI(`/notifications/${notificationId}/read`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to mark notification as read ${notificationId}`);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId: string): Promise<void> => {
    try {
      await fetchAPI(`/users/${userId}/notifications/read-all`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to mark all notifications as read for user ${userId}`);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await fetchAPI(`/notifications/${notificationId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.warn(`Failed to delete notification ${notificationId}`);
      throw error;
    }
  },
};