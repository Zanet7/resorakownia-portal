"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Kolekcjonerstwo", href: "/kolekcjonerstwo" },
  { name: "Sklep", href: "/sklep" },
  { name: "Społeczność", href: "/spolecznosc" },
  { name: "Aukcje", href: "/aukcje" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-black text-white px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Resorakownia
      </Link>

      <div className="flex gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:text-gray-300 ${
              pathname.startsWith(item.href) ? "text-yellow-400" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
