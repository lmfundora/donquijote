import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { optimizeImage } from "#/lib/image-utils";
import { Button } from "#/components/ui/button";
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
import { Upload, X } from "lucide-react";

interface ProductFormProps {
  product: any;
  sections: any[];
  categories: any[];
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  generateUploadUrl: any;
}

export function ProductForm({
  product,
  sections,
  categories,
  onSave,
  onCancel,
  generateUploadUrl,
}: ProductFormProps) {
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

      <form.Field
        name="categoryId"
        validators={{
          onChange: ({ value }) =>
            !value ? "La categoría es requerida" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
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
              onClick={onCancel}
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
