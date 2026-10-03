'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AUTH_SIGNUP } from '@/lib/api-constants';
import { signUpSchema } from '@/schemas';
import { API } from '@/services';

export function SignUpFrom() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    /// Check if passwords match here and set error if they don't
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Mật khẩu không khớp',
      });

      form.setError('password', {
        type: 'manual',
        message: 'Mật khẩu không khớp',
      });
    } else {
      try {
        const { data } = await API.post(AUTH_SIGNUP, values);

        if (data) {
          setIsLoading(false);
          toast.success('Đăng ký thành công!!!');
          router.push('/signin');
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Đăng ký thất bại!!!');
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tài khoản</FormLabel>
              <FormControl>
                <Input placeholder="Tài khoản..." {...field} />
              </FormControl>
              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email..." {...field} />
              </FormControl>
              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <div className="relative flex items-center justify-between">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu..."
                    {...field}
                    className="pr-9"
                  />
                  {showPassword ? (
                    <button
                      type="button"
                      aria-label="Hiện hoặc ẩn mật khẩu"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                    >
                      <Eye size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Hiện hoặc ẩn mật khẩu"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                    >
                      <EyeOff size={18} />
                    </button>
                  )}
                </div>
              </FormControl>

              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <div className="relative flex items-center justify-between">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu..."
                    {...field}
                    className="pr-9"
                  />
                  {showConfirmPassword ? (
                    <button
                      type="button"
                      aria-label="Hiện hoặc ẩn mật khẩu"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                    >
                      <Eye size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      aria-label="Hiện hoặc ẩn mật khẩu"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                    >
                      <EyeOff size={18} />
                    </button>
                  )}
                </div>
              </FormControl>

              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
