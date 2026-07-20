import { createFileRoute, useRouter, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { authClient } from "#/lib/auth-client";
import { Menu, X, Users, Folder, Package, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin/productos", replace: true });
  }, [navigate]);

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

  const menuItems = [
    { icon: Users, label: "Secciones", href: "/admin/secciones" },
    { icon: Folder, label: "Categorías", href: "/admin/categorias" },
    { icon: Package, label: "Productos", href: "/admin/productos" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    router.navigate({ to: "/login" });
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
            {session.user.name || session.user.email}
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

      {/* Backdrop overlay for mobile */}
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
              onClick={() => setDrawerOpen(false)}
            >
              <item.icon size={20} />
              <span className="font-sans">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${drawerOpen ? "lg:ml-64" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
