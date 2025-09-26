import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceAPI, userAPI, commentAPI, notificationAPI } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Resource, Collection, Comment, Notification } from '@/types/resources';
import { mockResources } from '@/data/mockResources';

import { ResourcesContextType } from '@/types/ResourcesContextType';

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

interface ResourcesContextProviderProps {
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
  userRatings: Record<string, number>; // Store user's ratings for resources
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



export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [likedResources, setLikedResources] = useState<Set<string>>(new Set());
  const [downloadedResources, setDownloadedResources] = useState<Set<string>>(new Set());
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [collections, setCollections] = useState<Collection[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all resources with fallback to mock data
  const { data: resources = mockResources, isLoading, isError } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      try {
        // Try to fetch from API
        return await resourceAPI.getAllResources();
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn('API not available, using mock data');
        return mockResources;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Load user-specific data when user changes
  useQuery({
    queryKey: ['userResources', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return;
      
      try {
        const [liked, downloaded] = await Promise.all([
          userAPI.getUserLikedResources(currentUser.uid),
          userAPI.getUserDownloadedResources(currentUser.uid)
        ]);
        
        setLikedResources(new Set(liked));
        setDownloadedResources(new Set(downloaded));
      } catch (error) {
        console.error('Failed to load user resources:', error);
        // Fallback to localStorage
        const savedLikedResources = localStorage.getItem(`likedResources_${currentUser.uid}`);
        const savedDownloadedResources = localStorage.getItem(`downloadedResources_${currentUser.uid}`);
        
        if (savedLikedResources) {
          setLikedResources(new Set(JSON.parse(savedLikedResources)));
        }
        
        if (savedDownloadedResources) {
          setDownloadedResources(new Set(JSON.parse(savedDownloadedResources)));
        }
      }
      
      return null;
    },
    enabled: !!currentUser,
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.toggleLike(id, currentUser.uid);
    },
    onSuccess: (_, id) => {
      // Update local state
      setLikedResources(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        
        // Update localStorage with the new state
        if (currentUser) {
          localStorage.setItem(`likedResources_${currentUser.uid}`, JSON.stringify([...newSet]));
        }
        
        return newSet;
      });
      
      // Invalidate and refetch resources
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error) => {
      toast.error('Failed to update like: ' + (error as Error).message);
    }
  });

