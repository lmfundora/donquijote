import { Card, CardTitle } from "#/components/ui/card";
import { Button } from "#/components/ui/button";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: any;
  getSectionName: (sectionId: string) => string;
  getCategoryName: (categoryId: string | null) => string;
  onEdit: (product: any) => void;
  onDelete: (id: any) => void;
}

export function ProductCard({
  product,
  getSectionName,
  getCategoryName,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const shouldShowExpandButton = product.description && product.description.length > 80;

  return (
    <Card className="pt-0 flex flex-col hover:shadow-md transition-shadow duration-300">
      {product.imageUrl && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        {/* Product Name */}
        <CardTitle className="text-base font-semibold tracking-wide mb-1 line-clamp-1">
          {product.name}
        </CardTitle>

        {/* Description */}
        {product.description && (
          <div className="mb-3">
            <p
              className={`text-sm text-muted-foreground ${
                isDescriptionExpanded ? "" : "line-clamp-2"
              }`}
            >
              {product.description}
            </p>
            {shouldShowExpandButton && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
              >
                {isDescriptionExpanded ? (
                  <>
                    Ver menos
                    <ChevronUp size={12} />
                  </>
                ) : (
                  <>
                    Ver más
                    <ChevronDown size={12} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Price - Prominent */}
        <div className="mb-3">
          <span className="text-xl font-bold tracking-wide text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-accent rounded-md tracking-wide font-medium">
            {getSectionName(product.sectionId)}
          </span>
          {product.categoryId && (
            <span className="text-xs px-2 py-1 bg-muted rounded-md tracking-wide">
              {getCategoryName(product.categoryId)}
            </span>
          )}
        </div>

        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <div className="mb-3">
            <span className="text-xs text-muted-foreground tracking-wide line-clamp-1">
              Alérgenos: {product.allergens.join(", ")}
            </span>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-border my-3" />

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit size={14} className="mr-1" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product._id)}
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} className="mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}
