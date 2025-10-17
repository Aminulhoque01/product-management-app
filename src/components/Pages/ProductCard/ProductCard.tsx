/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Image from 'next/image';
import { Product } from '@/types/types';
import { Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { deleteProduct } from '../../../redux/features/product/productsSlice';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleDelete = async () => {
    if (!confirm('Are you sure? (Simulated delete)')) return;
    try {
      await dispatch(deleteProduct(product.id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const imageSrc = product.images[0] || '/placeholder.jpg'; // Add placeholder in public/

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Image src={imageSrc} alt={product.name} width={200} height={150} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-accent mb-1">${product.price}</p>
      <p className="text-gray-600 mb-4">{product.category.name}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => router.push(`/products/${product.slug}`)}
          className="text-primary hover:text-blue-600"
          title="View Details"
        >
          <Edit3 size={20} />
        </button>
        {token && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700" title="Delete">
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}