import { useParams, useSearchParams } from "react-router-dom";
import { useResources } from "@/hooks/useResources";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResourceCard from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Grid3X3, List, Loader2, X, AlertCircle, Filter } from "lucide-react";
import AdvancedFilters from "@/components/AdvancedFilters";

type SortByType = 'newest' | 'popular' | 'downloads' | 'rating' | 'a-z' | 'z-a';

export default function SearchResults() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { 
    filteredResources, 
    setSearchQuery, 
    setSelectedCategory,
    searchQuery,
    selectedCategory,
    isLoading,
    isError,
    advancedSearch
  } = useResources();
  
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'downloads' | 'rating' | 'a-z' | 'z-a'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // New advanced filter states
  const [advancedFilters, setAdvancedFilters] = useState({
    license: undefined as string | undefined,
    format: undefined as string | undefined,
    dateAdded: undefined as string | undefined,
    sortBy: undefined as string | undefined,
    sortOrder: 'desc' as 'asc' | 'desc',
    minFileSize: undefined as string | undefined,
    maxFileSize: undefined as string | undefined,
    colors: [] as string[]
  });
  
  const [searchResults, setSearchResults] = useState(filteredResources);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setSearchQuery(query);
    setSelectedCategory(category || '');
    setSearchResults(filteredResources);
  }, [query, category, setSearchQuery, setSelectedCategory, filteredResources]);

  const handleAdvancedSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      // Prepare the search parameters
      const searchParams = {
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        license: advancedFilters.license,
        format: advancedFilters.format,
        dateAdded: advancedFilters.dateAdded,
        sortBy: advancedFilters.sortBy || mapSortBy(),
        sortOrder: advancedFilters.sortOrder,
        minFileSize: advancedFilters.minFileSize,
        maxFileSize: advancedFilters.maxFileSize,
        colors: advancedFilters.colors.length > 0 ? advancedFilters.colors.join(',') : undefined
      };

      // If any filter is applied, use advanced search API
      const hasFilters = Object.values(searchParams).some(value => value !== undefined);
      
      if (hasFilters) {
        const results = await advancedSearch(searchParams);
        setSearchResults(results);
      } else {
        // If no filters, use the filtered resources from context
        setSearchResults(filteredResources);
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedCategory, advancedFilters, advancedSearch, filteredResources, setSearchResults, mapSortBy]);

  // Map the old sortBy to the new format
  const mapSortBy = useCallback(() => {
    switch (sortBy) {
      case 'popular': return 'popular';
      case 'downloads': return 'downloads';
      case 'rating': return 'rating';
      case 'a-z': return 'a-z';
      case 'z-a': return 'z-a';
      case 'newest':
      default: return 'newest';
    }
  }, [sortBy]);

  const clearFilters = () => {
    setAdvancedFilters({
      license: undefined,
      format: undefined,
      dateAdded: undefined,
      sortBy: undefined,
      sortOrder: 'desc',
      minFileSize: undefined,
      maxFileSize: undefined,
      colors: []
    });
    setSearchQuery('');
    setSelectedCategory('');
  };

  const sortedResources = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'downloads':
        return b.downloads - a.downloads;
      case 'newest':
      default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  const getPageTitle = () => {
    if (category) {
      return `${category} Resources`;
    }
    if (query) {
      return `Search results for "${query}"`;
    }
    return 'All Resources';
  };

  const getResultsCount = () => {
    return `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'}`;
  };

  // Apply filters when they change
  useEffect(() => {
    handleAdvancedSearch();
  }, [handleAdvancedSearch]);

  if (isLoading || isSearching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 sm:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center py-16">
              <div className="glass-card p-6 sm:p-12 rounded-2xl max-w-md mx-auto">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Using Demo Data</h3>
                <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                  We couldn't connect to the API server, so we're showing demo data instead.
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-primary"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="gradient-text">{getPageTitle()}</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <p className="text-muted-foreground text-sm sm:text-base">
                {getResultsCount()} found
              </p>
              
              {/* Current Filters - Scrollable on mobile */}
              <div className="flex items-center gap-2 flex-wrap max-w-full overflow-x-auto pb-1 hide-scrollbar">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    Query: {searchQuery}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    Category: {selectedCategory}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setSelectedCategory('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {advancedFilters.license && (
                  <Badge variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    License: {advancedFilters.license}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setAdvancedFilters({...advancedFilters, license: undefined})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {advancedFilters.format && (
                  <Badge variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    Format: {advancedFilters.format}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setAdvancedFilters({...advancedFilters, format: undefined})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {advancedFilters.dateAdded && (
                  <Badge variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    Date: {advancedFilters.dateAdded}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setAdvancedFilters({...advancedFilters, dateAdded: undefined})}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {advancedFilters.colors.map((color) => (
                  <Badge key={color} variant="secondary" className="bg-muted/20 flex items-center gap-1 flex-shrink-0">
                    Color: {color}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto w-auto"
                      onClick={() => setAdvancedFilters({
                        ...advancedFilters, 
                        colors: advancedFilters.colors.filter(c => c !== color)
                      })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Controls - Stacked on mobile */}
          <div className="glass-card p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="glass-card border-white/20 hover:bg-white/10"
                >
                  <Filter className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
                
                <Select value={sortBy} onValueChange={(value: SortByType) => setSortBy(value)}>                  <SelectTrigger className="w-32 sm:w-40 glass-card border-white/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gradient-primary' : 'glass-card border-white/20 hover:bg-white/10'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gradient-primary' : 'glass-card border-white/20 hover:bg-white/10'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters - Collapsible on mobile */}
            {showFilters && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 animate-slide-up">
                <AdvancedFilters 
                  filters={advancedFilters} 
                  onFiltersChange={setAdvancedFilters}
                  onReset={clearFilters}
                />
              </div>
            )}
          </div>

          {/* Results */}
          {sortedResources.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="glass-card p-6 sm:p-12 rounded-2xl max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">No results found</h3>
                <p className="text-muted-foreground mb-5 sm:mb-6 text-sm sm:text-base">
                  Try adjusting your search terms or filters
                </p>
                <Button 
                  onClick={clearFilters}
                  className="bg-gradient-primary"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8' 
                : 'space-y-4 sm:space-y-6'
            }`}>
              {sortedResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ResourceCard {...resource} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}