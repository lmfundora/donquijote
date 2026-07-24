import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/carta/")({
  component: CartaComponent,
  head: () => ({
    meta: [
      {
        title: "Carta - Don Quijote",
      },
      {
        name: "description",
        content: "Explora nuestra carta en Don Quijote",
      },
    ],
  }),
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted-foreground animate-pulse">Cargando sección...</p>
    </div>
  ),
  loader: async ({ context }) => {
    const sections = await context.queryClient.ensureQueryData(
      convexQuery(api.sections.list, {}),
    );

    return { sections };
  },
});

const getSlugFromName = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getFallbackImage = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("bar"))
    return "/Gemini_Generated_Image_wzsglbwzsglbwzsg.webp";
  if (lower.includes("restaurante")) return "/_QJT1440.webp";
  if (lower.includes("disco")) return "/20260708_154439.webp";
  return "/20260704_184003.webp";
};

function CartaComponent() {
  const { sections } = Route.useLoaderData();
  // const { data: sections } = useSuspenseQuery(
  //   convexQuery(api.sections.list, {}),
  // );
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF5EE] relative overflow-x-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full pt-10 pb-16 px-4 md:px-6">
        {/* Welcome Title */}
        <h2 className="font-italianno text-5xl md:text-7xl lg:text-8xl text-[#381d11] mb-8 md:mb-12 text-left pl-2 md:pl-4">
          Nuestra Carta
        </h2>

        {/* Sections Grid / Stack */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          {sections.map((section) => {
            const bgImage = section.imageUrl || getFallbackImage(section.name);

            return (
              <a
                key={section._id}
                href={`/carta/${section.slug}`}
                className="group self-end-safe relative block w-full md:w-3/4 aspect-[3.2/1] md:aspect-[4.8/1] min-h-[110px] md:min-h-[140px] overflow-hidden rounded-[2px] shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer border-0 p-0 bg-transparent"
              >
                <img
                  src={bgImage}
                  alt={section.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-l from-black/90 via-black/40 to-transparent group-hover:from-black/55 group-hover:via-black/35 transition-all duration-300" />

                {/* Logo bottom-left */}
                <div className="absolute bottom-3 left-4 md:bottom-5 md:left-6 flex items-center">
                  <img
                    src="/logoblanco.webp"
                    alt="Don Quijote logo"
                    className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                {/* Right text container */}
                <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 lg:right-12 flex flex-col items-end w-[65%] md:w-[55%]">
                  <h3 className="font-italianno text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wide leading-none select-none">
                    {section.name}
                  </h3>
                  <div className="w-full h-[1px] bg-white/70 my-1.5 md:my-2.5 transition-all duration-500 group-hover:bg-white" />
                  <p className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 font-light tracking-widest text-right leading-relaxed select-none">
                    {section.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
