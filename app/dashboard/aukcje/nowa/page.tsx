import { prisma } from "@/lib/prisma";
import AuctionForm from "@/components/dashboard/AuctionForm";
import { createAuction } from "@/app/aukcje/actions";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewAuctionPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <AuctionForm
      categories={categories}
      brands={brands}
      actionFn={createAuction}
    />
  );
}
