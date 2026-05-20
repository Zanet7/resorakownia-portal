export const dynamic = "force-dynamic";

import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) {
    notFound();
  }

  // Musimy przerobić ewentualne Decimale na zwykłe cyfry/łańcuchy przed przekazaniem do Client Componentu
  const plainProduct = {
    ...product,
    price: Number(product.price)
  };

  return (
    <ProductForm 
      initialData={plainProduct}
      categories={categories}
      brands={brands}
      actionFn={updateProduct} 
      title="Edytuj produkt" 
      subtitle="Wprowadź zmiany w szczegółach produktu i zapisz, aby uaktualnić ofertę w sklepie." 
    />
  );
}
