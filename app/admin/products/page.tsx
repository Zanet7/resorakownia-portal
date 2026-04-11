export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <div>Brak dostępu</div>;

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") return <div>Brak uprawnień</div>;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Produkty</h1>

      <a
        href="/admin/products/new"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Dodaj produkt
      </a>

      <ul className="mt-6 space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-4 rounded">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
