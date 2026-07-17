import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "#/components/ui/card";

export const Route = createFileRoute("/home")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-6 md:py-7 lg:py-8 flex items-center justify-between">
          <h1 className="font-italianno text-2xl md:text-3xl lg:text-4xl text-foreground">
            Don Quijote
          </h1>
          <Link
            to="/login"
            className="font-sans tracking-wider text-sm text-foreground hover:text-muted-foreground transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Title */}
          <h2 className="font-italianno text-4xl md:text-5xl lg:text-6xl text-foreground mb-12 md:mb-16 lg:mb-20 text-center">
            Bienvenido
          </h2>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Bar Don Quijote Card */}
            <Link to="/bar">
              <Card className="group overflow-hidden border-border hover:border-foreground/50 transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                    <img
                      src="/Gemini_Generated_Image_wzsglbwzsglbwzsg.webp"
                      alt="Bar Don Quijote"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <img
                        src="/logo.webp"
                        alt="Don Quijote logo"
                        className="w-24 md:w-32 lg:w-40 mb-4"
                      />
                      <h3 className="font-italianno text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                        Bar Don Quijote
                      </h3>
                      <p className="font-sans tracking-widest text-white/90 text-sm md:text-base text-center">
                        Para que cualquier caballero pierda su cordura
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Restaurante Don Quijote Card */}
            <Link to="/restaurante">
              <Card className="group overflow-hidden border-border hover:border-foreground/50 transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                    <img
                      src="/_QJT1440.webp"
                      alt="Restaurante Don Quijote"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <img
                        src="/logo.webp"
                        alt="Don Quijote logo"
                        className="w-24 md:w-32 lg:w-40 mb-4"
                      />
                      <h3 className="font-italianno text-3xl md:text-4xl lg:text-5xl text-white mb-4">
                        Restaurante Don Quijote
                      </h3>
                      <p className="font-sans tracking-widest text-white/90 text-sm md:text-base text-center">
                        Para que cualquier caballero pierda su cordura
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
