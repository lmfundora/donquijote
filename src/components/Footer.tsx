import { Separator } from "#/components/ui/separator";

export default function Footer() {
  return (
    <footer className="Text-text-dark px-6 md:px-12 lg:px-25 mt-20">
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
            <h3 className="font-sans tracking-widest text-lg mb-4">Contact</h3>
            <p className="font-sans tracking-wider text-sm">+45 40277203</p>
            <p className="font-sans tracking-wider text-sm">
              hello@selmacopenhagen.dk
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-sans tracking-widest text-lg mb-4">Horarios</h3>
            <div className="mb-4">
              <p className="font-sans tracking-wider text-sm font-semibold">
                Cena
              </p>
              <p className="font-sans tracking-wider text-sm">Todos los días</p>
              <p className="font-sans tracking-wider text-sm">18:30-23:00</p>
            </div>
            <div>
              <p className="font-sans tracking-wider text-sm font-semibold">
                Almuerzo
              </p>
              <p className="font-sans tracking-wider text-sm">Todos los días</p>
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
  );
}
