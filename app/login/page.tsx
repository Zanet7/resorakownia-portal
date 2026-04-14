"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { getUserRole } from "./actions";
import Link from "next/link";
import { Mail, Lock, LogIn, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const supabase = supabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Nieprawidłowy email lub hasło.");
      setIsLoading(false);
      return;
    }

    const role = await getUserRole();
    if (role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-orange-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[40rem] h-[40rem] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Powrót do strony głównej
        </Link>

        {/* Logo Icon */}
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-orange-500" />
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Zaloguj się
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          lub{" "}
          <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
            utwórz darmowe konto
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={login}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adres e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="twoj@email.com"
                  className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hasło
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  Zapomniałeś hasła?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm md:text-md text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Logowanie...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Zaloguj do konta
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
