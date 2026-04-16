import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Gavel, PackageSearch, Users, Star, Car } from "lucide-react";

export default async function Home() {
  // Pobieramy 3 najnowsze produkty ze sklepu na stronę główną
  const latestProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 pb-20 pt-24 lg:pt-32">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-400/20 blur-[120px] rounded-full point-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full point-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-medium text-sm mb-6 border border-orange-100">
              <Star className="w-4 h-4 fill-orange-500" />
              <span>Największy rynek modeli kolekcjonerskich w Polsce</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Małe auta.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">Wielka pasja.</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Odkryj limitowane edycje, uzupełnij swoją gablotę lub sprzedaj unikatowe perełki. Dołącz do społeczności Resorakowni.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/sklep"
                className="group inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl shadow-black/10 hover:bg-gray-900 hover:scale-[1.02] transition-all duration-300"
              >
                Przeglądaj sklep
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/spolecznosc"
                className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Dołącz do forum
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-4">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Zarejestrowanych fanów</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-[2.5rem] rotate-3 scale-105 opacity-20 blur-xl"></div>
            <div className="aspect-[4/3] rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/50 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=1200"
                alt="Bogata gablota z modelami samochodów"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Nowy egzemplarz</p>
                <p className="font-bold text-gray-900">Lamborghini Miura</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE MODULES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Wszystko dla kolekcjonerów</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Zaprojektowaliśmy portal od podstaw tak, aby połączyć kupowanie, wymianę i rozmowy o samochodach w jedno.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Sklep", 
              desc: "Oficjalna oferta rarytasów.", 
              link: "/sklep", 
              icon: ShoppingCart,
              color: "bg-blue-50 text-blue-600 border-blue-100" 
            },
            { 
              title: "Aukcje", 
              desc: "Licytuj od złotówki i wygrywaj perełki.", 
              link: "/aukcje", 
              icon: Gavel,
              color: "bg-orange-50 text-orange-600 border-orange-100" 
            },
            { 
              title: "Twoja Kolekcja", 
              desc: "Zarządzaj cyfrową wizytówką garażu.", 
              link: "/kolekcjonerstwo", 
              icon: PackageSearch,
              color: "bg-green-50 text-green-600 border-green-100" 
            },
            { 
              title: "Społeczność", 
              desc: "Chwal się zdobyczami na forum.", 
              link: "/spolecznosc", 
              icon: Users,
              color: "bg-purple-50 text-purple-600 border-purple-100" 
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                href={m.link}
                className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 flex flex-col items-start overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${m.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{m.title}</h3>
                <p className="text-gray-600 mb-6 flex-1">{m.desc}</p>
                <p className="text-black font-semibold flex items-center justify-center w-full bg-gray-50 py-3 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                  Przejdź tam
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* LATEST FROM SHOP */}
      <section className="bg-gray-100/50 py-24 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Gorące nowości w Sklepie</h2>
              <p className="text-lg text-gray-600">Świeżo wprowadzony asortyment - zapraszamy do oglądania.</p>
            </div>
            <Link href="/sklep" className="hidden sm:flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
              Zobacz sklep <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestProducts.length > 0 ? (
              latestProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col group">
                  <div className="relative aspect-square p-6 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={p.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800"} 
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      {p.scale ? `SKALA ${p.scale}` : 'NOWOŚĆ'}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 border-t border-gray-50">
                    <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-1">{p.brand || 'Brak marki'}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 flex-1">{p.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-black text-gray-900">{Number(p.price).toFixed(2)} zł</span>
                      <Link href="/sklep" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                        <ShoppingCart className="w-5 h-5 -ml-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <div className="col-span-3 py-10 text-center">
                    <p className="text-gray-500">Sklep jest obecnie pusty.</p>
                </div>
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Link href="/sklep" className="inline-flex items-center justify-center bg-white border border-gray-300 px-6 py-3 rounded-xl font-medium w-full text-black">
                Pokaż wszystkie
             </Link>
          </div>
        </div>
      </section>

      {/* COMMUNITY MOSAIC */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wide mb-4">
            Galeria sław
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Pasja z całego świata</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Społeczność chwali się swoimi niesamowitymi znaleziskami.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <div className="rounded-2xl bg-gray-200 overflow-hidden md:col-span-2 md:row-span-2 relative group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200" alt="Supercar model - Ferrari" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold text-xl">Użytkownik @Marek99 pokazał Ferrari</span>
            </div>
          </div>
          <div className="rounded-2xl bg-gray-200 overflow-hidden relative group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600" alt="Porsche" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="rounded-2xl bg-gray-200 overflow-hidden relative group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600" alt="Dodge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="rounded-2xl bg-gray-200 overflow-hidden md:col-span-2 relative group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" alt="Skyline" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href="/spolecznosc" className="bg-white text-black px-6 py-2 rounded-full font-bold">Zobacz forum</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/spolecznosc"
            className="inline-block bg-black text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            Zobacz więcej i dołącz do nas
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="Resorakownia logo" className="h-12 md:h-16 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </Link>
          
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <Link href="/sklep" className="hover:text-black">Sklep</Link>
            <Link href="/aukcje" className="hover:text-black">Aukcje</Link>
            <Link href="/regulamin" className="hover:text-black">Regulamin</Link>
          </div>
          
          <p className="text-gray-400 text-sm">© {(new Date()).getFullYear()} Resorakownia. Stworzone dla pasjonatów.</p>
        </div>
      </footer>
    </main>
  );
}
