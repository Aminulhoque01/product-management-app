import Login from '@/components/Pages/Auth/Login/Login';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Login | product-management-app',
  description: 'This is the login page for our application',
  keywords: ['login', 'page', 'example'],
};

const LoginPage = () => {
  
  return <Login />;
};

export default LoginPage;

