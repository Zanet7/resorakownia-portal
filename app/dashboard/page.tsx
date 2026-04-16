import { Construction, History, Heart, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Twój Panel | Resorakownia",
};

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { username: true, role: true }
  });

  if (dbUser?.role === "ADMIN") {
    redirect("/admin");
  }

  const username = dbUser?.username || "Kolekcjonerze";

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Powitanie */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6 border-4 border-white shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Witaj w swoim panelu, {username}!
          </h1>
          <p className="text-gray-500 text-lg">
            To jest Twoje osobiste centrum dowodzenia na Resorakowni.
          </p>
        </div>

        {/* Główna sekcja "w budowie" */}
        <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 md:p-12 overflow-hidden border border-gray-100">
          {/* Ozdobny wzór */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-100 rounded-full blur-[80px] opacity-70 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-orange-50 p-4 rounded-2xl mb-6 text-orange-500 ring-1 ring-orange-200 shadow-sm animate-bounce-slow">
              <Construction className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trwają prace nad nowymi funkcjami!
            </h2>
            <p className="text-gray-600 max-w-lg mb-10 leading-relaxed text-[15px]">
              Intensywnie pracujemy nad tym, aby to miejsce było jak najbardziej użyteczne. Wkrótce zobaczysz tutaj swoją historię zakupów oraz z łatwością zarządzisz ulubionymi modelami.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <div className="text-left bg-transparent">
                  <h3 className="font-semibold text-gray-900">Historia zakupów</h3>
                  <p className="text-xs text-gray-500 mt-1">Statusy Twoich zamówień</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-left bg-transparent">
                  <h3 className="font-semibold text-gray-900">Ulubione modele</h3>
                  <p className="text-xs text-gray-500 mt-1">Szybki dostęp do perełek</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/sklep" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all gap-2 w-full sm:w-auto"
              >
                Odkryj modele w sklepie
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
