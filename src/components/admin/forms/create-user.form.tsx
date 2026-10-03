'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

import createUserSchema from '@/components/admin/schemas/create-user.schema';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
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
import { CREATE_USER, GET_USER_BY_ID, UPDATE_USER } from '@/lib/api-constants';
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload';
import { cn } from '@/lib/utils';
import { apiErrorMessage, queryKeys, useApiQuery } from '@/lib/query';
import { API } from '@/services';


const genders = [
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

const roles = [
  {
    key: 'ADMIN',
    value: 'Quản trị viên',
  },
  {
    key: 'CAROWNER',
    value: 'Chủ xe',
  },
  {
    key: 'TRAVELER',
    value: 'Người thuê xe',
  },
];

export function CreateUserForm({ slug }: { slug: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const isNew = slug === 'new';
  const { data: user } = useApiQuery<any>(queryKeys.user(slug), `${GET_USER_BY_ID}/${Number(slug)}`, undefined, {
    enabled: !isNew,
  });
  // Ảnh vừa chọn (xem trước) hoặc ảnh hiện tại của người dùng
  const avatarPreview = avatarSrc ?? user?.avatarUrl;

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: z.infer<typeof createUserSchema>) {
    setIsLoading(true);
    try {
      // Ảnh mới được upload thẳng lên Cloudinary, backend chỉ nhận URL (không còn gửi base64 nặng)
      const avatarUrl = selectedImage
        ? await uploadImageToCloudinary(selectedImage, 'rental-cars-cloudinary/avatars')
        : undefined;

      const payload = {
        ...values,
        avatarUrl,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : undefined,
      };

      if (slug === 'new') {
        await API.post(CREATE_USER, payload);
        toast.success('Tạo người dùng thành công!');
      } else {
        await API.patch(UPDATE_USER + `/${Number(slug)}`, payload);
        toast.success('Cập nhật người dùng thành công!');
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      router.push('/admin/users');
    } catch (error: any) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  // Nạp dữ liệu vào form khi tải xong
  useEffect(() => {
    if (isNew) {
      form.reset({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: new Date(),
        avatarUrl: '',
        role: '',
      });
    } else if (user) {
      form.reset({
      name: user.name,
      username: user.username,
      password: '',
      email: user.email,
      phone: user.phone || '',
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      avatarUrl: '',
      role: user.role,
    });
    }
  }, [isNew, user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center justify-center gap-1">
              <div className="h-28 w-28 overflow-hidden bg-slate-100">
                {avatarPreview && (
                  <Image
                    src={avatarPreview}
                    alt="avatar"
                    width={112}
                    height={112}
                  />
                )}
              </div>
              <FormLabel className="block w-28 cursor-pointer rounded border border-gray-200 px-3 py-2 text-center active:scale-95">
                Chọn Avatar
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      // Xem trước bằng object URL thay vì đọc cả file thành base64
                      setAvatarSrc(URL.createObjectURL(file));
                    }
                    field.onChange(e);
                  }}
                  required={false}
                />
              </FormControl>
              <FormDescription className="text-xs"></FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Chúng tôi khuyến khích bạn sử dụng tên thật của mình.
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên tài khoản</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Tên tài khoản dùng để đăng nhập. (*yêu cầu: chữ thường, viết
                liền, không dấu)
              </FormDescription>
              <FormMessage className="text-xs" />
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
                <Input {...field} type="password" />
              </FormControl>
              <FormDescription className="text-xs"></FormDescription>
              <FormMessage className="text-xs" />
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
                <Input {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Các thông báo quan trọng sẽ được gửi đến địa chỉ email này.
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="text-xs"></FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input {...field} required={false} />
              </FormControl>
              <FormDescription className="text-xs">
                Các thông báo quan trọng sẽ được gửi đến địa chỉ email này.
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ngày sinh</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), 'dd/MM/yyyy')
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Giới tính</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[240px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? genders.find((gender) => gender.key === field.value)
                            ?.value
                        : 'Chọn giới tính'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm..." />
                    <CommandEmpty>Không tìm thấy</CommandEmpty>
                    <CommandGroup>
                      {genders.map((gender) => (
                        <CommandItem
                          value={gender.key}
                          key={gender.key}
                          onSelect={() => {
                            form.setValue('gender', gender.key);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              gender.key === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {gender.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Loại tài khoản</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[240px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? roles.find((role) => role.key === field.value)?.value
                        : 'Chọn vai trò'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm..." />
                    <CommandEmpty>Không tìm thấy</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role) => (
                        <CommandItem
                          value={role.key}
                          key={role.key}
                          onSelect={() => {
                            form.setValue('role', role.key);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              role.key === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {role.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Button type="submit" className="px-8" isLoading={isLoading}>
            {slug === 'new' ? 'Tạo' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
