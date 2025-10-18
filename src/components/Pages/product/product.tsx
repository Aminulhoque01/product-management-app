'use client';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchProducts, setCurrentPage, setFilterCategoryId, setSearchTerm } from '../../../redux/features/product/productsSlice';
import { fetchCategories } from '../../../redux/features/categories/categoriesSlice';
 
 
import { Search, Plus, Filter, } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Category } from '@/types/types';
import ProductCard from '../ProductCard/ProductCard';


interface SearchForm {
  search: string;
  categoryId: string | '';
}

const LIMIT = 10;

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: allProducts, currentPage, searchTerm, filterCategoryId, loading } = useSelector((state: RootState) => state.products);
  const { items: categories } = useSelector((state: RootState) => state.categories);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [token, dispatch, router]);

  const { register, handleSubmit, watch } = useForm<SearchForm>({
    defaultValues: { search: searchTerm, categoryId: filterCategoryId || '' },
  });

  const watchedSearch = watch('search');
  const watchedCategoryId = watch('categoryId');

  useEffect(() => {
    dispatch(setSearchTerm(watchedSearch));
    dispatch(setFilterCategoryId(watchedCategoryId || null));
    dispatch(setCurrentPage(1)); // Reset page on search/filter
  }, [watchedSearch, watchedCategoryId, dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterCategoryId) {
      filtered = filtered.filter(p => p.category.id === filterCategoryId);
    }
    return filtered;
  }, [allProducts, searchTerm, filterCategoryId]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * LIMIT;
    return filteredProducts.slice(start, start + LIMIT);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / LIMIT);

  const onSearch = () => {}; // Handled by watch

  if (!token) return   <div>Loading...   </div>;

  return (
    <div className="min-h-screen bg-neutral">
       
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Products ({filteredProducts.length})</h2>
          <button
            onClick={() => router.push('/products/create')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        <form onSubmit={handleSubmit(onSearch)} className="mb-6 space-y-4 md:flex md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              {...register('search')}
              type="text"
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              {...register('categoryId')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </form>

        {loading && <div className="text-center py-4">Loading...</div>}
        {!loading && paginatedProducts.length === 0 && <div className="text-center py-4 text-gray-500">No products found.</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => dispatch(setCurrentPage(page))}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}