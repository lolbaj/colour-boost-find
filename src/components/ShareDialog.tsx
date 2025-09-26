import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link,
  Globe
} from 'lucide-react';
import { toast } from "@/lib/toast";

interface ShareDialogProps {
  title: string;
  url: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ title, url, description, isOpen, onClose }: ShareDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description || title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(description || title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || '')}%20${encodeURIComponent(url)}`
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Resource</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Social sharing options */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center gap-2"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="flex items-center justify-center gap-2"
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleShare('email')}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
          </div>

          {/* Direct link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Copy Link</span>
              <Badge variant="secondary" className="text-xs">Direct Link</Badge>
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={url} 
                readOnly 
                className="text-sm"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyLink}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Copy button with icon */}
          <Button 
            className="w-full"
            variant="outline"
            onClick={handleCopyLink}
          >
            <Link className="h-4 w-4 mr-2" />
            Copy Direct Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}