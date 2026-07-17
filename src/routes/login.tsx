import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "#/components/ui/card";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isSignUp] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (isSignUp) {
          const result = await authClient.signUp.email({
            email: value.email,
            password: value.password,
            name: value.name,
          });
          if (result.error) {
            toast.error(result.error.message || "Error al crear cuenta");
          } else {
            toast.success("Cuenta creada exitosamente");
            router.navigate({ to: "/admin" });
          }
        } else {
          const result = await authClient.signIn.email({
            email: value.email,
            password: value.password,
          });
          if (result.error) {
            toast.error(result.error.message || "Error al iniciar sesión");
          } else {
            toast.success("Sesión iniciada correctamente");
            router.navigate({ to: "/admin" });
          }
        }
      } catch (err) {
        toast.error("Ocurrió un error inesperado");
      }
    },
  });

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-100" />
      </main>
    );
  }

  if (session?.user) {
    router.navigate({ to: "/admin" });
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center py-1">
          <CardTitle className="text-2xl font-bold tracking-widest font-italianno">
            Don Quijote
          </CardTitle>
          <CardDescription>Inicia sesión en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="grid gap-4"
          >
            {isSignUp && (
              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? "El nombre es requerido" : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
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
            )}

            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) =>
                  !value ? "El email es requerido" : undefined,
                onBlurAsync: async ({ value }) => {
                  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return "Email inválido";
                  }
                },
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name={field.name}
                    type="email"
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
              name="password"
              validators={{
                onBlur: ({ value }) =>
                  !value ? "La contraseña es requerida" : undefined,
                onBlurAsync: async ({ value }) => {
                  if (value && value.length < 8) {
                    return "La contraseña debe tener al menos 8 caracteres";
                  }
                },
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name={field.name}
                    type="password"
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
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-white dark:border-neutral-600 dark:border-t-neutral-900" />
                      <span>Por favor espera</span>
                    </span>
                  ) : isSignUp ? (
                    "Crear cuenta"
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
