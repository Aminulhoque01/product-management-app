/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '@/types/types';

interface ProductsState {
  items: Product[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  filterCategoryId: string | null;
  loading: boolean;
  error: string | null;
  selectedProduct?: Product | null;  
}

const initialState: ProductsState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  searchTerm: '',
  filterCategoryId: null,
  loading: false,
  error: null,
  selectedProduct: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch all products (up to 50)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState() as { auth: { token: string | null } };
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data as Product[]; // Array of products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch single by slug
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug: string, { getState, rejectWithValue }) => {
    const { auth } = getState() as { auth: { token: string | null } };
    try {
      const response = await axios.get(`${API_URL}/products/${slug}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// Create
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: { name: string; description?: string; images?: string[]; price: number; categoryId: string }, { getState, rejectWithValue, dispatch }) => {
    const { auth } = getState() as { auth: { token: string | null } };
    try {
      const payload = {
        ...product,
        images: product.images || [],
      };
      const response = await axios.post(`${API_URL}/products`, payload, {
        headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      });
      dispatch(fetchProducts()); // Invalidate cache
      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update (partial)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...updates }: { id: string } & Partial<Omit<Product, 'id' | 'category'>>, { getState, rejectWithValue, dispatch }) => {
    const { auth } = getState() as { auth: { token: string | null } };
    try {
      const payload = { ...updates, images: updates.images || [] };
      const response = await axios.put(`${API_URL}/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      });
      dispatch(fetchProducts()); // Invalidate
      return response.data as Product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete (simulated)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { getState, rejectWithValue, dispatch }) => {
    const { auth } = getState() as { auth: { token: string | null } };
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      dispatch(fetchProducts()); // Invalidate
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterCategoryId: (state, action: PayloadAction<string | null>) => {
      state.filterCategoryId = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Client-side totalPages (assume 50 max, limit 10)
        state.totalPages = Math.ceil(action.payload.length / 10);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        // Optional: add to items if fetched
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export const { setSearchTerm, setFilterCategoryId, setCurrentPage, setSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;