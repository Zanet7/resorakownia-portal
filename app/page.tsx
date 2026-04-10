import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="bg-[url('/hero.jpg')] bg-cover bg-center h-[60vh] flex items-center justify-center text-white">
        <div className="bg-black/60 p-10 rounded-xl text-center">
          <h1 className="text-5xl font-bold">Resorakownia</h1>
          <p className="mt-4 text-xl">
            Sklep, aukcje i społeczność kolekcjonerów modeli aut
          </p>

          <div className="mt-6 flex gap-6 justify-center">
            <Link
              href="/sklep"
              className="bg-yellow-500 px-6 py-3 rounded text-black font-semibold"
            >
              Przejdź do sklepu
            </Link>

            <Link
              href="/aukcje"
              className="bg-white px-6 py-3 rounded text-black font-semibold"
            >
              Zobacz aukcje
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10">
        <ModuleCard
          title="Kolekcjonerstwo"
          desc="Poradniki, galerie i inspiracje."
          href="/kolekcjonerstwo"
        />
        <ModuleCard
          title="Sklep"
          desc="Wyselekcjonowane modele aut."
          href="/sklep"
        />
        <ModuleCard
          title="Społeczność"
          desc="Forum i wymiana doświadczeń."
          href="/spolecznosc"
        />
        <ModuleCard
          title="Aukcje"
          desc="Licytacje unikalnych modeli."
          href="/aukcje"
        />
      </section>
    </div>
  );
}

function ModuleCard({ title, desc, href }) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
    >
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{desc}</p>
    </Link>
  );
}
