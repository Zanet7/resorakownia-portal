export const dynamic = "force-dynamic";

import NewProductForm from "@/components/admin/NewProductForm";
import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return <div>Brak dostępu</div>;

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (user?.role !== "ADMIN") return <div>Brak uprawnień</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dodaj produkt</h1>
      <NewProductForm />
    </div>
  );
}
