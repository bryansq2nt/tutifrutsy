// page.tsx in items/[item] folder
import { getProduct } from "@/app/data/database"
import { notFound } from "next/navigation"
import ItemView from "./ItemView"

interface Params {
  item: string;
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<Params> 
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.item;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ItemView product={product} />
      </div>
    </div>
  );
}