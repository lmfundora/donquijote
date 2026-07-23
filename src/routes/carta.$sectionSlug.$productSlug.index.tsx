import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export const Route = createFileRoute("/carta/$sectionSlug/$productSlug/")({
  component: ProductPage,
  head: () => ({
    meta: [
      {
        title: "Producto - Don Quijote",
      },
      {
        name: "description",
        content: "Descubre nuestros productos artesanales en Don Quijote",
      },
    ],
  }),
  loader: async ({ params, context }) => {
    // Cargar producto primero (sin procesar imagen en SSR)
    await context.queryClient.ensureQueryData(
      convexQuery(api.products.getBySlug, { slug: params.productSlug }),
    );

    // Obtener el producto para cargar datos dependientes
    const product = await context.queryClient.fetchQuery(
      convexQuery(api.products.getBySlug, { slug: params.productSlug }),
    );

    if (product) {
      // Cargar sección y categoría usando los IDs del producto
      await Promise.all([
        context.queryClient.ensureQueryData(
          convexQuery(api.sections.getById, {
            id: product.sectionId,
          }),
        ),
        product.categoryId
          ? context.queryClient.ensureQueryData(
              convexQuery(api.categories.getById, {
                id: product.categoryId,
              }),
            )
          : Promise.resolve(),
      ]);
    }
  },
});

function ProductPage() {
  const { productSlug } = Route.useParams();
  const { data: product } = useSuspenseQuery(
    convexQuery(api.products.getBySlug, { slug: productSlug }),
  );

  const { data: section } = useQuery(
    convexQuery(api.sections.getById, {
      id: product?.sectionId as any,
    }),
  );

  const { data: category } = useQuery(
    convexQuery(api.categories.getById, {
      id: product?.categoryId as any,
    }),
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF4ED] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-italianno text-4xl mb-4 text-[#4A2E1B]">
            Producto no encontrado
          </h1>
          <p className="text-stone-500 tracking-wide mb-6">
            El producto que buscas no existe.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#4A2E1B] underline underline-offset-4"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200";
  const imageUrl = product.imageUrl || defaultImageUrl;

  return (
    <main className="min-h-screen bg-[#FAF4ED] text-[#332211] relative overflow-x-hidden">
      {/* Botón flotante para regresar a la sección (Común para ambas vistas) */}
      <Link
        to={
          section
            ? {
                to: "/carta/$sectionSlug",
                params: { sectionSlug: section.slug || "" },
              }
            : "/"
        }
        className="absolute top-4 left-4 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* ========================================================================= */}
      {/* 1. ESTRUCTURA DESKTOP (lg:flex - Oculta en móviles) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* LADO IZQUIERDO: Detalles del trago (40% de ancho) */}
        <div className="w-[40%] bg-background flex flex-col justify-between relative select-none">
          {/* Marca de agua de fondo (Logo Don Quijote gigante) */}
          <div className="absolute flex ms-[25%] opacity-40 pointer-events-none z-0 overflow-hidden h-screen w-screen">
            <img src="/logofill.svg" alt="" className=" h-auto select-none" />
          </div>

          {/* Contenedor Superior: Textos Principales */}
          <div className="relative z-10 space-y-8 text-end pe-8 pt-10">
            <h1 className="font-italianno text-7xl text-[#4A2E1B] tracking-wide">
              {product.name}
            </h1>
            <p className="text-stone-700 text-lg leading-relaxed mx-auto font-sans font-light tracking-widest">
              {product.description}
            </p>
          </div>

          {/* Contenedor Inferior: Precio flotante abajo a la derecha */}
          <div className="relative z-10 text-right w-full pr-4 pb-4">
            <span className="font-italianno text-6xl text-[#4A2E1B] font-light tracking-wider">
              {product.price}
            </span>
          </div>
        </div>

        {/* LADO DERECHO: Imagen de fondo + Bloque de preparación en blanco (60% de ancho) */}
        <div
          className="w-[60%] bg-cover bg-center relative flex flex-col justify-end p-5 text-white"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Capa oscura sutil inferior para que se lea bien el texto blanco */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Desplegables de información sobre el gradiente */}
          <div className="relative z-10 w-1/3 space-y-3 mb-3">
            {product.preparation && (
              <CollapsibleInfo
                title="Preparación"
                content={product.preparation}
                isWhite
              />
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <CollapsibleInfo
                title="Ingredientes"
                content={product.ingredients.join(", ")}
                isWhite
              />
            )}
            {product.allergens && product.allergens.length > 0 && (
              <CollapsibleInfo
                title="Alérgenos"
                content={product.allergens.join(", ")}
                isWhite
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:hidden min-h-screen w-full pb-12 justify-between">
        <div
          className="w-full h-[45vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* PARTE INFERIOR: Contenido e Información con la marca de agua */}
        <div className="flex-grow bg-[#FAF4ED] px-6 pt-10 pb-6 flex flex-col justify-between relative overflow-x-hidden">
          {/* Marca de agua de fondo en móvil */}
          <div className="absolute w-full inset-0 flex pointer-events-none z-10 overflow-hidden">
            <img
              src="/logofill.svg"
              alt=""
              className="h-auto select-none  translate-x-1/2"
            />
          </div>

          {/* Datos del Producto */}
          <div className="relative z-10 space-y-6">
            <h1 className="font-italianno text-5xl text-[#4A2E1B] tracking-wide">
              {product.name}
            </h1>
            <p className="text-stone-700 text-base leading-relaxed font-sans font-light tracking-widest">
              {product.description}
            </p>

            {/* Desplegables de información */}
            <div className="pt-4 space-y-3">
              {product.preparation && (
                <CollapsibleInfo
                  title="Preparación"
                  content={product.preparation}
                />
              )}
              {product.ingredients && product.ingredients.length > 0 && (
                <CollapsibleInfo
                  title="Ingredientes"
                  content={product.ingredients.join(", ")}
                />
              )}
              {product.allergens && product.allergens.length > 0 && (
                <CollapsibleInfo
                  title="Alérgenos"
                  content={product.allergens.join(", ")}
                />
              )}
            </div>
          </div>

          {/* Precio posicionado abajo a la derecha de forma limpia */}
          <div className="relative z-10 text-right w-full mt-10 pr-4">
            <span className="font-italianno text-5xl text-[#4A2E1B] font-light tracking-wider">
              {product.price}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

// Componente reutilizable para desplegables de información
function CollapsibleInfo({
  title,
  content,
  isWhite = false,
}: {
  title: string;
  content: string;
  isWhite?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={`flex items-center justify-between w-full text-left ${
          isWhite
            ? "text-white/95 hover:text-white border-b border-white/20 pb-2"
            : "text-[#4A2E1B] border border-[#4A2E1B]/40 bg-white/40 backdrop-blur-xs rounded-xl px-6 py-3"
        }`}
      >
        <h2
          className={`font-italianno ${
            isWhite ? "text-4xl tracking-wide" : "text-3xl"
          }`}
        >
          {title}
        </h2>
        {isOpen ? (
          <ChevronUp
            size={isWhite ? 24 : 20}
            className={isWhite ? "text-white" : "text-[#4A2E1B]"}
          />
        ) : (
          <ChevronDown
            size={isWhite ? 24 : 20}
            className={isWhite ? "text-white" : "text-[#4A2E1B]"}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <p
          className={`font-sans font-light leading-relaxed tracking-wider ${
            isWhite ? "text-stone-200 text-base" : "text-stone-600 text-xs"
          }`}
        >
          {content}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
