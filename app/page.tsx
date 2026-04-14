export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="w-full h-20 border-b border-gray-200 bg-white flex items-center justify-between px-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Resorakownia logo" className="h-12 w-auto" />
        </div>

        <nav className="flex items-center gap-8 text-[16px] font-medium">
          <a href="/sklep" className="hover:text-gray-600 transition">Sklep</a>
          <a href="/aukcje" className="hover:text-gray-600 transition">Aukcje</a>
          <a href="/kolekcjonerstwo" className="hover:text-gray-600 transition">Kolekcjonerstwo</a>
          <a href="/spolecznosc" className="hover:text-gray-600 transition">Społeczność</a>
          <a href="/register" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-decoration-none">
            <span className="text-xl">👤</span>
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-6xl font-semibold leading-tight">Resorakownia</h1>
          <p className="text-2xl text-gray-600 mt-4">Małe auta. Wielka pasja.</p>

          <div className="flex gap-4 mt-10">
            <a
              href="/sklep"
              className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-sm hover:bg-orange-600 transition"
            >
              Przeglądaj sklep
            </a>

            <a
              href="/spolecznosc"
              className="border border-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-100 transition"
            >
              Dołącz do społeczności
            </a>
          </div>
        </div>

        <div>
          <div className="w-full h-[380px] bg-gray-100 rounded-3xl shadow-sm overflow-hidden">
            {/* Podmień na swoje zdjęcie */}
            <img
              src="/fot.jpg"
              alt="Modele aut"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* MODUŁY */}
      <section className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          { title: "Sklep", desc: "Kupuj modele aut i akcesoria.", link: "/sklep" },
          { title: "Aukcje", desc: "Licytuj unikatowe modele.", link: "/aukcje" },
          { title: "Kolekcjonerstwo", desc: "Zarządzaj swoją kolekcją.", link: "/kolekcjonerstwo" },
          { title: "Społeczność", desc: "Dołącz do pasjonatów.", link: "/spolecznosc" },
        ].map((m) => (
          <a
            key={m.title}
            href={m.link}
            className="border border-gray-200 rounded-2xl p-8 hover:shadow-md transition bg-white"
          >
            <h3 className="text-2xl font-semibold">{m.title}</h3>
            <p className="text-gray-600 mt-2">{m.desc}</p>
            <p className="text-blue-600 font-medium mt-4">Przejdź →</p>
          </a>
        ))}
      </section>

      {/* NOWOŚCI ZE SKLEPU */}
      <section className="max-w-7xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-semibold mb-8">Nowości ze sklepu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
            >
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4"></div>
              <h3 className="text-lg font-medium">Model samochodu #{i}</h3>
              <p className="text-xl font-semibold mt-1">49,99 zł</p>
              <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                Zobacz
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SPOŁECZNOŚĆ */}
      <section className="max-w-7xl mx-auto px-10 py-20">
        <h2 className="text-3xl font-semibold mb-8">Społeczność</h2>

        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-full h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>

        <a
          href="/spolecznosc"
          className="mt-10 inline-block border border-gray-300 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-100 transition"
        >
          Dołącz do społeczności
        </a>
      </section>

      {/* STOPKA */}
      <footer className="w-full bg-gray-50 border-t border-gray-200 mt-20 py-10 px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="/logo.png" alt="Resorakownia logo" className="h-12 w-auto" />
          <p className="text-gray-500 text-sm">© 2026 Resorakownia</p>
        </div>
      </footer>
    </main>
  );
}
