'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  apiErrorMessage,
  useUpdateProfile,
} from '@/components/profile/use-update-profile';
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

const schemas = {
  phone: z.object({
    value: z.string().trim().regex(/^\+?\d{9,14}$/, 'Số điện thoại không hợp lệ'),
  }),
  email: z.object({
    value: z.string().trim().email('Email không hợp lệ'),
  }),
};

const EditUserInfoForm = ({
  label,
  name,
  data,
  onSuccess,
}: {
  label: string;
  name: 'phone' | 'email';
  data?: string | null;
  onSuccess?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateProfile = useUpdateProfile();

  const form = useForm<{ value: string }>({
    resolver: zodResolver(schemas[name]),
    defaultValues: { value: data ?? '' },
  });

  async function onSubmit({ value }: { value: string }) {
    setIsLoading(true);
    try {
      await updateProfile({ [name]: value });
      toast.success(`Cập nhật ${label} thành công`);
      onSuccess?.();
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{label}:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type={name === 'email' ? 'email' : 'tel'}
                  autoComplete={name === 'email' ? 'email' : 'tel'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Cập nhật
        </Button>
      </form>
    </Form>
  );
};

export default EditUserInfoForm;
