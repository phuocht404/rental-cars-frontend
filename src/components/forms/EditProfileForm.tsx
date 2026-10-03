'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { apiErrorMessage, useUpdateProfile } from '@/components/profile/use-update-profile';
import { cn } from '@/lib/utils';
import { editProfileSchema } from '@/schemas/';

const genders: { key: string; value: string }[] = [
  {
    key: 'MALE',
    value: 'Nam',
  },
  {
    key: 'FEMALE',
    value: 'Nữ',
  },
  {
    key: 'OTHER',
    value: 'Khác',
  },
];

const EditProfileForm = ({
  name,
  dateOfBirth,
  gender,
  onSuccess,
}: {
  name?: string | null;
  dateOfBirth?: string | Date | null;
  gender?: string | null;
  onSuccess?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: name ?? '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender: (gender as any) ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    setIsLoading(true);
    try {
      await updateProfile({
        name: values.name,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth
          ? format(values.dateOfBirth, 'yyyy-MM-dd')
          : undefined,
      });
      toast.success('Cập nhật thông tin thành công');
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? format(field.value, 'dd/MM/yyyy')
                        : 'Chọn ngày sinh'}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    fromYear={1940}
                    toYear={new Date().getFullYear()}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'font-base w-full justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? genders.find((item) => item.key === field.value)?.value
                        : 'Chọn giới tính'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandGroup>
                      {genders.map(({ key, value }) => (
                        <CommandItem
                          value={key}
                          key={key}
                          onSelect={() => {
                            form.setValue('gender', key as any);
                          }}
                          className="font-base"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              key === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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

export default EditProfileForm;
