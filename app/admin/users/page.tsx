import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, ArrowLeft, Shield, User as UserIcon } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">Brak dostępu — nie jesteś zalogowany</p>
        </div>
      </div>
    );
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="p-10 flex justify-center">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-500">Brak dostępu — brak roli ADMIN</p>
        </div>
      </div>
    );
  }

  // Pobranie użytkowników z bazy zapakowanych w tabelę
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Zarządzanie użytkownikami</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 mt-4">
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="py-4 px-6 w-16">Profil</th>
                  <th className="py-4 px-6">Użytkownik</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Rola</th>
                  <th className="py-4 px-6">Data założenia konta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                       <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-indigo-400" />
                          )}
                       </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{u.username || "Brak nazwy"}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">{u.id.substring(0, 8)}...</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        u.role === "ADMIN"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                     {new Date(u.createdAt).toLocaleDateString("pl-PL", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                     })}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                   <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                           <Users className="w-8 h-8 text-gray-300" />
                         </div>
                         <h3 className="text-lg font-medium text-gray-900 mb-1">Brak użytkowników</h3>
                         <p className="text-gray-500">Baza danych jest pusta.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
