import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 0 && !scrolled && !isTransitioning) {
        // Calculate target position from div
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          setTargetPosition({
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
          });
        }
        setIsTransitioning(true);
        setScrolled(true);
        // Prevent scroll during transition
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);

        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionComplete(true);
          document.body.style.overflow = "";
        }, 700);
      } else if (scrollY <= 0 && scrolled && !isTransitioning) {
        setScrolled(false);
        setTransitionComplete(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled, isTransitioning]);

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
    <main className="relative w-full">
      {/* Background Image - Fixed */}
      <div className="w-screen h-screen overflow-hidden">
        <img
          src="/Gemini_Generated_Image_wzsglbwzsglbwzsg.png"
          alt="Fondo"
          className="w-full h-full object-cover scale-125 translate-x-25"
        />
      </div>

      {/* Vignette Overlay - Fixed */}
      <div className="vinetta w-screen h-screen" />

      {/* Navigation - Fixed */}
      <nav className="absolute top-0 left-0 right-0 tracking-widest flex justify-between px-10 py-8 z-20 font-sans">
        {links.map((l) => (
          <a
            href={l.link}
            className="text-white text-lg font-light hover:opacity-80 transition-opacity cursor-pointer"
          >
            {l.title}
          </a>
        ))}
      </nav>

      {/* Hero Text - Transitions to div position on scroll */}
      <h1
        className={`fixed z-35 font-italianno transition-all duration-700 ease-out ${
          scrolled ? "text-7xl text-text-dark" : "text-9xl text-white"
        } ${transitionComplete ? "opacity-0 pointer-events-none" : ""}`}
        style={{
          left: scrolled ? `${targetPosition.left}px` : "140px",
          top: "40%",
          transform: scrolled ? "translate(-50%, -50%)" : "none",
        }}
      >
        Don Quijote
      </h1>

      {/* Spacer for initial scroll - allows image to be visible first */}
      <div className="h-screen" />

      {/* White Left Panel - Slides up from below when scrolled */}
      <div
        ref={divRef}
        className={`z-30 w-1/2 bg-amber-200 h-screen flex items-center justify-center transition-transform duration-700 ease-out ${
          scrolled
            ? "absolute top-0 left-0 translate-y-0"
            : "translate-y-full absolute bottom-0 left-0"
        }`}
      >
        <h1
          className={`font-italianno text-7xl text-text-dark transition-opacity duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          Don Quijote
        </h1>
      </div>

      {/* Content below hero - for scrolling */}
      <div className="relative z-30 h-[200vh] bg-background" />
    </main>
  );
}
