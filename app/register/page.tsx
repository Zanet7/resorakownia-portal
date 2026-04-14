"use client";

import { useState } from "react";
import { registerAdmin } from "./actions";
import Link from "next/link";
import { Mail, Lock, UserPlus, Loader2, BadgePlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await registerAdmin(formData);
      if (result && result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
         // Sukces, zakładamy że akcja może sama przekierowywać, jeśli nie...
         // ale zgodnie ze starym kodem akcja prawdopodobnie robi redirect z NextJS'a.
      }
    } catch {
       setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
       setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[40rem] h-[40rem] bg-orange-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[40rem] h-[40rem] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Powrót do sklepu
        </Link>

        {/* Logo Icon */}
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <BadgePlus className="w-8 h-8 text-blue-500" />
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Zostań pasjonatem
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zarejestruj darmowe konto w portalu.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></div>
              {error}
            </div>
          )}

          <form action={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adres e-mail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="twoj@email.com"
                  className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hasło <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Przynajmniej 6 znaków"
                  className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm md:text-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Tworzenie konta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Zarejestruj się bezpłatnie
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
            <p className="text-sm font-medium text-gray-600">
              Masz już u nas konto?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                Zaloguj się
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
