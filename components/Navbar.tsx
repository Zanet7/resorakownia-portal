export default function Navbar() {
  return (
    <header className="w-full h-20 border-b border-gray-200 bg-white flex items-center justify-between px-10">
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="Resorakownia logo" className="h-12 w-auto" />
      </a>

      <nav className="flex items-center gap-8 text-[16px] font-medium text-gray-900">
        <a href="/sklep" className="hover:text-gray-600 transition">Sklep</a>
        <a href="/aukcje" className="hover:text-gray-600 transition">Aukcje</a>
        <a href="/kolekcjonerstwo" className="hover:text-gray-600 transition">Kolekcjonerstwo</a>
        <a href="/spolecznosc" className="hover:text-gray-600 transition">Społeczność</a>
        <a href="/login" title="Zaloguj się" className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition text-decoration-none">
          <span className="text-xl">👤</span>
        </a>
      </nav>
    </header>
  );
}