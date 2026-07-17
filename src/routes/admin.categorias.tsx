import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriasPage,
});

function CategoriasPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const categories = useConvexQuery(api.categories.list, {});
  const createCategory = useConvexMutation(api.categories.create);
  const updateCategory = useConvexMutation(api.categories.update);
  const removeCategory = useConvexMutation(api.categories.remove);

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
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        await removeCategory({ id });
        toast.success("Categoría eliminada");
      } catch (error) {
        toast.error("Error al eliminar categoría");
      }
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, ...data });
        toast.success("Categoría actualizada");
      } else {
        await createCategory(data);
        toast.success("Categoría creada");
      }
      handleFormClose();
    } catch (error) {
      toast.error("Error al guardar categoría");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-widest font-sans">
            Categorías
          </h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Nueva categoría
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category: any) => (
            <Card key={category._id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex gap-2 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(category)}
                >
                  <Edit size={16} />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category._id)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {categories?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground tracking-wide">
              No hay categorías creadas aún
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6">
            <h2 className="text-xl font-bold tracking-widest mb-6 font-italianno">
              {editingCategory ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <CategoryForm
              category={editingCategory}
              onClose={handleFormClose}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: {
      name: category?.name || "",
    },
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

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

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? "Guardando..."
                : category
                  ? "Actualizar"
                  : "Crear"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
