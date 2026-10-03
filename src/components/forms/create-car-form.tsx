'use client';

import { fuelOptions, transmissionOptions } from '@/components/type/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  CREATE_CAR,
  GET_ALL_FEATURES,
  GET_BRANDS_AND_MODELS,
  GET_CAR_BY_ID,
  UPDATE_CAR,
} from '@/lib/api-constants';
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload';
import { cn } from '@/lib/utils';
import { createCarSchema } from '@/schemas';
import { queryKeys, useApiQuery } from '@/lib/query';
import { API } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  AirVent,
  Baby,
  Bluetooth,
  BoomBox,
  CarTaxiFront,
  Check,
  ChevronsUpDown,
  CloudSun,
  GalleryVerticalEnd,
  GanttChart,
  Gauge,
  Key,
  LifeBuoy,
  LocateFixed,
  Map,
  Shell,
  ShieldCheck,
  ShieldMinus,
  Usb,
  Video,
  View,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const featureOptions = [
  {
    key: 'AIR_CONDITIONING',
    value: 'Điều hòa',
    icon: <AirVent className="size-8 text-foreground" />,
  },
  {
    key: 'RADIO',
    value: 'Radio',
    icon: <BoomBox className="size-8 text-foreground" />,
  },
  { key: 'USB', value: 'USB', icon: <Usb className="size-8 text-foreground" /> },
  {
    key: 'BLUETOOTH',
    value: 'Bluetooth',
    icon: <Bluetooth className="size-8 text-foreground" />,
  },
  {
    key: 'GPS',
    value: 'GPS',
    icon: <LocateFixed className="size-8 text-foreground" />,
  },
  {
    key: 'PARKING_SENSOR',
    value: 'Cảm biến lùi',
    icon: <GalleryVerticalEnd className="size-8 rotate-180 text-foreground" />,
  },
  {
    key: 'CAMERA',
    value: 'Camera',
    icon: <Video className="size-8 text-foreground" />,
  },
  {
    key: 'SUNROOF',
    value: 'Cửa sổ trời',
    icon: <CloudSun className="size-8 text-foreground" />,
  },
  {
    key: 'KEYLESS',
    value: 'Khóa không cần chìa',
    icon: <Key className="size-8 text-foreground" />,
  },
  {
    key: 'AIRBAG',
    value: 'Túi khí',
    icon: <Shell className="size-8 text-foreground" />,
  },
  {
    key: 'AUTO_BRAKE',
    value: 'Phanh tự động',
    icon: <ShieldMinus className="size-8 text-foreground" />,
  },
  {
    key: 'ALARM',
    value: 'Chống trộm',
    icon: <ShieldCheck className="size-8 text-foreground" />,
  },
  {
    key: 'AUTO_WIPER',
    value: 'Gạc mưa tự động',
    icon: <Gauge className="size-8 text-foreground" />,
  },
  {
    key: 'LANE_KEEPING',
    value: 'Giữ làn đường',
    icon: <GanttChart className="size-8 text-foreground" />,
  },
  {
    key: 'BLIND_SPOT',
    value: 'Cảnh báo điểm mù',
    icon: <View className="size-8 text-foreground" />,
  },
  {
    key: 'REAR_TRAFFIC',
    value: 'Cảnh báo xe phía sau',
    icon: <CarTaxiFront className="size-8 text-foreground" />,
  },
  {
    key: 'TIRE_PRESSURE',
    value: 'Cảnh báo áp suất lốp',
    icon: <LifeBuoy className="size-8 text-foreground" />,
  },
  {
    key: 'KID_SEAT',
    value: 'ghế trẻ em',
    icon: <Baby className="size-8 text-foreground" />,
  },
  {
    key: 'MAP',
    value: 'Bản đồ',
    icon: <Map className="size-8 text-foreground" />,
  },
];

