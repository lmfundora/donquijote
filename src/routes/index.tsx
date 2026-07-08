import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 280 && !scrolled) {
        // Calculate target position
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          setTargetPosition({
            top: rect.top + rect.height / 2,
            left: rect.left + rect.width / 2,
          });
        }
        setScrolled(true);
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), 700);
      } else if (scrollY <= 280 && scrolled) {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

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

      {/* Hero Text - Fixed initially, then transitions to div position */}
      <h1
        className={`fixed z-20 font-italianno  transition-all duration-700 ease-out ${
          scrolled ? "text-primary text-7xl z-35" : " text-9xl text-white"
        }`}
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

      {/* White Left Panel - Normal flow, scrolls with content */}
      <div
        ref={divRef}
        className="{`absolute z-30 w-1/2 h-screen bg-background flex items-center justify-center   transition-all duration-700 ease-out ${
        scrolled ? 'translate-y-100' : ''
        }`}"
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
