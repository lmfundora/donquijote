import SvgDraw from "#/components/SvgDraw";
import { Separator } from "#/components/ui/separator";
import { Button } from "#/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useConvexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import Footer from "#/components/Footer";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = useConvexQuery(api.sections.list, {});

  // Minimal scroll handler for CSS transitions - no scroll blocking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links =
    sections
      ?.filter((section: any) => section.showOnLanding !== false)
      .map((section: any) => ({
        title: section.name,
        to: section.slug
          ? `/carta/${section.slug}`
          : `/carta/${section.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")}`,
      })) || [];
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* Background Image - Fixed */}
      <div className="w-screen h-screen overflow-hidden relative">
        <img
          src="/Gemini_Generated_Image_wzsglbwzsglbwzsg.webp"
          alt="Fondo"
          className="w-full h-full object-cover scale-125 md:scale-115 lg:scale-125 md:translate-x-10 lg:translate-x-25"
        />

        {/* Hero Text - Scroll-driven animation */}
        <h1 className="hero-title absolute z-35 font-italianno">Don Quijote</h1>

        {/* CTA Button */}
        <a href="/carta" className="hero-button absolute z-35">
          <Button
            variant={"outline"}
            className="font-sans tracking-widest text-white hover:bg-accent transition-colors duration-300 gap-2"
          >
            Ver carta
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>

      {/* Vignette Overlay - Fixed */}
      <div className="vinetta w-screen h-screen" />

      {/* Navigation - Fixed */}
      <nav className="absolute top-0 left-0 right-0 tracking-widest flex items-center justify-between px-6 md:px-8 lg:px-10 py-6 md:py-7 lg:py-8 z-40 font-sans">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden z-50 flex flex-col gap-1.5 p-1 text-text-dark"
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
        <div className="hidden md:flex w-full justify-between text-sm md:text-base lg:text-lg items-center">
          {links.map((l) => (
            <Link
              key={l.title}
              to={l.to}
              className="text-white text-lg font-light hover:opacity-80 transition-opacity cursor-pointer"
            >
              {l.title}
            </Link>
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
            <Link
              key={l.title}
              to={l.to}
              className="text-white text-2xl font-light tracking-widest hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => setMenuOpen(false)}
            >
              {l.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* White Left Panel - Scroll-driven animation */}
      <div className="white-panel z-30 w-full bg-white h-screen absolute top-0 left-0">
        <div className="w-full h-full relative">
          <p className="absolute top-[35%]  left-[25%]  md:left-[22%] lg:left-[32%] w-52 md:w-64 lg:w-60 text-center font-sans tracking-widest text-sm/6 md:text-lg/10 lg:text-base/14">
            Donde el lujo, cultura y tradición se filtran en cada
            experiencia{" "}
          </p>
          <img
            src="/logo.webp"
            alt="Don Quijote logo"
            className="absolute top-[75%]  left-[31%]  md:left-[30%] lg:left-[38%] w-40"
          />
        </div>
      </div>

      {/* SVG Background */}
      <div className="h-150 w-150 md:h-300 md:w-300 text-red-800/14 absolute top-[120vw] md:top-[20vw] translate-x-[10vw] md:translate-x-[20%] z-0">
        <SvgDraw
          className="h-full w-full text-red-800/14 md:h-[50vw] md:w-[50vw] absolute top-[70vw] md:top-[37.5vw] translate-x-[100] md:translate-x-[65%] z-0"
          path="M552.989,282.284c-8.716,702.359 -14.07,702.82 -3.081,762.851c0.078,0.426 20.361,31.055 19.379,57.982c-2.3,63.076 -8.456,62.089 -3.346,125.042c9.079,111.843 -38.601,141.262 -23.619,183.364c8.827,24.806 7.867,24.571 16.042,50.104c1.354,17.364 4.892,19.523 -9.943,30.105c-7.353,5.245 -2.463,6.747 10.88,48.881c1.221,0.461 2.442,0.923 3.663,1.384c31.362,-8.267 66.287,-114.328 134.074,-125.378c31.35,-5.111 50.884,-0.853 36.766,-29.907c-2.95,-6.07 -2.324,-5.634 -5.103,-12.369c-12.747,-31.703 -0.857,-51.242 -7.661,-52.954c-20.398,-5.131 -40.198,-5.104 -21.934,-16.09c71.551,-43.038 69.709,-65.37 126.083,-46.75c28.986,23.593 26.721,24.619 49.652,53.71l15.794,17.588c2.191,9.251 2.457,9.854 -5.542,15.898c-17.196,12.994 69.031,148.619 33.128,65.501c-16.867,-39.048 -8.253,-87.489 3.669,-95.892c13.305,10.806 22.367,98.009 54.164,92.254c31.194,-5.646 19.327,18.836 73.493,55.825c27.467,18.757 15.551,29.522 42.012,49.803c42.618,27.178 43.392,24.955 83.048,57.397c20.226,58.779 0.788,81.204 -48.492,81.501c-27.731,-9.59 -25.5,-15.294 -54.263,-17.52c-18.775,-0.928 -18.343,-4.378 -41.83,1.426l-8.484,2.958c-47.54,9.888 -52.258,111.049 -31.718,124.903c18.537,12.503 99.267,59.636 80.233,143.043c-0.624,1.611 7.111,6.055 -39.026,51.085c-29.98,33.771 -15.934,44.371 -1.944,54.661l4.535,3.631c11.022,12.373 11.108,12.427 12.77,28.676c5.8,27.932 7.24,33.814 -19.918,42.928c-23.989,8.051 -32.508,28.302 -59.2,20.67c-10.013,-2.863 -12.156,21.845 -17.011,48.738c-1.193,2.738 -2.387,5.476 -3.58,8.214c-33.221,76.208 -38.46,75.025 -40.636,158.37c-0.187,7.148 -12.636,4.578 -18.844,87.366c-1.657,22.102 -15.921,30.62 -6.155,116.643c7.362,64.846 -29.216,23.608 -29.709,20.751c-3.732,-21.646 -4.075,-88.484 -13.165,-49.931c-11.73,49.752 24.958,76.333 -16.362,76.434c-26.373,0.065 -32.123,-8.099 -29.698,-109.675c0.586,-55.04 11.787,-55.303 -2.444,-108.559c-8.845,-33.1 22.315,-48.898 -43.86,-149.479c-3.19,-7.295 -7.044,-14.289 -10.234,-21.584c-17.41,-39.812 -22.691,-92.754 -25.882,-49.327c-3.844,52.302 0.8,73.962 2.146,80.241c-6.726,34.988 19.891,79.022 13.916,127.96c-1.265,10.361 -12.423,101.749 2.771,130.446c23.75,105.748 -36.818,75.526 -38.943,69.516c-0.281,-0.794 3.748,-64.886 4.102,-70.526c-57.436,-6.92 -81.638,0.875 -109.581,-1.054c0.913,-23.127 -10.952,-194.488 -27.599,-252.784l-0.455,-4.344c-2.809,-20.411 -9.508,-176.644 -21.244,-129.309c-15.578,62.831 -24.798,60.936 -21.839,124.966c-25.26,119.25 24.728,150.18 20.281,212.221c-2.141,29.865 -4.199,29.368 -0.89,46.716c1.522,7.345 19.968,48.631 -6.431,61.39c-39.969,19.318 -53.149,0.531 -39.277,-42.031c17.884,-54.875 -8.722,-55.846 -3.836,-145.051c4.341,-79.264 -13.161,11.025 -13.302,12.477c-13.461,139.178 13.985,199.537 -47.306,181.951c-45.609,-13.086 40.911,-132.171 26.071,-269.707c-0.525,-4.863 1.912,-65.089 2.141,-70.747c-13.821,-47.07 -1.477,-51.425 -29.245,-91.211c-31.993,-45.84 -25.888,-167.335 -47.19,-88.5c-17.558,64.978 -52.42,56.605 -48.152,171.458c-24.023,82.226 -25.294,83.425 -4.788,166.844c7.167,29.157 -10.35,32.729 6.602,56.905c1.013,1.444 15.698,54.595 15.452,59.548c-2.105,42.398 -39.739,58.065 -45.315,60.386c-11.217,4.669 1.581,43.227 -42.674,35.984c-65.253,-10.679 -3.151,-38.945 0.087,-88.048c-10.84,-81.505 7.11,-106.915 -24.046,-204.446c-15.549,-48.673 -8.529,-49.156 -9.592,-99.827c-3.86,-115.983 -33.994,-110.128 -48.033,-225.294c-0.817,-6.698 -3.322,-4.673 -18.62,-10.83l4.439,-4.832c18.707,-1.736 9.591,-9.032 8.645,-9.422c-1.609,-0.665 -11.796,-4.877 -21.145,5.17l-4.206,3.768c-18.656,-6.553 -18.074,-9.694 -37.418,-5.259c-2.805,0.643 -5.986,-0.876 1.351,-35.949c3.862,-1.016 7.725,-2.032 11.587,-3.047c2.858,-3.019 25.592,-27.03 2.936,-51.886c20.934,-48.69 -36.277,-55.112 -5.89,-98.847c5.429,-7.814 29.225,-25.995 -1.694,-21.434c-16.72,2.467 -15.375,-1.919 -27.242,-14.603c-53.152,-70.918 -3.683,-78.443 -4.868,-123.332c-0.337,-12.776 -6.906,-11.886 -19.992,-158.504c-0.166,-1.857 -0.64,-1.603 -8.647,-21.638c-0.283,-6.541 -0.566,-13.081 -0.849,-19.622c29.367,-74.025 29.049,-86.508 -1.038,-95.613c-3.613,-1.094 -53.045,-47.613 -37.407,-65.252c64.036,22.148 69.988,41.002 99.991,10.642c17.618,-17.828 80.822,16.451 89.409,-45.709c0.361,-2.615 -6.621,-1.374 -4.003,-32.76c17.536,-32.667 28.572,-31.985 16.435,-67.46c14.519,-47.957 19.475,-46.779 75.193,-76.963c3.19,-2.219 15.472,-1.689 2.34,-18.545c28.255,-20.572 7.169,-62.701 5.181,-71.227c4.619,-22.645 8.12,-73.231 -5.438,-74.045c-47.547,-2.856 -48.222,0.323 -59.522,-3.253c-7.535,-12.76 3.262,-9.297 17.89,-10.33c54.379,-1.494 55.637,-3.253 96.841,-39.383c60.018,-9.262 51.623,31.72 111.733,33.756c4.288,0.145 4.094,0.507 53.57,2.474c2.662,6.495 2.399,7.362 -3.863,10.183c-4.874,0.063 -4.081,-0.595 -8.18,-0.542c-4.009,0.052 -3.711,0.081 -50.101,1.1c-26.14,5.333 -12.352,65.377 -26.222,112.698c-38.102,14.883 -17.976,31.174 16.916,52.467c14.524,8.864 14.01,8.055 29.194,16.784c34.721,26.582 31.052,30.339 34.638,60.82c0.313,2.659 4.618,39.225 16.391,29.173c9,-7.708 -17.294,-20.221 2.218,-55.15c2.131,-3.814 5.894,-263.629 6.262,-274.026c3.772,-106.444 2.948,-105.729 5.085,-212.445c3.239,-133.571 2.614,-132.835 5.308,-266.766c5.604,-287.223 2.672,-292.564 10.113,-292.628c7.213,-0.062 5.139,5.188 2.144,271.867Z"
        />
      </div>

      {/* SVG Background - Don2 */}
      <div className="h-200 w-200 md:h-300 md:w-300 absolute top-[305vw] md:top-400 translate-x-[-35vw] md:translate-x-[12vw]  z-0">
        <img
          src="/Don2.svg"
          alt="Don Quijote 2"
          className="h-full w-full text-red-800/14"
        />
      </div>

      {/* Content below hero - for scrolling */}
      <div className="relative pt-16 md:pt-40 lg:pt-50 z-10">
        <div className="flex gap-4 md:gap-12 lg:gap-15">
          <div className="vignette-container h-62 md:h-96 lg:h-120 aspect-3/5 ms-6 md:ms-16 lg:ms-50">
            <img
              src="/20260704_184003.webp"
              alt="Plato fino"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="">
            <p className="font-sans tracking-widest text-base md:text-xl lg:text-xl">
              Exelencia
            </p>
            <p className="font-sans tracking-widest mt-4 md:mt-12 lg:mt-20 w-24 md:w-32 lg:w-30 text-xs/8 md:text-sm/9 lg:text-sm/14">
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
          <div className="vignette-container h-52 md:h-96 lg:h-120 aspect-square">
            <img
              src="/_QJT1440.webp"
              alt="Plato fino"
              className="w-full h-full object-cover"
            />
          </div>
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
            <div className="vignette-container w-40 md:w-56 lg:w-fit md:h-96 lg:h-120 aspect-3/5 ms-4 md:ms-12 lg:ms-20">
              <img
                src="/20260621_.webp"
                alt="Copa de vino"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-end mt-10 md:mt-0">
            <div className=" w-full flex justify-end">
              <p className="font-sans tracking-widest mt-4 md:mt-10 lg:mt-11 mb-10 md:mb-24 lg:mb-50 w-40 md:w-52 lg:w-50 text-end text-xs/8 md:text-sm/9 lg:text-sm/14">
                El maridaje perfecto para coronar una velada verdaderamente
                inolvidable
              </p>
            </div>
            <div className="vignette-container h-60 md:h-96 lg:h-120 aspect-square self-end">
              <img
                src="/20260708_154439.webp"
                alt="Cava"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
