export const dynamic = "force-dynamic";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default function AdminProductsNewPage() {
  return (
    <ProductForm 
      actionFn={createProduct} 
      title="Nowy produkt" 
      subtitle="Uzupełnij szczegółowe dane produktu, aby ułatwić klientom precyzyjne wyszukiwanie w sklepie." 
    />
  );
}
