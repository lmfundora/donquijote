import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Search, Filter, X as Close } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onFiltersChange: (show: boolean) => void;
  filterSection: string;
  onFilterSectionChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterPriceMin: number | undefined;
  onFilterPriceMinChange: (value: number | undefined) => void;
  filterPriceMax: number | undefined;
  onFilterPriceMaxChange: (value: number | undefined) => void;
  sections: any[];
  categories: any[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  getSectionName: (sectionId: string) => string;
  getCategoryName: (categoryId: string | null) => string;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  showFilters,
  onFiltersChange,
  filterSection,
  onFilterSectionChange,
  filterCategory,
  onFilterCategoryChange,
  filterPriceMin,
  onFilterPriceMinChange,
  filterPriceMax,
  onFilterPriceMaxChange,
  sections,
  categories,
  hasActiveFilters,
  onClearFilters,
  getSectionName,
  getCategoryName,
}: SearchAndFiltersProps) {
  return (
    <>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3">
        <Popover open={showFilters} onOpenChange={onFiltersChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filtros
              {hasActiveFilters && (
                <span className="h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold tracking-wide font-sans">Filtros</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={onClearFilters}>
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Section Filter */}
              <div className="space-y-2">
                <Label>Sección</Label>
                <Select value={filterSection} onValueChange={onFilterSectionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las secciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las secciones</SelectItem>
                    {sections?.map((section: any) => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories?.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <Label>Rango de precio</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filterPriceMin || ""}
                    onChange={(e) => onFilterPriceMinChange(e.target.value && Number(e.target.value) > 0 ? Number(e.target.value) : undefined)}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filterPriceMax || ""}
                    onChange={(e) => onFilterPriceMaxChange(e.target.value && Number(e.target.value) > 0 ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filterSection && (
              <span className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1">
                {getSectionName(filterSection)}
                <button onClick={() => onFilterSectionChange("")} className="hover:text-destructive">
                  <Close size={12} />
                </button>
              </span>
            )}
            {filterCategory && (
              <span className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1">
                {getCategoryName(filterCategory)}
                <button onClick={() => onFilterCategoryChange("")} className="hover:text-destructive">
                  <Close size={12} />
                </button>
              </span>
            )}
            {(filterPriceMin !== undefined || filterPriceMax !== undefined) && (
              <span className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1">
                ${filterPriceMin || "0"} - ${filterPriceMax || "∞"}
                <button onClick={() => { onFilterPriceMinChange(undefined); onFilterPriceMaxChange(undefined); }} className="hover:text-destructive">
                  <Close size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
