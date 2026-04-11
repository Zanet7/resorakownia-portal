"use client";

import { useState } from "react";

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function submit() {
    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ name, price }),
    });

    window.location.href = "/admin";
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Dodaj produkt</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Nazwa"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Cena"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Zapisz
      </button>
    </div>
  );
}