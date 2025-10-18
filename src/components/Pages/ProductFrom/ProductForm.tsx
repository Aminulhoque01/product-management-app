'use client';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '@/lib/validation';
import { createProduct, updateProduct } from '../../../redux/features/product/productsSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import { Category } from '@/types/types';
import { AppDispatch } from '@/redux/store';
 

interface Props {
  categories: Category[];
  initialData: Partial<ProductFormData>;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ categories, initialData, onSuccess, mode, productId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isEdit = mode === 'edit';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormData>,
    defaultValues: initialData,
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      if (isEdit && productId) {
        await dispatch(updateProduct({ id: productId, ...data }));
        toast.success('Updated successfully');
      } else {
        await dispatch(createProduct(data));
        toast.success('Created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">{isEdit ? 'Edit' : 'Create'} Product</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input {...register('name')} className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price * ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className={`w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-primary ${errors.price ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select 
            {...register('categoryId')} 
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary ${errors.categoryId ? 'border-red-500' : ''}`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <textarea {...register('description')} rows={3} className="w-full pl-10 pt-3 border rounded-md focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input {...register('images')} type="url" className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-primary" placeholder="https://example.com/image.jpg" />
          </div>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}