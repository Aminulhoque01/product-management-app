/* eslint-disable @typescript-eslint/no-explicit-any */


// 'use client';
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setToken } from '../../../../redux/features/auth/authSlice';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { Mail, LogIn } from 'lucide-react';

// const schema = z.object({
//   email: z.string().email('Invalid email').min(1, 'Email is required'),
// });

// type FormData = z.infer<typeof schema>;

// export default function Login() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: { email: 'aminuhoque53@gmail.com' },
//   });
  
//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, { email: data.email });
//       dispatch(setToken(response.data.token));
//       toast.success('Logged in successfully');
//       router.push('/products');
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6 text-primary">Login</h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Email (from job application)</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 {...register('email')}
//                 type="email"
//                 className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="your-application-email@example.com"
//               />
//             </div>
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             <LogIn size={20} />
//             {loading ? 'Logging in... ' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../../../../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, LogIn } from 'lucide-react';

// Zod schema
const schema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'aminuhoque53@gmail.com' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API URL is not defined');

      const response = await axios.post(`${apiUrl}/auth`, { email: data.email });
      dispatch(setToken(response.data.token));
      toast.success('Logged in successfully');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // prevent SSR mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email (from job application)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your-application-email@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