export function CreateCarForm({ slug }: { slug: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any[]>([]);
  // Ảnh xem trước khi chọn file mới; chưa chọn thì hiển thị ảnh hiện có của xe
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  // Danh mục hãng/mẫu xe và tính năng ít thay đổi: cache dùng chung giữa các form
  const { data: brandData = [] } = useApiQuery<any[]>(queryKeys.brandsWithModels, GET_BRANDS_AND_MODELS, undefined, {
    staleTime: 10 * 60 * 1000,
  });
  const { data: featuresPage } = useApiQuery<any>(queryKeys.features, GET_ALL_FEATURES, { limit: 100 }, {
    staleTime: 10 * 60 * 1000,
  });
  const features = featuresPage?.data ?? [];
  const queryClient = useQueryClient();
  // Danh sách phường/xã Đà Nẵng (mã 48) gần như không đổi: cache lâu
  const { data: province = {} } = useQuery<any>({
    queryKey: ['provinces', 48],
    queryFn: () => axios.get('https://provinces.open-api.vn/api/p/48?depth=3').then((res) => res.data),
    staleTime: Infinity,
  });
  const isNew = slug === 'new';
  const { data: car } = useApiQuery<any>(queryKeys.car(slug), `${GET_CAR_BY_ID}/${Number(slug)}`, undefined, {
    enabled: !isNew,
  });
  const carImages: string[] = previewImages ?? car?.CarImage ?? [];

  const router = useRouter();

  const form = useForm<z.infer<typeof createCarSchema>>({
    resolver: zodResolver(createCarSchema),
  });

  // Upload song song thẳng lên Cloudinary và chờ tất cả xong
  const uploadImagesToCloud = (files: File[]) =>
    Promise.all(files.map((file) => uploadImageToCloudinary(file, 'rental-cars-cloudinary/cars')));

  const handleUploadImage = (e: any) => {
    const files = e.target.files;
    const filesArray = Array.from(files);

    const imageArr: any[] = [];

    if (filesArray.length < 4) {
      toast.error('Vui lòng chọn tối thiểu 4 ảnh ');
      return;
    }

    filesArray.map((file: any) => {
      if (!file.type.match('image.*')) {
        toast.error('Ảnh không hợp lệ');
        return;
      } else {
        imageArr.push(URL.createObjectURL(file));
        setPreviewImages([...imageArr]);
        form.setValue('images', imageArr);
      }
    });

    setSelectedImage(filesArray);

    return imageArr;
  };

  async function onSubmit(values: z.infer<typeof createCarSchema>) {
    setIsLoading(true);
    try {
      const isNew = slug === 'new';

      if (isNew && selectedImage.length < 4) {
        toast.error('Vui lòng chọn tối thiểu 4 ảnh');
        return;
      }

      // Khi sửa xe mà không chọn ảnh mới thì giữ nguyên ảnh cũ
      const images = selectedImage.length > 0 ? await uploadImagesToCloud(selectedImage) : undefined;
      const address =
        values.ward_name && values.district_name && values.province_name
          ? `${values.ward_name}, ${values.district_name}, ${values.province_name}`
          : undefined;

      const payload = {
        licensePlates: values.licensePlates,
        modelId: values.modelId,
        seats: values.seats,
        yearOfManufacture: values.yearOfManufacture,
        transmission: values.transmission,
        fuel: values.fuel,
        description: values.description,
        features: values.features,
        pricePerDay: Number(values.pricePerDay),
        address,
        images,
      };

      if (isNew) {
        await API.post(CREATE_CAR, payload);
        toast.success('Thêm xe thành công! Xe sẽ hiển thị sau khi được duyệt.');
      } else {
        await API.patch(`${UPDATE_CAR}/${Number(slug)}`, payload);
        toast.success('Cập nhật xe thành công! Xe sẽ được duyệt lại.');
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.myCars });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCars });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCarRegistrations });
      router.push('/mycars');
    } catch (error: any) {
      const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
      toast.error(message || 'Lưu xe thất bại');
    } finally {
      setIsLoading(false);
    }
  }

  // Nạp dữ liệu vào form khi tải xong (form.reset của react-hook-form, không phải setState của React)
  useEffect(() => {
    if (isNew) {
      form.reset({
        images: [],
        licensePlates: '',
        brandId: 0,
        modelId: 0,
        seats: 4,
        yearOfManufacture: new Date().getFullYear(),
        transmission: 'AUTOMATIC_TRANSMISSION',
        fuel: 'GASOLINE',
        description: '',
        features: [],
        pricePerDay: 1000,
      });
    } else if (car) {
      form.reset({
        images: [],
        licensePlates: car.licensePlates,
        brandId: car.brandId,
        modelId: car.modelId,
        seats: car.seats,
        yearOfManufacture: car.yearOfManufacture,
        transmission: car.transmission,
        fuel: car.fuel,
        description: car.description,
        features: car.CarFeature,
        pricePerDay: car.pricePerDay,
      });
    }
  }, [isNew, car, form]);

  useEffect(() => {
    if (province?.name) form.setValue('province_name', province.name);
  }, [province, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center gap-1">
                <div className="flex min-h-36 w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-dashed border-border p-3">
                  {carImages.length > 0 &&
                    carImages.map((image: string) => (
                      <div
                        className="relative size-28 overflow-hidden rounded-lg border border-border bg-muted"
                        key={image}
                      >
                        <Image
                          src={image}
                          alt="Ảnh xe"
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                </div>
                <FormLabel className="block cursor-pointer rounded-lg bg-primary px-8 py-3 text-center text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                  Chọn ảnh (tối thiểu 4 )
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    multiple={true}
                    className="hidden"
                    onChange={(e) => {
                      handleUploadImage(e);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-xs"></FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-2">
          <h2 className="text-xl font-bold">Biển số xe</h2>
          <p className="text-sm text-destructive">
            Lưu ý: Biển số sẽ không thể thay đổi sau khi đăng kí.
          </p>
          <FormField
            control={form.control}
            name="licensePlates"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} disabled={slug !== 'new'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-3 flex flex-col items-start justify-between gap-2">
          <h2 className="text-xl font-bold">Thông tin cơ bản</h2>
          <p className="text-sm text-destructive">
            Lưu ý: Các thông tin cơ bản sẽ không thể thay đổi sau khi đăng kí.
          </p>
          <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-1">
            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Hãng xe</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {field.value
                            ? brandData.find(
                                (brand: any) => brand.id === field.value,
                              ).name
                            : 'Chọn hãng xe'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-[300px] overflow-y-auto p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandEmpty>Không tìm thấy</CommandEmpty>
                          <CommandGroup>
                            {brandData.map((brand: any) => (
                              <CommandItem
                                value={brand.id}
                                key={brand.id}
                                onSelect={() => {
                                  form.setValue('brandId', brand.id);
                                  form.setValue('modelId', 0);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    brand.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {brand.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
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
              name="modelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Mẫu xe</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {/* eslint-disable-next-line react-hooks/incompatible-library -- watch() của react-hook-form chưa hỗ trợ React Compiler */}
                          {form.watch('brandId')
                            ? field.value
                              ? brandData
                                  .find(
                                    (brand: any) =>
                                      brand.id ===
                                      Number(form.getValues('brandId')),
                                  )
                                  .models.find(
                                    (model: any) => model.id === field.value,
                                  )?.name
                              : 'Chọn mẫu xe'
                            : 'Chọn hãng xe trước'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandEmpty>Không tìm thấy</CommandEmpty>
                          <CommandGroup>
                            {form.getValues('brandId') &&
                              brandData
                                .find(
                                  (brand: any) =>
                                    brand.id ===
                                    Number(form.getValues('brandId')),
                                )
                                .models.map((model: any) => (
                                  <CommandItem
                                    value={model.id}
                                    key={model.id}
                                    onSelect={() => {
                                      form.setValue('modelId', model.id);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        model.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {model.name}
                                  </CommandItem>
                                ))}
                          </CommandGroup>
                        </ScrollArea>
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
              name="seats"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Số ghế</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {field.value}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-[300px] overflow-y-auto p-0">
                      <Command>
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandGroup>
                            {Array.from(
                              { length: 17 },
                              (_, index) => index + 4,
                            ).map((seats: number) => (
                              <CommandItem
                                value={seats.toString()}
                                key={seats}
                                onSelect={() => {
                                  form.setValue('seats', Number(seats));
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    seats === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {seats}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
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
              name="yearOfManufacture"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Năm sản xuất</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {field.value}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="h-[300px] overflow-y-auto p-0">
                      <Command>
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandGroup>
                            {Array.from(
                              { length: 64 },
                              (_, index) => index + 1960,
                            ).map((yearOfManufacture: number) => (
                              <CommandItem
                                value={yearOfManufacture.toString()}
                                key={yearOfManufacture}
                                onSelect={() => {
                                  form.setValue(
                                    'yearOfManufacture',
                                    Number(yearOfManufacture),
                                  );
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    yearOfManufacture === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {yearOfManufacture}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
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
              name="transmission"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Loại hộp số</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {field.value
                            ? transmissionOptions.find(
                                (transmission) =>
                                  transmission.key === field.value,
                              )?.value
                            : 'Chọn loại hộp số'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <CommandEmpty>Không tìm thấy</CommandEmpty>
                        <CommandGroup>
                          {transmissionOptions.map((transmission) => (
                            <CommandItem
                              value={transmission.key}
                              key={transmission.key}
                              onSelect={() => {
                                form.setValue('transmission', transmission.key);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  transmission.key === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {transmission.value}
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
              name="fuel"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Loại nhiên liệu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full max-w-[300px] justify-between md:max-w-none',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={slug !== 'new'}
                        >
                          {field.value
                            ? fuelOptions.find(
                                (fuel) => fuel.key === field.value,
                              )?.value
                            : 'Chọn loại hộp số'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <CommandEmpty>Không tìm thấy</CommandEmpty>
                        <CommandGroup>
                          {fuelOptions.map((fuel) => (
                            <CommandItem
                              value={fuel.key}
                              key={fuel.key}
                              onSelect={() => {
                                form.setValue('fuel', fuel.key);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  fuel.key === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {fuel.value}
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
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2">
          <h2 className="text-xl font-bold">Mô tả</h2>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Nhập một đoạn mô tả ngắn ..."
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem className="w-full">
                  <div className="mb-4">
                    <FormLabel className="text-xl font-bold">
                      Tính năng
                    </FormLabel>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-3 lg:grid-cols-2 sm:grid-cols-1">
                    {features.map((item: any) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(item.id);

                          return (
                            <FormItem
                              key={item.id}
                              className="col-span-1 space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  className="hidden"
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel
                                className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-border px-2 py-4 text-center font-normal ${
                                  isChecked ? 'border-success' : ''
                                }`}
                              >
                                {
                                  featureOptions.find(
                                    (feature) => feature.key === item.name,
                                  )?.icon
                                }
                                {
                                  featureOptions.find(
                                    (feature) => feature.key === item.name,
                                  )?.value
                                }
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tinh thanh */}
        <div className="flex flex-col items-start justify-between gap-4">
          <h2 className="text-xl font-bold">Địa chỉ xe</h2>

          <div className="flex w-full items-center justify-between gap-6">
            <FormField
              control={form.control}
              name="province_name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Tỉnh thành</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={true}
                        >
                          {Object.keys(province).length !== 0
                            ? province.name
                            : 'Tỉnh thành'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                  </Popover>
                  <div className="h-4">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district_name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? province.districts.find(
                                (district: any) =>
                                  district.name === field.value,
                              ).name
                            : 'Chọn quận/huyện'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandEmpty>Không tìm thấy</CommandEmpty>
                          <CommandGroup>
                            {province.districts &&
                              province.districts.map((district: any) => (
                                <CommandItem
                                  value={district.name}
                                  key={district.code}
                                  onSelect={() => {
                                    form.setValue(
                                      'district_name',
                                      district.name,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      district.name === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {district.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="h-4">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ward_name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Phường/Xã</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {form.watch('district_name')
                            ? field.value
                              ? province.districts
                                  .find(
                                    (district: any) =>
                                      district.name ===
                                      form.getValues('district_name'),
                                  )
                                  .wards.find(
                                    (ward: any) => ward.name === field.value,
                                  )?.name
                              : 'Chọn phường/xã'
                            : 'Chọn quận/huyện trước'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Tìm..." />
                        <ScrollArea className="max-h-72 rounded-md">
                          <CommandEmpty>Không tìm thấy</CommandEmpty>
                          <CommandGroup>
                            {form.getValues('district_name') &&
                              province.districts
                                .find(
                                  (district: any) =>
                                    district.name ===
                                    form.getValues('district_name'),
                                )
                                .wards.map((ward: any) => (
                                  <CommandItem
                                    value={ward.name}
                                    key={ward.code}
                                    onSelect={() => {
                                      form.setValue('ward_name', ward.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        ward.name === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {ward.name}
                                  </CommandItem>
                                ))}
                          </CommandGroup>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="h-4">
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2">
          <FormField
            control={form.control}
            name="pricePerDay"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="mb-4">
                  <FormLabel className="text-xl font-bold">
                    Đơn giá thuê
                  </FormLabel>
                  <FormDescription className="mt-4">
                    Đơn giá áp dụng cho tất cả các ngày. Bạn có thuể tuỳ chỉnh
                    giá khác cho các ngày đặc biệt (cuối tuần, lễ, tết...) trong
                    mục quản lý xe sau khi đăng kí.
                  </FormDescription>
                  <p className="mt-2">Giá đề xuất: 1000K</p>
                </div>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                      className="w-96"
                    />{' '}
                    K/ngày
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-right">
          <Button type="submit" className="w-44 px-8" isLoading={isLoading}>
            {slug === 'new' ? 'Tạo' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
