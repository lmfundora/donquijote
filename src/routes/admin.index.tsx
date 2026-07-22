import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { ProductCard } from "#/components/admin/ProductCard";
import { SearchAndFilters } from "#/components/admin/SearchAndFilters";
import { ProductForm } from "#/components/admin/ProductForm";

export const Route = createFileRoute("/admin/")({
  component: ProductosPage,
});

function ProductosPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSection, setFilterSection] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterPriceMin, setFilterPriceMin] = useState<number | undefined>(
    undefined,
  );
  const [filterPriceMax, setFilterPriceMax] = useState<number | undefined>(
    undefined,
  );
  const [showFilters, setShowFilters] = useState(false);

  const products = useConvexQuery(api.products.list, {});
  const sections = useConvexQuery(api.sections.list, {});
  const categories = useConvexQuery(api.categories.list, {});
  const createProduct = useConvexMutation(api.products.create);
  const updateProduct = useConvexMutation(api.products.update);
  const removeProduct = useConvexMutation(api.products.remove);
  const generateUploadUrl = useConvexMutation(api.products.generateUploadUrl);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-100" />
      </div>
    );
  }

  if (!session?.user) {
    router.navigate({ to: "/login" });
    return null;
  }

  const handleDelete = async (id: any) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await removeProduct({ id });
        toast.success("Producto eliminado");
      } catch (error) {
        toast.error("Error al eliminar producto");
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...data });
        toast.success("Producto actualizado");
      } else {
        await createProduct(data);
        toast.success("Producto creado");
      }
      handleFormClose();
    } catch (error) {
      toast.error("Error al guardar producto");
    }
  };

  const getSectionName = (sectionId: string) => {
    const section = sections?.find((s: any) => s._id === sectionId);
    return section?.name || "Sin sección";
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Sin categoría";
    const category = categories?.find((c: any) => c._id === categoryId);
    return category?.name || "Sin categoría";
  };

  const filteredProducts = products?.filter((product: any) => {
    // Filtro por nombre
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Filtro por sección
    if (filterSection && product.sectionId !== filterSection) {
      return false;
    }
    // Filtro por categoría
    if (filterCategory && product.categoryId !== filterCategory) {
      return false;
    }
    // Filtro por precio mínimo
    if (filterPriceMin !== undefined && product.price < filterPriceMin) {
      return false;
    }
    // Filtro por precio máximo
    if (filterPriceMax !== undefined && product.price > filterPriceMax) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilterSection("");
    setFilterCategory("");
    setFilterPriceMin(undefined);
    setFilterPriceMax(undefined);
  };

  const hasActiveFilters =
    filterSection ||
    filterCategory ||
    filterPriceMin !== undefined ||
    filterPriceMax !== undefined;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header with Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-widest font-sans">
              Productos
            </h1>
            <Button onClick={() => setShowForm(true)}>
              <Plus size={20} />
              Nuevo producto
            </Button>
          </div>

          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onFiltersChange={setShowFilters}
            filterSection={filterSection}
            onFilterSectionChange={setFilterSection}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            filterPriceMin={filterPriceMin}
            onFilterPriceMinChange={setFilterPriceMin}
            filterPriceMax={filterPriceMax}
            onFilterPriceMaxChange={setFilterPriceMax}
            sections={sections || []}
            categories={categories || []}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            getSectionName={getSectionName}
            getCategoryName={getCategoryName}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts?.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              getSectionName={getSectionName}
              getCategoryName={getCategoryName}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground tracking-wide">
              {hasActiveFilters || searchQuery
                ? "No se encontraron productos con los filtros aplicados"
                : "No hay productos creados aún"}
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-widest font-italianno">
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            sections={sections || []}
            categories={categories || []}
            onSave={handleSave}
            onCancel={handleFormClose}
            generateUploadUrl={generateUploadUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
