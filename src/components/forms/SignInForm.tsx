'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { AUTH_SIGNIN } from '@/lib/api-constants';
import { setSession } from '@/lib/auth-client';
import { signInSchema } from '@/schemas';

import { API } from '../../services';

export function SignInFrom() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      // Token được server set vào cookie httpOnly; client chỉ giữ thông tin hiển thị
      const { data } = await API.post(AUTH_SIGNIN, values);

      setSession(data.user);
      toast.success('Đăng nhập thành công!!!');

      // Chỉ cho phép quay lại đường dẫn nội bộ để tránh open redirect
      const callbackUrl = searchParams.get('callbackUrl');
      const safeCallback =
        callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
          ? callbackUrl
          : null;

      router.replace(
        data.user.role === 'ADMIN' ? '/admin/dashboard' : safeCallback || '/',
      );
      router.refresh();
    } catch (error: any) {
      if (error?.statusCode === 401) {
        toast.error('Đăng nhập thất bại', {
          description: error?.message || 'Tài khoản hoặc mật khẩu không chính xác!!!',
        });
      } else {
        toast.error('Đăng nhập thất bại!!!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-1">
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

        <div className="w-full pb-2 pt-1 text-right text-sm">
          <Link
            href="#"
            className="text-primary underline-offset-4 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
