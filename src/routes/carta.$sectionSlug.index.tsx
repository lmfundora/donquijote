import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Separator } from "#/components/ui/separator";
import { useState } from "react";
import { type Doc } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/carta/$sectionSlug/")({
  component: SectionPage,
  head: () => ({
    meta: [
      {
        title: "Sección - Don Quijote",
      },
      {
        name: "description",
        content: "Explora nuestra selección de productos en Don Quijote",
      },
    ],
  }),

  pendingComponent: () => (
    <div className="flex items-center justify-center p-8">
      <p className="text-muted-foreground animate-pulse">
        Cargando secciones...
      </p>
    </div>
  ),
  loader: async ({ params, context }) => {
    // 1. Disparamos las dos peticiones independientes simultáneamente
    const [section, categories] = await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.sections.getBySlug, { slug: params.sectionSlug }),
      ),
      context.queryClient.ensureQueryData(convexQuery(api.categories.list, {})),
    ]);

    let products;
    // 2. Como la query de productos depende de 'section._id',
    // la instanciamos justo al terminar Promise.all (sin 'await' para no ralentizar la ruta)
    if (section?._id) {
      products = await context.queryClient.ensureQueryData(
        convexQuery(api.products.listBySection, {
          sectionId: section._id as any,
        }),
      );
    }

    return { section, categories, products };
  },
});

function SectionPage() {
  const { sectionSlug } = Route.useParams();
  const { section, categories, products } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-[#FAF4ED] text-[#332211]">
      {!section ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="font-italianno text-4xl mb-4">
              Sección no encontrada
            </h1>
            <p className="text-stone-500 tracking-wide">
              La sección que buscas no existe.
            </p>
          </div>
        </div>
      ) : (
        <>
          <SectionHeader section={section} />
          {/* CONTENIDO DE CATEGORÍAS Y PRODUCTOS */}
          <div className="max-w-7xl mx-auto w-full pt-4 pb-16 px-4 md:px-6">
            <SectionContent
              section={section}
              sectionSlug={sectionSlug}
              products={products || []}
              categories={categories || []}
            />
          </div>
        </>
      )}
    </main>
  );
}

function SectionHeader({ section }: { section: Doc<"sections"> }) {
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200";
  const imageUrl = section.imageUrl || defaultImageUrl;

  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className="w-full h-[260px] md:h-[260px] relative bg-cover bg-center flex flex-col justify-between p-6 md:p-10 border-b-4 "
    >
      <div
        className="absolute inset-0 bg-linear-to-l from-black via-black/40 to-transparent"
        aria-hidden="true" // Ocultar a lectores de pantalla ya que es decorativo
      />
      <div className="relative z-10 w-2/3 max-w-7xl self-end-safe flex flex-col items-end md:items-end justify-end text-right text-white">
        <h1 className="font-italianno text-6xl md:text-8xl font-normal leading-none tracking-wide text-white drop-shadow-md">
          {section.name}
        </h1>
        <Separator className="mb-18" />
        {section.description && (
          <p className="font-sans font-light text-xs md:text-sm text-stone-200 mt-2 max-w-md md:max-w-xl tracking-widest">
            {section.description}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionContent({
  products,
  categories,
  sectionSlug,
}: {
  products: Doc<"products">[];
  categories: Doc<"categories">[];
  section: Doc<"sections">;
  sectionSlug: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const productsByCategory =
    products?.reduce(
      (acc: Record<string, Doc<"products">[]>, product: Doc<"products">) => {
        const categoryId =
          product.categoryId && product.categoryId !== ""
            ? product.categoryId
            : "uncategorized";
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(product);
        return acc;
      },
      {},
    ) || {};

  const getCategoryName = (categoryId: string) => {
    if (categoryId === "uncategorized") return "Sin categoría";
    const category = categories?.find(
      (c: Doc<"categories">) => c._id === categoryId,
    );
    return category?.name || "Sin categoría";
  };

  const filteredProducts = selectedCategory
    ? products?.filter(
        (product: Doc<"products">) => product.categoryId === selectedCategory,
      )
    : products;

  return (
    <>
      {/* Selector de Categorías Horizontal ("Bebidas") */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar justify-start">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`border px-6 py-1 text-center font-italianno text-2xl transition-colors shadow-sm min-w-[130px] ${
            selectedCategory === null
              ? "bg-[#4A2E1B] text-white border-[#4A2E1B]"
              : "border-[#5A3A24]/40 bg-white/80 text-[#4A2E1B] hover:bg-white"
          }`}
        >
          Todos
        </button>
        {Object.keys(productsByCategory)
          .filter((categoryId) => categoryId !== "uncategorized")
          .map((categoryId) => (
            <button
              key={categoryId}
              onClick={() => setSelectedCategory(categoryId)}
              className={`border px-6 py-1 text-center font-italianno text-2xl transition-colors shadow-sm min-w-[130px] ${
                selectedCategory === categoryId
                  ? "bg-[#4A2E1B] text-white border-[#4A2E1B]"
                  : "border-[#5A3A24]/40 bg-white/80 text-[#4A2E1B] hover:bg-white"
              }`}
            >
              {getCategoryName(categoryId)}
            </button>
          ))}
      </div>

      {/* Grid de Productos */}
      {!filteredProducts || filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-500 tracking-wide font-italianno text-3xl">
            {selectedCategory
              ? "No hay productos en esta categoría"
              : "No hay productos disponibles en esta sección"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Doc<"products">) => {
            return product.slug ? (
              <a
                key={product._id}
                href={`/carta/${sectionSlug}/${product.slug}`}
                className="flex bg-white border border-[#4A2E1B] overflow-hidden shadow-sm aspect-[1.5/1] hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Izquierda: Imagen (50%) */}
                <div className="w-1/2 relative bg-stone-100 border-r border-[#4A2E1B]/10">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs italic">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/20 backdrop-blur-[1px] px-1.5 py-0.5 rounded text-[10px] text-white font-serif tracking-widest uppercase scale-75 origin-bottom-left opacity-60">
                    Don Quijote
                  </div>
                </div>

                {/* Derecha: Detalles (50%) */}
                <div className="w-1/2 p-4 flex flex-col justify-between bg-[#FCF8F4]">
                  <div className="space-y-1 text-end">
                    <h3 className="font-italianno text-4xl md:text-5xl text-[#4A2E1B] leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-stone-500 text-[11px] md:text-xs leading-relaxed max-w-[95%] mx-auto font-sans font-light line-clamp-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Línea decorativa + Precio */}
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <div className="flex-grow border-b border-[#4A2E1B]/20 mb-1" />
                    <span className="font-italianno text-2xl md:text-3xl text-[#4A2E1B] font-medium pl-1">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </a>
            ) : null;
          })}
        </div>
      )}
    </>
  );
}
