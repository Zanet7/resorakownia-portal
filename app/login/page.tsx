"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { getUserRole } from "./actions";

export default function LoginPage() {
  const supabase = supabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Błąd logowania: " + error.message);
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
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Logowanie</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Hasło"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Zaloguj
      </button>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Nie posiadasz jeszcze konta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Zarejestruj się
          </a>
        </p>
      </div>
    </div>
  );
}
