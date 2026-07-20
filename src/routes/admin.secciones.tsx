import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
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

  const sortedSections = sections?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

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

        {/* Secciones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSections?.map((section: any) => (
            <Card key={section._id}>
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
                {section.order !== undefined && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-accent rounded-full tracking-wide">
                      Orden: {section.order}
                    </span>
                  </div>
                )}
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

        {sortedSections?.length === 0 && (
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
          <div className="bg-card rounded-lg border border-border max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold tracking-widest mb-6 font-italianno">
              {editingSection ? "Editar sección" : "Nueva sección"}
            </h2>
            <SectionForm
              section={editingSection}
              onClose={handleFormClose}
              onSave={handleSave}
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
}: {
  section: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: {
      name: section?.name || "",
      description: section?.description || "",
      order: section?.order || 0,
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

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field
        name="order"
        validators={{
          onChange: ({ value }) =>
            value === "" || Number(value) < 0
              ? "El orden debe ser un número positivo"
              : undefined,
        }}
      >
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
              {isSubmitting ? "Guardando..." : section ? "Actualizar" : "Crear"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
