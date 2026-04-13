"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

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
      alert("Błędny email lub hasło");
      return;
    }

    window.location.href = "/admin";
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
    </div>
  );
}
