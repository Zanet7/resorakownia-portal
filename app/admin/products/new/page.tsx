export const dynamic = "force-dynamic";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsNewPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
    prisma.brand.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
  ]);

  return (
    <ProductForm 
      categories={categories}
      brands={brands}
      actionFn={createProduct} 
      title="Nowy produkt" 
      subtitle="Uzupełnij szczegółowe dane produktu, aby ułatwić klientom precyzyjne wyszukiwanie w sklepie." 
    />
  );
}
