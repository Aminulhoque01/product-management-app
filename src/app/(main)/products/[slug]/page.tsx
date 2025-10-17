'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store';
import { fetchProductBySlug, deleteProduct } from '../../../../redux/features/product/productsSlice';
 
import Image from 'next/image';
import { Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
 

export default function ProductDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedProduct, loading } = useSelector((state: RootState) => state.products);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
  }, [slug, dispatch]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!selectedProduct) return <div className="text-center py-4">Product not found.</div>;

  const handleDelete = async () => {
    if (!confirm('Are you sure? (Simulated delete)')) return;
    try {
      await dispatch(deleteProduct(selectedProduct.id));
      toast.success('Product deleted');
      router.push('/products');
    } catch (error) {
        console.error(error);
      toast.error('Failed to delete');
    }
  };

  const handleEdit = () => router.push(`/products/edit/${slug}`);

  const imageSrc = selectedProduct.images[0] || '/placeholder.jpg';

  return (
    <div className="min-h-screen bg-neutral">
       
      <div className="container mx-auto p-4 max-w-2xl">
        <Image src={imageSrc} alt={selectedProduct.name} width={400} height={300} className="w-full h-64 object-cover rounded mb-4" />
        <h1 className="text-3xl font-bold mb-4">{selectedProduct.name}</h1>
        <p className="text-accent text-2xl mb-2">${selectedProduct.price}</p>
        <p className="text-gray-600 mb-2">Category: {selectedProduct.category.name}</p>
        <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
        <div className="flex space-x-4">
          <button onClick={handleEdit} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2" disabled={!token}>
            <Edit3 size={20} /> Edit
          </button>
          {token && (
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2">
              <Trash2 size={20} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}