import { createFileRoute } from "@tanstack/react-router";
import { useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { useConvexAuth } from "@convex-dev/react-query";

export const Route = createFileRoute("/home/$slug")({
  component: SectionPage,
  loader: async ({ params }) => {
    // This loader runs on the server for SSR
    return { slug: params.slug };
  },
});

function SectionPage() {
  const { slug } = Route.useLoaderData();
  const { isAuthenticated } = useConvexAuth();
  
  const section = useConvexQuery(api.sections.getBySlug, { slug });
  
  if (!section) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-italianno text-4xl text-foreground mb-4">Sección no encontrada</h1>
          <p className="text-muted-foreground tracking-wide">La sección que buscas no existe.</p>
        </div>
      </main>
    );
  }

  const products = useConvexQuery(api.products.listBySection, { 
    sectionId: section._id 
  });
  const categories = useConvexQuery(api.categories.list, {});

  // Group products by category
  const productsByCategory = products?.reduce((acc: any, product: any) => {
    const categoryId = product.categoryId || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {}) || {};

  const getCategoryName = (categoryId: string) => {
    if (categoryId === "uncategorized") return "Sin categoría";
    const category = categories?.find((c: any) => c._id === categoryId);
    return category?.name || "Sin categoría";
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto w-full pt-10 pb-16 px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h1 className="font-italianno text-5xl md:text-7xl text-foreground mb-4">
            {section.name}
          </h1>
          <p className="text-muted-foreground tracking-wide text-lg">
            {section.description}
          </p>
        </div>

        {/* Products by Category */}
        {products === undefined ? (
          <div className="space-y-8">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground tracking-wide">
              No hay productos disponibles en esta sección
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(productsByCategory).map(([categoryId, categoryProducts]: [string, any]) => (
              <div key={categoryId}>
                <h2 className="font-sans text-2xl font-semibold tracking-widest mb-4 text-foreground border-b border-border pb-2">
                  {getCategoryName(categoryId)}
                </h2>
                <div className="space-y-4">
                  {categoryProducts.map((product: any) => (
                    <div
                      key={product._id}
                      className="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-sans text-lg font-semibold text-foreground">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {product.description}
                          </p>
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">
                                Alérgenos: {product.allergens.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-sans text-lg font-semibold text-foreground">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
