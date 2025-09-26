import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  Filter,
  Calendar,
  Palette,
  FileText,
  X
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdvancedFiltersProps {
  filters: {
    license?: string;
    format?: string;
    dateAdded?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minFileSize?: string;
    maxFileSize?: string;
    colors?: string[];
  };
  onFiltersChange: (filters: {
    license?: string;
    format?: string;
    dateAdded?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minFileSize?: string;
    maxFileSize?: string;
    colors?: string[];
  }) => void;
  onReset: () => void;
}

export default function AdvancedFilters({ filters, onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [colorInput, setColorInput] = useState('');

  const licenses = ['free', 'premium', 'commercial'];
  const formats = ['JPG', 'PNG', 'SVG', 'PDF', 'PSD', 'AI', 'Figma', 'XD', 'TTF', 'OTF'];
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' }
  ];

  const handleColorAdd = () => {
    if (colorInput.trim() && !filters.colors?.includes(colorInput.trim())) {
      const newColors = [...(filters.colors || []), colorInput.trim()];
      onFiltersChange({ ...filters, colors: newColors });
      setColorInput('');
    }
  };

  const handleColorRemove = (colorToRemove: string) => {
    const newColors = (filters.colors || []).filter(color => color !== colorToRemove);
    onFiltersChange({ ...filters, colors: newColors });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Filters
        </h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* License Filter */}
        <div className="space-y-2">
          <Label>License</Label>
          <Select 
            value={filters.license} 
            onValueChange={(value) => onFiltersChange({ ...filters, license: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Licenses" />
            </SelectTrigger>
            <SelectContent>
              {licenses.map(license => (
                <SelectItem key={license} value={license}>
                  {license.charAt(0).toUpperCase() + license.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format Filter */}
        <div className="space-y-2">
          <Label>Format</Label>
          <Select 
            value={filters.format} 
            onValueChange={(value) => onFiltersChange({ ...filters, format: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Formats" />
            </SelectTrigger>
            <SelectContent>
              {formats.map(format => (
                <SelectItem key={format} value={format.toLowerCase()}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => onFiltersChange({ 
              ...filters, 
              sortBy: value,
              sortOrder: value === 'oldest' ? 'asc' : 'desc'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Added */}
        <div className="space-y-2">
          <Label>Date Added</Label>
          <Input
            type="month"
            value={filters.dateAdded || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateAdded: e.target.value })}
            placeholder="Select month"
          />
        </div>

        {/* File Size Range */}
        <div className="space-y-2">
          <Label>File Size (MB)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minFileSize || ''}
              onChange={(e) => onFiltersChange({ ...filters, minFileSize: e.target.value })}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxFileSize || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxFileSize: e.target.value })}
              className="w-full"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add color..."
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleColorAdd()}
            />
            <Button type="button" onClick={handleColorAdd} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(filters.colors || []).map((color) => (
              <Badge key={color} variant="secondary" className="flex items-center gap-1">
                {color}
                <button 
                  type="button" 
                  onClick={() => handleColorRemove(color)}
                  className="ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}