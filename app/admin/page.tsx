import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  ArrowRight,
  Database
} from "lucide-react";

export default async function AdminPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Brak dostępu</h2>
          <p className="text-gray-500 mb-6">Musisz być zalogowany, aby zobaczyć tę stronę.</p>
          <Link href="/login" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-black hover:bg-gray-800 transition-colors">
            Zaloguj się
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Brak uprawnień</h2>
          <p className="text-gray-500 mb-6">Twoje konto nie posiada uprawnień administratora. Skontaktuj się ze wsparciem technicznym, jeśli uważasz to za błąd.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium pb-1 border-b border-blue-600">
            Powrót na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  // Fetch some quick stats
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Panel Administratora</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Wróć do sklepu →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 mt-4 space-y-12">
        {/* Stats Row */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">Przegląd systemu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Package className="w-16 h-16" />
              </div>
              <span className="text-sm font-medium text-gray-500 mb-1">Całkowita liczba produktów</span>
              <span className="text-4xl font-bold text-gray-900 tracking-tight">{productsCount}</span>
              <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Aktywne</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-16 h-16" />
              </div>
              <span className="text-sm font-medium text-gray-500 mb-1">Zarejestrowani użytkownicy</span>
              <span className="text-4xl font-bold text-gray-900 tracking-tight">{usersCount}</span>
              <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                <Users className="w-4 h-4 mr-1" />
                <span>Społeczność z rośnie</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-16 h-16" />
              </div>
              <span className="text-sm font-medium text-gray-500 mb-1">Status bazy danych</span>
              <span className="text-4xl font-bold text-green-500 tracking-tight">Online</span>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
                <span>Wszystkie systemy w normie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">Zarządzanie modułami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Products Card */}
            <Link href="/admin/products" className="group block bg-white rounded-3xl p-1 shrink-0 border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100/50 rounded-[22px] p-8 h-full relative overflow-hidden">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-orange-500 flex items-center justify-center mb-6 z-10 relative">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Produkty i Sklep</h3>
                <p className="text-gray-600 mb-8 relative z-10 pr-10">Zarządzaj asortymentem sklepu. Dodawaj nowe modele resoraków, aktualizuj ceny przedmioty i kontroluj stany magazynowe.</p>
                <div className="flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Zarządzaj produktami <ArrowRight className="ml-2 w-5 h-5" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              </div>
            </Link>

            {/* Users Card */}
            <Link href="/admin/users" className="group block bg-white rounded-3xl p-1 shrink-0 border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 rounded-[22px] p-8 h-full relative overflow-hidden">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-blue-500 flex items-center justify-center mb-6 z-10 relative">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Użytkownicy asortyment</h3>
                <p className="text-gray-600 mb-8 relative z-10 pr-10">Przeglądaj zarejestrowanych klientów, zarządzaj rolami systemowymi i analizuj aktywność społeczności na platformie.</p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Lista użytkowników <ArrowRight className="ml-2 w-5 h-5" />
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
