import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Plus, Edit, Trash2, Upload, X, Search, Filter, X as Close } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { optimizeImage } from "#/lib/image-utils";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
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
  const [filterPriceMin, setFilterPriceMin] = useState<number | undefined>(undefined);
  const [filterPriceMax, setFilterPriceMax] = useState<number | undefined>(undefined);
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
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
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

  const hasActiveFilters = filterSection || filterCategory || filterPriceMin !== undefined || filterPriceMax !== undefined;

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
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
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
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpiar
                      </Button>
                    )}
                  </div>

                  {/* Section Filter */}
                  <div className="space-y-2">
                    <Label>Sección</Label>
                    <Select value={filterSection} onValueChange={setFilterSection}>
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
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
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
                        onChange={(e) => setFilterPriceMin(e.target.value && Number(e.target.value) > 0 ? Number(e.target.value) : undefined)}
                      />
                      <Input
                        type="number"
                        placeholder="Máx"
                        value={filterPriceMax || ""}
                        onChange={(e) => setFilterPriceMax(e.target.value && Number(e.target.value) > 0 ? Number(e.target.value) : undefined)}
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
                    <button onClick={() => setFilterSection("")} className="hover:text-destructive">
                      <Close size={12} />
                    </button>
                  </span>
                )}
                {filterCategory && (
                  <span className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1">
                    {getCategoryName(filterCategory)}
                    <button onClick={() => setFilterCategory("")} className="hover:text-destructive">
                      <Close size={12} />
                    </button>
                  </span>
                )}
                {(filterPriceMin !== undefined || filterPriceMax !== undefined) && (
                  <span className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1">
                    ${filterPriceMin || "0"} - ${filterPriceMax || "∞"}
                    <button onClick={() => { setFilterPriceMin(undefined); setFilterPriceMax(undefined); }} className="hover:text-destructive">
                      <Close size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product: any) => (
            <Card key={product._id} className="pt-0">
              {product.imageUrl && (
                <div className="aspect-video overflow-hidden mb-4 bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold tracking-wide">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-accent rounded-full tracking-wide">
                    {getSectionName(product.sectionId)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full tracking-wide">
                    {getCategoryName(product.categoryId)}
                  </span>
                </div>
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground tracking-wide">
                      Alérgenos: {product.allergens.join(", ")}
                    </span>
                  </div>
                )}
              </CardHeader>
              <CardFooter className="flex gap-2 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit size={16} />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
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
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold tracking-widest mb-6 font-italianno">
              {editingProduct ? "Editar producto" : "Nuevo producto"}
            </h2>
            <ProductForm
              product={editingProduct}
              sections={sections || []}
              categories={categories || []}
              onClose={handleFormClose}
              onSave={handleSave}
              generateUploadUrl={generateUploadUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  sections,
  categories,
  onClose,
  onSave,
  generateUploadUrl,
}: {
  product: any;
  sections: any[];
  categories: any[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  generateUploadUrl: any;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [allergenInput, setAllergenInput] = useState("");
  const [allergensList, setAllergensList] = useState<string[]>(
    product?.allergens || [],
  );

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      imageUrl: product?.imageUrl || "",
      price: product?.price || "",
      categoryId: product?.categoryId || "",
      sectionId: product?.sectionId || "",
      allergens: product?.allergens || [],
      slug: product?.slug || "",
    },
    onSubmit: async ({ value }) => {
      let imageUrl = value.imageUrl;

      if (imageFile) {
        setIsUploading(true);
        try {
          const optimizedImage = await optimizeImage(imageFile, {
            maxWidth: 1200,
            quality: 0.8,
            format: "webp",
          });

          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": optimizedImage.type },
            body: optimizedImage,
          });

          if (!response.ok) throw new Error("Error al subir imagen");

          const { storageId } = await response.json();
          imageUrl = storageId;

          toast.success("Imagen subida correctamente");
        } catch (error) {
          toast.error("Error al procesar la imagen");
          console.error(error);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Generar slug si no está definido
      const slug = value.slug || value.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await onSave({ ...value, imageUrl, allergens: allergensList, slug });
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Mostrar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Actualizar el valor del campo en el formulario
      form.setFieldValue("imageUrl", "pending");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setFieldValue("imageUrl", "");
  };

  const handleAddAllergen = () => {
    if (allergenInput.trim()) {
      setAllergensList([...allergensList, allergenInput.trim()]);
      setAllergenInput("");
    }
  };

  const handleRemoveAllergen = (index: number) => {
    setAllergensList(allergensList.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value ? "El nombre es requerido" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="slug">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input
              id="slug"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="se-deja-vacio-para-autogenerar"
            />
            <p className="text-xs text-muted-foreground">
              Si se deja vacío, se generará automáticamente desde el nombre
            </p>
          </div>
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            !value ? "La descripción es requerida" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="price"
        validators={{
          onChange: ({ value }) =>
            !value || value === "" || Number(value) <= 0
              ? "El precio es requerido y debe ser positivo"
              : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name={field.name}
              type="number"
              step="0.01"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="sectionId"
        validators={{
          onChange: ({ value }) =>
            !value ? "La sección es requerida" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="sectionId">Sección</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sección" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section._id} value={section._id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="categoryId">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría (opcional)</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin categoría</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <div className="space-y-2">
        <Label>Alérgenos</Label>
        <div className="flex gap-2">
          <Input
            value={allergenInput}
            onChange={(e) => setAllergenInput(e.target.value)}
            placeholder="Agregar alérgeno"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAllergen();
              }
            }}
          />
          <Button type="button" onClick={handleAddAllergen} variant="outline">
            Agregar
          </Button>
        </div>
        {allergensList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {allergensList.map((allergen, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-accent rounded-full flex items-center gap-1"
              >
                {allergen}
                <button
                  type="button"
                  onClick={() => handleRemoveAllergen(index)}
                  className="hover:text-destructive"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <form.Field
        name="imageUrl"
        validators={{
          onChange: ({ value }) =>
            !value ? "La imagen es requerida" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium tracking-wide font-sans"
            >
              Imagen
            </label>

            {imagePreview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload size={32} className="text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground tracking-wide font-sans">
                    Click para subir imagen
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP (máx. 5MB)
                  </span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors[0]}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || isUploading}
              className="flex-1"
            >
              {isUploading
                ? "Subiendo imagen..."
                : isSubmitting
                  ? "Guardando..."
                  : product
                    ? "Actualizar"
                    : "Crear"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
