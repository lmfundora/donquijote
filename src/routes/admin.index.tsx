import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold tracking-widest mb-6 font-sans">Dashboard</h2>
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/admin/secciones">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="tracking-wide font-sans">Secciones</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/admin/categorias">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="tracking-wide font-sans">Categorías</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2 tracking-wide font-sans">Usuarios</h3>
            <p className="text-3xl font-bold tracking-wider">0</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2 tracking-wide font-sans">Reservas</h3>
            <p className="text-3xl font-bold tracking-wider">0</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2 tracking-wide font-sans">Pedidos</h3>
            <p className="text-3xl font-bold tracking-wider">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
