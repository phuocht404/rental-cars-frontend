'use client';

import { Button } from '@/components/ui/button';
import { ReviewSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Star } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const ReviewForm = ({
  onSubmit,
}: {
  orderDetailId?: number;
  setIsOpen?: any;
  onSubmit: (values: z.infer<typeof ReviewSchema>) => Promise<void>;
}) => {

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="w-full text-center">
                <FormControl>
                  <div
                    role="radiogroup"
                    aria-label="Số sao đánh giá"
                    className="flex items-center justify-center gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={field.value === star}
                        aria-label={`${star} sao`}
                        onClick={() => field.onChange(star)}
                        className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Star
                          size={28}
                          className={
                            (field.value ?? 0) >= star
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Nhập đánh giá của bạn về chuyến đi..."
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-right">
          <Button type="submit" className="w-44 px-8" isLoading={form.formState.isSubmitting}>
            Đánh giá
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
