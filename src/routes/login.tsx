import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

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
            router.navigate({ to: "/" });
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
            router.navigate({ to: "/" });
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
    router.navigate({ to: "/" });
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <section className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-widest font-italianno">
            Don Quijote
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Inicia sesión en tu cuenta
          </p>
        </div>

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
                onChange: ({ value }) =>
                  !value ? "El nombre es requerido" : undefined,
              }}
            >
              {(field) => (
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400">
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
              onChange: ({ value }) =>
                !value ? "El email es requerido" : undefined,
              onChangeAsync: async ({ value }) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return "Email inválido";
                }
              },
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email
                </label>
                <input
                  id="email"
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value ? "La contraseña es requerida" : undefined,
              onChangeAsync: async ({ value }) => {
                if (value && value.length < 8) {
                  return "La contraseña debe tener al menos 8 caracteres";
                }
              },
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400">
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
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed h-10 w-full"
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
              </button>
            )}
          </form.Subscribe>
        </form>
      </section>
    </main>
  );
}
