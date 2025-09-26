import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useResources } from "@/hooks/useResources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { ArrowLeft, Upload, Image } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UploadResource() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [license, setLicense] = useState<"free" | "commercial" | "premium">("free");
  const [format, setFormat] = useState("");
  
  const { currentUser } = useAuth();
  const { addResource } = useResources();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      
      // Create preview for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
      
      // Auto-detect format from file extension
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith('.png')) setFormat('PNG');
      else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) setFormat('JPG');
      else if (fileName.endsWith('.svg')) setFormat('SVG');
      else if (fileName.endsWith('.pdf')) setFormat('PDF');
      else if (fileName.endsWith('.psd')) setFormat('PSD');
      else if (fileName.endsWith('.ai')) setFormat('AI');
      else if (fileName.endsWith('.fig')) setFormat('Figma');
      else if (fileName.endsWith('.sketch')) setFormat('Sketch');
      else if (fileName.endsWith('.xd')) setFormat('XD');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Please log in to upload resources");
      navigate('/auth/login');
      return;
    }
    
    if (!title || !description || !category || !file) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create resource object
      const newResource = {
        title,
        description,
        image: preview || '/placeholder.svg',
        category,
        isPremium,
        fileSize: formatFileSize(file!.size),
        format,
        license,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      // Add resource to context
      addResource(newResource);
      
      toast.success("Resource uploaded successfully!");
      navigate('/profile');
    } catch (error) {
      toast.error("Failed to upload resource");
      console.error(error);
    }
    
    setIsUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6 glass-card border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Upload a Resource</h1>
              <p className="text-muted-foreground">
                Share your design resources with the community
              </p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Resource Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-lg font-medium mb-3 block">Preview</Label>
                  <Card className="glass-card border-white/20 h-64 flex items-center justify-center">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Image className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No preview available</p>
                      </div>
                    )}
                  </Card>
                </div>
                
                {/* File Upload */}
                <div>
                  <Label className="text-lg font-medium mb-3 block">Upload File</Label>
                  <Card className="glass-card border-white/20 p-6">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                      <Input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.psd,.ai,.sketch,.fig,.xd"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="font-medium mb-1">Click to upload</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          PNG, JPG, SVG, PDF, PSD, AI up to 100MB
                        </p>
                        {file && (
                          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </Card>
                </div>
              </div>
              
              {/* Resource Details */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-lg font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter resource title"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-lg font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your resource in detail"
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-lg font-medium">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fonts">Fonts</SelectItem>
                        <SelectItem value="templates">Templates</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="icons">Icons</SelectItem>
                        <SelectItem value="ui-kits">UI Kits</SelectItem>
                        <SelectItem value="graphics">Graphics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="license" className="text-lg font-medium">License *</Label>
                    <Select value={license} onValueChange={(value: "free" | "commercial" | "premium") => setLicense(value)} required>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="format" className="text-lg font-medium">Format</Label>
                    <Input
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      placeholder="e.g., PNG, JPG, SVG"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags" className="text-lg font-medium">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter tags separated by commas"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="premium" className="text-lg font-medium">
                    Premium Resource
                  </Label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-gradient-primary hover:bg-gradient-secondary py-3 text-lg flex-1"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Resource
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="glass-card border-white/20 hover:bg-white/10 py-3 text-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}