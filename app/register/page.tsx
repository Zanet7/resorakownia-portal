"use client";

import { useState } from "react";
import { registerAdmin } from "./actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const result = await registerAdmin(formData);
    if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Rejestracja konta</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form action={onSubmit} className="flex flex-col space-y-4">
        <input
          name="email"
          type="email"
          required
          className="border p-2 rounded"
          placeholder="Adres email"
        />
        <input
          name="password"
          type="password"
          required
          className="border p-2 rounded"
          placeholder="Hasło"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition"
        >
          Zarejestruj się
        </button>
      </form>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Masz już konto?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
  );
}
