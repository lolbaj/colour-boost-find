import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useResources } from '@/hooks/useResources';

interface CollectionsSheetProps {
  resourceId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CollectionsSheet({ resourceId, title, isOpen, onClose }: CollectionsSheetProps) {
  const { collections, loadCollections, createCollection, addToCollection, isResourceInCollection } = useResources();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Load collections when the dialog opens
  useEffect(() => {
    if (isOpen) {
      loadCollections();
    }
  }, [isOpen, loadCollections]);

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    
    setIsCreating(true);
    try {
      await createCollection(newCollectionName.trim());
      setNewCollectionName('');
    } catch (error) {
      console.error('Failed to create collection:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addToCollection(collectionId, resourceId);
      onClose();
    } catch (error) {
      console.error('Failed to add to collection:', error);
    }
  };

  const isInAnyCollection = isResourceInCollection(resourceId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Create new collection */}
          <div className="flex gap-2">
            <Input
              placeholder="New collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
            />
            <Button 
              size="sm" 
              onClick={handleCreateCollection}
              disabled={isCreating || !newCollectionName.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Existing collections */}
          <div>
            <h3 className="text-sm font-medium mb-2">Your Collections</h3>
            {collections.length === 0 ? (
              <p className="text-sm text-muted-foreground">No collections yet. Create one above.</p>
            ) : (
              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {collections.map((collection) => {
                    const isInCollection = collection.resourceIds.includes(resourceId);
                    return (
                      <div 
                        key={collection.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{collection.name}</h4>
                          {collection.description && (
                            <p className="text-xs text-muted-foreground truncate">{collection.description}</p>
                          )}
                        </div>
                        
                        {isInCollection ? (
                          <Badge variant="secondary">Added</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCollection(collection.id)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Current status */}
          {isInAnyCollection && (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <span className="text-sm">✓ This resource is in a collection</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}