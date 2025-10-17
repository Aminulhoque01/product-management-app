
import Products from '@/components/Pages/product/product';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login | product-management-app',
  description: 'This is the login page for our application',
  keywords: ['login', 'page', 'example'],
};

const ProductPage = () => {
  
  return <Products />;
};

export default ProductPage;
