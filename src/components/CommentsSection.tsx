import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Reply, 
  ThumbsUp, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  X 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useResources } from '@/hooks/useResources';
import { Comment } from '@/types/resources';
import { toast } from "@/lib/toast";

interface CommentsSectionProps {
  resourceId: string;
  title: string;
}

export function CommentsSection({ resourceId, title }: CommentsSectionProps) {
  const { currentUser } = useAuth();
  const { 
    comments, 
    addComment, 
    likeComment, 
    deleteComment,
    updateComment
  } = useResources();
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const filteredComments = comments.filter(comment => comment.resourceId === resourceId);
  
  // Group top-level comments and their replies
  const topLevelComments = filteredComments.filter(comment => !comment.parentId);
  const repliesMap: Record<string, Comment[]> = {};
  
  filteredComments.forEach(comment => {
    if (comment.parentId) {
      if (!repliesMap[comment.parentId]) {
        repliesMap[comment.parentId] = [];
      }
      repliesMap[comment.parentId].push(comment);
    }
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    if (!currentUser) {
      toast.error('Please log in to comment');
      return;
    }
    
    await addComment(resourceId, newComment.trim());
    setNewComment('');
  };

  const handleReply = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Please log in to reply');
      return;
    }
    
    const replyContent = (document.getElementById(`reply-${commentId}`) as HTMLInputElement)?.value;
    if (!replyContent?.trim()) return;
    
    await addComment(resourceId, replyContent.trim(), commentId);
    (document.getElementById(`reply-${commentId}`) as HTMLInputElement).value = '';
    setReplyingTo(null);
  };

  const handleLike = (commentId: string) => {
    if (!currentUser) {
      toast.error('Please log in to like comments');
      return;
    }
    
    likeComment(commentId);
  };

  const handleDelete = async (commentId: string) => {
    if (!currentUser) {
      toast.error('Please log in to delete comments');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  const handleStartEdit = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    await updateComment(commentId, editContent.trim());
    setEditingCommentId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Comments ({filteredComments.length})
        </h3>
      </div>
      
      {/* Add new comment */}
      <div className="space-y-4">
        {currentUser ? (
          <div className="flex gap-3">
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts about this resource..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />
            </div>
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Comment
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            <a 
              href="/auth/login" 
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // Navigate to login using React Router
                window.location.href = '/auth/login';
              }}
            >
              Log in
            </a> to comment on this resource.
          </p>
        )}
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          topLevelComments.map((comment) => (
            <Card key={comment.id} className="bg-background/50">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium">{comment.author}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.dateAdded)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {currentUser && comment.userId === currentUser.uid && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(comment.id, comment.content)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                {editingCommentId === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingCommentId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mb-3">{comment.content}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => handleLike(comment.id)}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 ${comment.likes > 0 ? 'fill-primary text-primary' : ''}`} />
                    <span>{comment.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    <span>Reply</span>
                  </Button>
                </div>
                
                {/* Reply form */}
                {replyingTo === comment.id && currentUser && (
                  <div className="mt-3 flex gap-2">
                    <Input
                      id={`reply-${comment.id}`}
                      placeholder="Write your reply..."
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                    >
                      Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setReplyingTo(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {/* Replies */}
                {repliesMap[comment.id] && (
                  <div className="mt-4 space-y-4 pl-6 border-l border-muted-foreground/20">
                    {repliesMap[comment.id].map((reply) => (
                      <Card key={reply.id} className="bg-background/30">
                        <CardHeader className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                                {reply.author.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{reply.author}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(reply.dateAdded)}
                                </p>
                              </div>
                            </div>
                            {currentUser && reply.userId === currentUser.uid && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(reply.id, reply.content)}
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(reply.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {editingCommentId === reply.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveEdit(reply.id)}
                                >
                                  Save
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm">{reply.content}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleLike(reply.id)}
                            >
                              <ThumbsUp className={`w-3 h-3 mr-1 ${reply.likes > 0 ? 'fill-primary text-primary' : ''}`} />
                              <span>{reply.likes}</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}