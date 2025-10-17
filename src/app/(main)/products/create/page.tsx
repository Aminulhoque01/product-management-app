'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { fetchCategories } from '../../../../redux/features/categories/categoriesSlice';
 
 
import { useRouter } from 'next/navigation';
 

import ProductForm from '@/components/Pages/ProductFrom/ProductForm';

export default function CreateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: categories, loading: catLoading } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (catLoading) return <div className="text-center py-4">Loading categories...</div>;

  return (
    <div className="min-h-screen bg-neutral">
       
      <div className="container mx-auto p-4">
        <ProductForm 
          categories={categories} 
          onSuccess={() => router.push('/products')} 
          mode="create" 
          initialData={{}} 
        />
      </div>
    </div>
  );
}