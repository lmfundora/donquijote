import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { Menu, X, Users, Folder, Package, LogOut } from "lucide-react";
import { fetchAuthQuery } from "#/lib/auth-server";
import { api } from "../../convex/_generated/api";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      // Obtener el usuario autenticado desde Convex
      const user = await fetchAuthQuery(api.auth.getCurrentUser, {});
      return user;
    } catch (error) {
      // Si Convex lanza un ConvexError: Unauthenticated, retornamos null
      console.log("Usuario no autenticado en Convex");
      return null;
    }
  },
);

// 2. Definición de la Ruta con beforeLoad
export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    // Verificamos si existe sesión usando la consulta autenticada a Convex
    const user = await getSessionFn();

    console.log(user);

    if (!user) {
      throw redirect({
        to: "/login",
      });
    }

    return { user };
  },
  component: AdminLayout,
});

// 3. Componente de la Vista / Layout en el mismo archivo
function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Obtenemos la sesión inyectada por el beforeLoad mediante el contexto de la ruta
  const { user } = Route.useRouteContext();

  const menuItems = [
    { icon: Package, label: "Productos", href: "/admin" },
    { icon: Users, label: "Secciones", href: "/admin/secciones" },
    { icon: Folder, label: "Categorías", href: "/admin/categorias" },
  ];

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {drawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold tracking-widest font-italianno">
            Don Quijote
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground tracking-wide">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Backdrop overlay para móvil */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border transition-transform duration-300 ease-in-out z-40 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-foreground tracking-wide"
              activeProps={{ className: "bg-accent font-semibold" }}
              onClick={() => setDrawerOpen(false)}
            >
              <item.icon size={20} />
              <span className="font-sans">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          drawerOpen ? "lg:ml-64" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
