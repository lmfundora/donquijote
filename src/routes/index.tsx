import { Separator } from "#/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 0 && !scrolled && !isTransitioning && !isExiting) {
        setIsTransitioning(true);
        setScrolled(true);
        // Prevent scroll during transition
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);

        setTimeout(() => {
          setIsTransitioning(false);
          document.body.style.overflow = "";
        }, 700);
      } else if (scrollY <= 0 && scrolled && !isTransitioning && !isExiting) {
        setIsExiting(true);
        setScrolled(false);
        setIsTransitioning(true);
        // Prevent scroll during exit transition
        document.body.style.overflow = "hidden";

        setTimeout(() => {
          setIsExiting(false);
          setIsTransitioning(false);
          document.body.style.overflow = "";
        }, 700);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, isTransitioning, isExiting]);

  const links = [
    {
      title: "Comida",
      link: "#",
    },
    {
      title: "Bebida",
      link: "#",
    },
    {
      title: "Otros",
      link: "#",
    },
    {
      title: "Reservar",
      link: "#",
    },
  ];
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* Background Image - Fixed */}
      <div className="w-screen h-screen overflow-hidden relative">
        <img
          src="/Gemini_Generated_Image_wzsglbwzsglbwzsg.png"
          alt="Fondo"
          className="w-full h-full object-cover scale-125 md:scale-115 lg:scale-125 md:translate-x-10 lg:translate-x-25"
        />

        {/* Hero Text - Transitions to div position on scroll */}
        <h1
          className={`absolute z-35 font-italianno transition-all duration-700 ease-out ${
            scrolled
              ? "text-4xl md:text-6xl lg:text-6xl text-text-dark top-[25%] left-[30%] md:left-[20%] lg:left-[15%] "
              : "text-6xl md:text-8xl lg:text-9xl text-white top-[40%] left-[15%] "
          }`}
        >
          Don Quijote
        </h1>
      </div>

      {/* Vignette Overlay - Fixed */}
      <div className="vinetta w-screen h-screen" />

      {/* Navigation - Fixed */}
      <nav className="absolute top-0 left-0 right-0 tracking-widest flex items-center justify-between px-6 md:px-8 lg:px-10 py-6 md:py-7 lg:py-8 z-40 font-sans">
        {/* Mobile hamburger */}
        <button
          type="button"
          className={`md:hidden  z-50 flex flex-col gap-1.5 p-1 ${scrolled ? "text-text-dark" : "text-text-dark"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex w-full justify-between text-sm md:text-base lg:text-lg">
          {links.map((l) => (
            <a
              key={l.title}
              href={l.link}
              className="text-white text-lg font-light hover:opacity-80 transition-opacity cursor-pointer"
            >
              {l.title}
            </a>
          ))}
        </div>

        {/* Mobile nav overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.title}
              href={l.link}
              className="text-white text-2xl font-light tracking-widest hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              {l.title}
            </a>
          ))}
        </div>
      </nav>

      {/* White Left Panel - Slides up from below when scrolled */}
      <div
        className={`z-30 w-full md:w-3/4 lg:w-1/2 bg-background h-screen absolute top-0 left-0 transition-transform duration-700 ease-out ${
          isExiting || !scrolled ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="w-full h-full relative">
          <p className="absolute top-[40%]  left-[21%]  md:left-[22%] lg:left-[27%] w-52 md:w-64 lg:w-60 text-center font-sans tracking-widest text-sm/6 md:text-lg/10 lg:text-base/14">
            Donde el lujo, cultura y tradición se filtran en cada
            experiencia{" "}
          </p>
        </div>
      </div>

      {/* Content below hero - for scrolling */}
      <div className="bg-background pt-16 md:pt-40 lg:pt-50">
        <div className="flex gap-4 md:gap-12 lg:gap-15">
          <img
            src="/Gemini_Generated_Image_9yoc2p9yoc2p9yoc.webp"
            alt="Plato fino"
            className="h-52 md:h-96 lg:h-120 aspect-3/5 ms-6 md:ms-16 lg:ms-50"
          />
          <div className="">
            <p className="font-sans tracking-widest text-base md:text-xl lg:text-xl">
              Exelencia
            </p>
            <p className="font-sans tracking-widest mt-4 md:mt-12 lg:mt-20 w-24 md:w-32 lg:w-30 text-xs/5 md:text-sm/7 lg:text-sm/14">
              Platos concebidos por maestros
            </p>
          </div>
        </div>
        <div className="flex justify-end pe-6 md:pe-16 lg:pe-30 gap-4 md:gap-12 lg:gap-15 h-52 md:h-96 lg:h-120 mt-20 md:mt-0 items-end">
          <div className="text-end">
            <p className="font-sans tracking-widest text-base md:text-xl lg:text-xl">
              Alta Cocina
            </p>
            <p className="font-sans tracking-widest mt-3 md:mt-8 lg:mt-10 w-24 md:w-32 lg:w-30 text-xs/5 md:text-sm/7 lg:text-sm/14">
              Lujo & Delicia
            </p>
          </div>
          <img
            src="/Gemini_Generated_Image_cj148xcj148xcj14.webp"
            alt="Plato fino"
            className="h-52 md:h-96 lg:h-120 aspect-square"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between p-6 md:p-16 lg:p-30 mt-20 md:mt-0">
          <div className="w-44 md:w-56 lg:w-fit">
            <div className="text-end mb-6 md:mb-20 w-full">
              <p className="font-sans tracking-widest text-base md:text-xl lg:text-xl">
                Bebida selecta
              </p>
              <p className="font-sans tracking-widest mt-2 md:mt-6 lg:mt-5 text-[10px] md:text-sm lg:text-sm">
                Sólo los mejores vinos
              </p>
            </div>
            <img
              src="/Gemini_Generated_Image_s4n0jts4n0jts4n0.webp"
              alt="Copa de vino"
              className="w-40 md:w-56 lg:w-fit md:h-96 lg:h-120 aspect-3/5 ms-4 md:ms-12 lg:ms-20"
            />
          </div>

          <div className="flex flex-col justify-end mt-10 md:mt-0">
            <div className=" w-full flex justify-end">
              <p className="font-sans tracking-widest mt-4 md:mt-10 lg:mt-11 mb-10 md:mb-24 lg:mb-50 w-40 md:w-52 lg:w-50 text-end text-xs/5 md:text-sm/7 lg:text-sm/14">
                El maridaje perfecto para coronar una velada verdaderamente
                inolvidable
              </p>
            </div>
            <img
              src="/Gemini_Generated_Image_6wp7g76wp7g76wp7.webp"
              alt="Cava"
              className="h-60 md:h-96 lg:h-120 aspect-square self-end"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background text-text-dark px-6 md:px-12 lg:px-25">
        {/* Pink line at top */}
        <Separator />

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-10 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            {/* Social Media */}
            <div>
              <h3 className="font-sans tracking-widest text-lg mb-4">
                @selmacopenhagen
              </h3>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  M
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  😊
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  SG
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  OAD
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-sans tracking-widest text-lg mb-4">
                Santa Clara
              </h3>
              <p className="font-sans tracking-wider text-sm">
                Carretera de Sagua #132
              </p>
              <p className="font-sans tracking-wider text-sm">
                Villa Clara, Cuba
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-sans tracking-widest text-lg mb-4">
                Contact
              </h3>
              <p className="font-sans tracking-wider text-sm">+45 40277203</p>
              <p className="font-sans tracking-wider text-sm">
                hello@selmacopenhagen.dk
              </p>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="font-sans tracking-widest text-lg mb-4">
                Horarios
              </h3>
              <div className="mb-4">
                <p className="font-sans tracking-wider text-sm font-semibold">
                  Cena
                </p>
                <p className="font-sans tracking-wider text-sm">
                  Todos los días
                </p>
                <p className="font-sans tracking-wider text-sm">18:30-23:00</p>
              </div>
              <div>
                <p className="font-sans tracking-wider text-sm font-semibold">
                  Almuerzo
                </p>
                <p className="font-sans tracking-wider text-sm">
                  Todos los días
                </p>
                <p className="font-sans tracking-wider text-sm">11:30-16:00</p>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-8 mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 lg:pt-8 border-t border-gray-300">
            <div>
              <h3 className="font-sans tracking-widest text-lg">Jobs</h3>
              <p className="font-sans tracking-wider text-sm mt-2 cursor-pointer hover:opacity-70">
                Apply for jobs
              </p>
            </div>
            <div>
              <h3 className="font-sans tracking-widest text-lg">Press</h3>
              <p className="font-sans tracking-wider text-sm mt-2 cursor-pointer hover:opacity-70">
                Go to press page
              </p>
            </div>
            <div>
              <h3 className="font-sans tracking-widest text-lg">Giftcard</h3>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
