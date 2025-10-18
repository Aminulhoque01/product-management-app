"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/store";
import { fetchProductBySlug } from "../../../../../redux/features/product/productsSlice";
import { fetchCategories } from "../../../../../redux/features/categories/categoriesSlice";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/Pages/ProductFrom/ProductForm";

export default function EditProduct() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedProduct, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { items: categories } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
      dispatch(fetchCategories());
    }
  }, [slug, dispatch]);

  if (loading || !selectedProduct)
    return <div className="text-center py-4">Loading...</div>;

  const initialData = {
    name: selectedProduct.name,
    description: selectedProduct.description,
    images: selectedProduct.images || [],

    price: selectedProduct.price,
    categoryId: selectedProduct.category.id,
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="container mx-auto p-4">
        <ProductForm
          categories={categories}
          initialData={initialData}
          onSuccess={() => router.push(`/products/${slug}`)}
          mode="edit"
          productId={selectedProduct.id}
        />
      </div>
    </div>
  );
}
