'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import api from "../../features/lib/axiosClient";

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'], // path of error
    },
  );

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    setAvatar(file);
  };

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      console.log('Validation errors:', result.error.flatten());
      const errors = result.error.flatten().fieldErrors;

      Object.values(errors).forEach(messages => {
        if (messages?.[0]) {
          toast.error(messages[0]);
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', form.email);
    formData.append('name', form.name);
    formData.append('password', form.password);

    if (avatar) {
      formData.append('avatar', avatar);
    }

    console.log(formData)

    try {
      await api.post('/users/register', formData);
      toast('Signup successful! Redirecting to login...', { type: 'success' });
      setForm({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
      });
      setAvatar(null);

      router.push('/login?registered=true');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? 'Something went wrong';
        console.log('Signup failed:', message);
        toast(message, { type: 'error' });
      } else {
        console.log('Unexpected error:', error);
      }
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2">
      <ToastContainer />
      <div className="mt-10 w-full max-w-200 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
        <form onSubmit={HandleSubmit}>
          <div className="flex flex-col gap-3">
            <label htmlFor="email">Email</label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="email"
              required
            />

            <label htmlFor="name">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Name"
            />

            <label htmlFor="password">Password</label>
            <Input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="password"
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm password"
              required
            />
          
            <Input accept='image/' name="avatar" onChange={handleFileChange} type="file" placeholder="avatar" />
          </div>

          <Button type="submit">sign up</Button>
        </form>
      </div>
    </div>
  );
}
