"use client";

import { useState } from "react";

export default function NewProductForm() {
  const [name, setName] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    window.location.href = "/admin/products";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="Nazwa produktu"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Zapisz
      </button>
    </form>
  );
}