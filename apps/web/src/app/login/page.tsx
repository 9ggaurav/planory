'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import api from "../../features/lib/axiosClient";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function LoginPage() {
  console.log(process.env.API_BASE_URL)
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("registered") === "true"){
      toast.success("Signup successfull. Please log in.")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      console.log('Validation errors: ', result.error.flatten());
      const errors = result.error.flatten().fieldErrors;

      Object.values(errors).forEach(messages => {
        if (messages?.[0]) {
          toast.error(messages[0]);
        }
      });
      return;
    }

    try {
      await api.post('/users/login', {
        email: form.email,
        password: form.password,
      }, { withCredentials: true});

      toast('Login successful! Redirecting to Home...', { type: 'success' });
      setForm({
        email: '',
        password: '',
      });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'Something went wrong';
        console.log('Login failed', message);
        toast(message, { type: 'error' });
      } else {
        console.log('Unexpected error: ', error);
      }
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2">
      <ToastContainer />
      <div className="flex flex-col items-center justify-start w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit">Login</Button>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Dont have an account?{' '}
              <a href="/signup" className="text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
