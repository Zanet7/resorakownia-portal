"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar({ username, isAdmin }: { username?: string | null; isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const { cartCount, setIsCartOpen } = useCart();

  const handleLogout = async () => {
    const supabase = supabaseClient();
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white relative z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Resorakownia logo" className="h-12 md:h-16 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-gray-700">
          <Link href="/sklep" className="hover:text-orange-500 transition-colors">Sklep</Link>
          <Link href="/aukcje" className="hover:text-orange-500 transition-colors">Aukcje</Link>
          <Link href="/kolekcjonerstwo" className="hover:text-orange-500 transition-colors">Kolekcjonerstwo</Link>
          <Link href="/spolecznosc" className="hover:text-orange-500 transition-colors">Społeczność</Link>
        </nav>

        {/* Right side - User & Mobile toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-10 h-10 rounded-full bg-orange-50/50 border border-transparent hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all text-gray-600 flex items-center justify-center focus:outline-none"
            aria-label="Koszyk"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {username ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title="Twoje konto" 
                className="h-10 px-4 gap-2 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all text-gray-600 shadow-sm focus:outline-none"
              >
                <span className="text-sm font-medium whitespace-nowrap">Cześć, {username}!</span>
                <User className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col z-50">
                  <Link 
                    href={isAdmin ? "/admin" : "/dashboard"} 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    {isAdmin ? "Panel admina" : "Twój panel"}
                  </Link>
                  <div className="h-px bg-gray-100 w-full" />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left w-full focus:outline-none"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    Wyloguj się
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              title="Zaloguj się/Panel" 
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all text-gray-600 shadow-sm"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        <div className="flex flex-col p-4 space-y-1 text-center font-semibold text-gray-800">
          <Link href="/sklep" onClick={() => setIsOpen(false)} className="py-3 px-4 hover:bg-orange-50 rounded-xl transition-colors">Sklep</Link>
          <Link href="/aukcje" onClick={() => setIsOpen(false)} className="py-3 px-4 hover:bg-orange-50 rounded-xl transition-colors">Aukcje</Link>
          <Link href="/kolekcjonerstwo" onClick={() => setIsOpen(false)} className="py-3 px-4 hover:bg-orange-50 rounded-xl transition-colors">Kolekcjonerstwo</Link>
          <Link href="/spolecznosc" onClick={() => setIsOpen(false)} className="py-3 px-4 hover:bg-orange-50 rounded-xl transition-colors">Społeczność</Link>
        </div>
      </div>
    </header>
  );
}