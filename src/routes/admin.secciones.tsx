import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
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

export const Route = createFileRoute("/admin/secciones")({
  component: SeccionesPage,
});

function SeccionesPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  const sections = useConvexQuery(api.sections.list, {});
  const createSection = useConvexMutation(api.sections.create);
  const updateSection = useConvexMutation(api.sections.update);
  const removeSection = useConvexMutation(api.sections.remove);
  const generateUploadUrl = useConvexMutation(api.sections.generateUploadUrl);

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
    if (confirm("¿Estás seguro de eliminar esta sección?")) {
      try {
        await removeSection({ id });
        toast.success("Sección eliminada");
      } catch (error) {
        toast.error("Error al eliminar sección");
      }
    }
  };

  const handleEdit = (section: any) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSection(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingSection) {
        await updateSection({ id: editingSection._id, ...data });
        toast.success("Sección actualizada");
      } else {
        await createSection(data);
        toast.success("Sección creada");
      }
      handleFormClose();
    } catch (error) {
      toast.error("Error al guardar sección");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-widest font-sans">
            Secciones
          </h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Nueva sección
          </Button>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections?.map((section: any) => (
            <Card key={section._id} className="pt-0">
              {section.imageUrl && (
                <div className="aspect-video overflow-hidden mb-4 bg-muted">
                  <img
                    src={section.imageUrl}
                    alt={section.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(section)}
                >
                  <Edit size={16} />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(section._id)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {sections?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground tracking-wide">
              No hay secciones creadas aún
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <h2 className="text-xl font-bold tracking-widest mb-6 font-italianno">
              {editingSection ? "Editar sección" : "Nueva sección"}
            </h2>
            <SectionForm
              section={editingSection}
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

function SectionForm({
  section,
  onClose,
  onSave,
  generateUploadUrl,
}: {
  section: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  generateUploadUrl: any;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    section?.imageUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: section?.name || "",
      description: section?.description || "",
      imageUrl: section?.imageUrl || "",
      order: section?.order || 0,
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

      await onSave({ ...value, imageUrl });
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
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setFieldValue("imageUrl", "");
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

      <form.Field name="imageUrl">
        {() => (
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
                  className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
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
          </div>
        )}
      </form.Field>

      <form.Field name="order">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="order">Orden</Label>
            <Input
              id="order"
              name={field.name}
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            />
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
                  : section
                    ? "Actualizar"
                    : "Crear"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
