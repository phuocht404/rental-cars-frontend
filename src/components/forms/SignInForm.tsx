'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
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
import { CookiesStorage } from '@/config/cookie';
import { AUTH_SIGNIN } from '@/lib/api-constants';
import { signInSchema } from '@/schemas';
import { setTokens, setUser } from '@/stores/reducers/authReducer';

import { API } from '../../services';

export function SignInFrom() {
  const dispatch = useDispatch();
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
      const { data } = await API.post(AUTH_SIGNIN, values);

      dispatch(setUser(data?.user));
      dispatch(setTokens(data?.tokens.accessToken));

      localStorage.setItem('user', JSON.stringify(data?.user));

      // set token to cookie storage
      CookiesStorage.setCookieData('accessToken', data?.tokens.accessToken);
      CookiesStorage.setCookieData('role', data?.user?.role);

      if (data?.user.role === 'TRAVELER' || data?.user.role === 'CAROWNER') {
        router.push('/');
        toast.success('Đăng nhập thành công!!!');
      } else if (data?.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
        toast.success('Đăng nhập thành công!!!');
      } else {
        toast.error('Có lỗi đã xảy ra!!');
      }
      setIsLoading(false);
    } catch (error: any) {
      if (error?.statusCode === 401) {
        toast.error(error?.error, {
          description: 'Tài khoản hoặc mật khẩu không chính xác!!!',
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
