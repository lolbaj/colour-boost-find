import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  X,
  Check,
  Square,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useResources } from '@/hooks/useResources';
import { Notification } from '@/types/resources';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <Bell className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <X className="h-4 w-4 text-red-500" />;
    case 'resource_update':
      return <ExternalLink className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
};

const getNotificationClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'border-green-500/20 bg-green-500/5';
    case 'warning':
      return 'border-yellow-500/20 bg-yellow-500/5';
    case 'error':
      return 'border-red-500/20 bg-red-500/5';
    case 'resource_update':
      return 'border-blue-500/20 bg-blue-500/5';
    default:
      return 'border-primary/20 bg-primary/5';
  }
};

export function NotificationDropdown() {
  const { currentUser } = useAuth();
  const { 
    notifications, 
    loadNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification,
    unreadNotificationsCount 
  } = useResources();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications when dropdown opens (if user is logged in)
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && currentUser) {
      loadNotifications();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markNotificationAsRead(notification.id);
    
    // Navigate to resource if available
    if (notification.resourceId) {
      navigate(`/resource/${notification.resourceId}`);
    }
    
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  // Only show notifications for authenticated users
  if (!currentUser) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="glass-card border-white/20 hover:bg-white/10 relative"
        disabled
      >
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="glass-card border-white/20 hover:bg-white/10 relative"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-background">
              {unreadNotificationsCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-hidden p-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer ${!notification.read ? 'bg-accent/20' : ''} ${getNotificationClass(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="pt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {new Date(notification.dateAdded).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t border-white/10 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/profile#notifications')}
            >
              View All
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}