  // Add download mutation
  const addDownloadMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.recordDownload(id, currentUser.uid);
    },
    onSuccess: (_, id) => {
      // Update local state
      setDownloadedResources(prev => {
        const newSet = new Set(prev).add(id);
        
        // Update localStorage with the new state
        if (currentUser) {
          localStorage.setItem(`downloadedResources_${currentUser.uid}`, JSON.stringify([...newSet]));
        }
        
        return newSet;
      });
      
      // Invalidate and refetch resources
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error) => {
      toast.error('Failed to record download: ' + (error as Error).message);
    }
  });

  // Rate resource mutation
  const rateResourceMutation = useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.rateResource(id, currentUser.uid, rating);
    },
    onSuccess: (data, { id, rating }) => {
      // Update local state
      setUserRatings(prev => ({ ...prev, [id]: rating }));
      
      // Update resources with new rating data
      queryClient.setQueryData(['resources'], (oldData: Resource[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(resource => {
          if (resource.id === id) {
            return {
              ...resource,
              averageRating: data.averageRating,
              totalRatings: data.totalRatings
            };
          }
          return resource;
        });
      });
      
      toast.success('Rating submitted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit rating: ' + (error as Error).message);
    }
  });

  // Load user collections
  const loadCollectionsMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return userAPI.getUserCollections(userId);
    },
    onSuccess: (data) => {
      setCollections(data);
    },
    onError: (error) => {
      toast.error('Failed to load collections: ' + (error as Error).message);
    }
  });

  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.createCollection(currentUser.uid, { name, description });
    },
    onSuccess: (data) => {
      setCollections(prev => [...prev, data]);
      toast.success('Collection created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create collection: ' + (error as Error).message);
    }
  });

  // Add to collection mutation
  const addToCollectionMutation = useMutation({
    mutationFn: async ({ collectionId, resourceId }: { collectionId: string; resourceId: string }) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.addResourceToCollection(currentUser.uid, collectionId, resourceId);
    },
    onSuccess: (_, { collectionId, resourceId }) => {
      setCollections(prev => 
        prev.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              resourceIds: [...collection.resourceIds, resourceId],
              dateUpdated: new Date().toISOString()
            };
          }
          return collection;
        })
      );
      toast.success('Resource added to collection!');
    },
    onError: (error) => {
      toast.error('Failed to add resource to collection: ' + (error as Error).message);
    }
  });

  // Remove from collection mutation
  const removeFromCollectionMutation = useMutation({
    mutationFn: async ({ collectionId, resourceId }: { collectionId: string; resourceId: string }) => {
      if (!currentUser) throw new Error('User not authenticated');
      return resourceAPI.removeResourceFromCollection(currentUser.uid, collectionId, resourceId);
    },
    onSuccess: (_, { collectionId, resourceId }) => {
      setCollections(prev => 
        prev.map(collection => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              resourceIds: collection.resourceIds.filter(id => id !== resourceId),
              dateUpdated: new Date().toISOString()
            };
          }
          return collection;
        })
      );
      toast.success('Resource removed from collection!');
    },
    onError: (error) => {
      toast.error('Failed to remove resource from collection: ' + (error as Error).message);
    }
  });

  // Load comments mutation
  const loadCommentsMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return commentAPI.getResourceComments(resourceId);
    },
    onSuccess: (data) => {
      setComments(data);
    },
    onError: (error) => {
      toast.error('Failed to load comments: ' + (error as Error).message);
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ resourceId, content, parentId }: { resourceId: string; content: string; parentId?: string }) => {
      if (!currentUser) throw new Error('User not authenticated');
      return commentAPI.addComment(resourceId, currentUser.uid, content, parentId);
    },
    onSuccess: (newComment) => {
      setComments(prev => [...prev, newComment]);
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add comment: ' + (error as Error).message);
    }
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      return commentAPI.updateComment(commentId, content);
    },
    onSuccess: (updatedComment) => {
      setComments(prev => 
        prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
      toast.success('Comment updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update comment: ' + (error as Error).message);
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return commentAPI.deleteComment(commentId, currentUser.uid);
    },
    onSuccess: (_, commentId) => {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete comment: ' + (error as Error).message);
    }
  });

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return commentAPI.likeComment(commentId, currentUser.uid);
    },
    onSuccess: (data, commentId) => {
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: data.likes } 
            : comment
        )
      );
    },
    onError: (error) => {
      toast.error('Failed to like comment: ' + (error as Error).message);
    }
  });

  // Load notifications mutation
  const loadNotificationsMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return userAPI.getUserNotifications(userId);
    },
    onSuccess: (data) => {
      setNotifications(data);
    },
    onError: (error) => {
      console.error('Failed to load notifications:', error);
    }
  });

  // Mark notification as read mutation
  const markNotificationAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return notificationAPI.markNotificationAsRead(notificationId, currentUser.uid);
    },
    onSuccess: (_, notificationId) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read: ' + (error as Error).message);
    }
  });

  // Mark all notifications as read mutation
  const markAllNotificationsAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error('User not authenticated');
      return notificationAPI.markAllNotificationsAsRead(currentUser.uid);
    },
    onSuccess: () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    },
    onError: (error) => {
      toast.error('Failed to mark all notifications as read: ' + (error as Error).message);
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!currentUser) throw new Error('User not authenticated');
      return notificationAPI.deleteNotification(notificationId, currentUser.uid);
    },
    onSuccess: (_, notificationId) => {
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
      toast.success('Notification deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete notification: ' + (error as Error).message);
    }
  });

  // Advanced search function
  const advancedSearch = async (params: {
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
  }) => {
    try {
      return await resourceAPI.advancedSearch(params);
    } catch (error) {
      toast.error('Search failed: ' + (error as Error).message);
      // Return filtered mock data as fallback with all filters applied
      return mockResources.filter(resource => {
        // Basic search query
        if (params.query) {
          const query = params.query.toLowerCase();
          const matchesQuery = resource.title.toLowerCase().includes(query) ||
                               resource.description.toLowerCase().includes(query) ||
                               resource.tags.some(tag => tag.toLowerCase().includes(query));
          if (!matchesQuery) return false;
        }
        
        // Category filter
        if (params.category && resource.category !== params.category) {
          return false;
        }
        
        // License filter
        if (params.license && resource.license !== params.license) {
          return false;
        }
        
        // Format filter
        if (params.format && resource.format && !resource.format.toLowerCase().includes(params.format.toLowerCase())) {
          return false;
        }
        
        // Date filter - simplified implementation
        if (params.dateAdded) {
          const resourceDate = new Date(resource.dateAdded);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - resourceDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (params.dateAdded === 'week' && diffDays > 7) return false;
          if (params.dateAdded === 'month' && diffDays > 30) return false;
          if (params.dateAdded === 'year' && diffDays > 365) return false;
        }
        
        // File size filter
        if (resource.fileSize) {
          // Extract numeric value from fileSize (e.g., "45 MB" -> 45)
          const sizeMatch = resource.fileSize.match(/(\d+(\.\d+)?)/);
          if (sizeMatch) {
            const sizeValue = parseFloat(sizeMatch[1]);
            
            if (params.minFileSize && sizeValue < parseFloat(params.minFileSize)) {
              return false;
            }
            
            if (params.maxFileSize && sizeValue > parseFloat(params.maxFileSize)) {
              return false;
            }
          }
        }
        
        // Colors filter - check if resource colors include any of the selected colors
        if (params.colors && resource.colors) {
          const selectedColors = params.colors.split(',');
          const hasColor = selectedColors.some(color => 
            resource.colors?.some(resourceColor => 
              resourceColor.toLowerCase().includes(color.toLowerCase())
            )
          );
          if (!hasColor) return false;
        }
        
        return true;
      });
    }
  };

  const addResource = (newResource: Omit<Resource, 'id' | 'downloads' | 'likes' | 'author' | 'dateAdded'>) => {
    const resource: Resource = {
      ...newResource,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      downloads: 0,
      likes: 0,
      author: currentUser?.displayName || currentUser?.email || 'Anonymous',
      dateAdded: new Date().toISOString().split('T')[0],
      tags: newResource.tags || []
    };
    
    // In a real app, this would be an API call
    // For demo purposes, we'll just return the resource
    // The actual state management is handled by React Query
    return resource;
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getResourceById = (id: string) => resources.find(resource => resource.id === id);

  const toggleLike = (id: string) => {
    toggleLikeMutation.mutate(id);
  };

  const addDownload = (id: string) => {
    addDownloadMutation.mutate(id);
  };

  // Functions for collections functionality
  const loadCollections = () => {
    if (currentUser) {
      loadCollectionsMutation.mutate(currentUser.uid);
    }
  };

  const createCollection = async (name: string, description?: string) => {
    return createCollectionMutation.mutateAsync({ name, description });
  };

  const addToCollection = async (collectionId: string, resourceId: string) => {
    return addToCollectionMutation.mutateAsync({ collectionId, resourceId });
  };

  const removeFromCollection = async (collectionId: string, resourceId: string) => {
    return removeFromCollectionMutation.mutateAsync({ collectionId, resourceId });
  };

  const isResourceInCollection = (resourceId: string) => {
    return collections.some(collection => 
      collection.resourceIds.includes(resourceId)
    );
  };

  const getCollectionByResourceId = (resourceId: string) => {
    return collections.find(collection => 
      collection.resourceIds.includes(resourceId)
    );
  };

  // Comments functions
  const loadComments = (resourceId: string) => {
    loadCommentsMutation.mutate(resourceId);
  };

  const addComment = async (resourceId: string, content: string, parentId?: string) => {
    return addCommentMutation.mutateAsync({ resourceId, content, parentId });
  };

  const updateComment = async (commentId: string, content: string) => {
    return updateCommentMutation.mutateAsync({ commentId, content });
  };

  const deleteComment = async (commentId: string) => {
    return deleteCommentMutation.mutateAsync(commentId);
  };

  const likeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const getCommentsForResource = (resourceId: string) => {
    return comments.filter(comment => comment.resourceId === resourceId);
  };

  // Notifications functions
  const loadNotifications = () => {
    if (currentUser) {
      loadNotificationsMutation.mutate(currentUser.uid);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    return markNotificationAsReadMutation.mutateAsync(notificationId);
  };

  const markAllNotificationsAsRead = async () => {
    return markAllNotificationsAsReadMutation.mutateAsync();
  };

  const deleteNotification = async (notificationId: string) => {
    return deleteNotificationMutation.mutateAsync(notificationId);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <ResourcesContext.Provider value={{
      resources,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      filteredResources,
      getResourceById,
      toggleLike,
      likedResources,
      downloadedResources,
      addDownload,
      addResource,
      isLoading,
      isError,
      advancedSearch,
      rateResource: (id: string, rating: number) => rateResourceMutation.mutate({ id, rating }),
      userRatings,
      setUserRating: (id: string, rating: number) => setUserRatings(prev => ({ ...prev, [id]: rating })),
      getUserRating: (id: string) => userRatings[id],
      collections,
      loadCollections,
      createCollection,
      addToCollection,
      removeFromCollection,
      isResourceInCollection,
      getCollectionByResourceId,
      comments,
      loadComments,
      addComment,
      updateComment,
      deleteComment,
      likeComment,
      getCommentsForResource,
      notifications,
      loadNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      unreadNotificationsCount
    }}>
      {children}
    </ResourcesContext.Provider>
  );
}