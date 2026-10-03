'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { OwnerRegistrationSchema } from '@/schemas';
import { API } from '@/services';
import { UPDATE_ROLE_OWNER } from '@/lib/api-constants';





const OwnerRegistrationForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof OwnerRegistrationSchema>>({
    resolver: zodResolver(OwnerRegistrationSchema),
  });

  async function onSubmit(values: z.infer<typeof OwnerRegistrationSchema>) {
    setIsLoading(true);
    try {
      const res = await API.patch(UPDATE_ROLE_OWNER, values);

      if (res.status === 200) {
        toast.success('Đăng ký thành công');
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tên chủ xe:</FormLabel>
              <FormControl>
                <Input placeholder="Tên chủ xe..." {...field} />
              </FormControl>
              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} type="email" />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Số điện thoại:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Số điện thoại..."
                    {...field}
                    type="number"
                  />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="licensePlates"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Biển số xe:</FormLabel>
              <FormControl>
                <Input placeholder="Biển số xe..." {...field} />
              </FormControl>
              <div className="h-4">
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Gửi thông tin đến Rental Cars
        </Button>
      </form>
    </Form>
  );
};

export default OwnerRegistrationForm;
