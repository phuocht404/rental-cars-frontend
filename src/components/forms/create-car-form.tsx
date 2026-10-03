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
  UPDATE_USER,
} from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { createCarSchema } from '@/schemas';
import { API } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const [carImages, setCarImages] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any>([]);
  const [features, setFeatures] = useState<any>([]);
  const [province, setProvince] = useState<any>({});

  const router = useRouter();

  const form = useForm<z.infer<typeof createCarSchema>>({
    resolver: zodResolver(createCarSchema),
  });

  const getProvince = async () => {
    try {
      const { data } = await axios.get(
        'https://provinces.open-api.vn/api/p/48?depth=3',
      );

      setProvince(data);
      form.setValue('province_name', data.name);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const uploadImagesToCloud = async (files: any) => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      const imagesArr: any[] = [];

      const uploadPromises = files.map(async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('cloud_name', cloudName as string);
        formData.append('upload_preset', uploadPreset as string);
        formData.append('folder', 'rental-cars-cloudinary/cars');

        try {
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
          );

          if (response.status === 200) {
            imagesArr.push(response.data.url);
          } else {
            toast.error('Upload ảnh thất bại');
            throw new Error('Upload ảnh thất bại');
          }

          return response.data.public_id;
        } catch (error: any) {
          toast.error(error.message);
          throw error;
        }
      });

      // const results = await Promise.all(uploadPromises);
      // const publicIds = results.map((result) => result.public_id);
      // const urls = results.map((result) => result.url);

      return imagesArr;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const getAllBrand = async () => {
    try {
      const res = await API.get(GET_BRANDS_AND_MODELS);
      if (res.status === 200) {
        setBrandData(res.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getFeatures = async () => {
    try {
      const res = await API.get(GET_ALL_FEATURES);
      if (res.status === 200) {
        setFeatures(res.data.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getCarById = async (id: string) => {
    try {
      const res = await API.get(GET_CAR_BY_ID + `/${Number(id)}`);

      if (res.status === 200) {
        const data = {
          images: [],
          licensePlates: res.data.licensePlates,
          brandId: res.data.brandId,
          modelId: res.data.modelId,
          seats: res.data.seats,
          yearOfManufacture: res.data.yearOfManufacture,
          transmission: res.data.transmission,
          fuel: res.data.fuel,
          description: res.data.description,
          features: res.data.CarFeature,
          pricePerDay: res.data.pricePerDay,
        };

        form.reset(data);
        setCarImages(res.data.CarImage);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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
        setCarImages(imageArr);
        form.setValue('images', imageArr);
      }
    });

    setSelectedImage(filesArray);

    return imageArr;
  };

  async function onSubmit(values: z.infer<typeof createCarSchema>) {
    setIsLoading(true);
    try {
      const imgArr = await uploadImagesToCloud(selectedImage);
      const address = `${values.ward_name}, ${values.district_name}, ${values.province_name}`;

      if (slug === 'new') {
        values.images = imgArr;

        const res = await API.post(CREATE_CAR, {
          ...values,
          address,
          pricePerDay: Number(values.pricePerDay),
        });

        if (res.status === 201) {
          toast.success('Thêm xe thành công!');
          setIsLoading(false);
          router.push('/mycars');
        } else {
          toast.error('Thêm xe thất bại!');
          setIsLoading(false);
        }
      } else {
        const res = await API.put(UPDATE_USER, values);

        if (res.status === 200) {
          toast.success('Cập nhật xe thành công!');
          setIsLoading(false);
          router.push('/mycars');
        } else {
          toast.error('Cập nhật xe thất bại!');
          setIsLoading(false);
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllBrand();
    getFeatures();
    getProvince();

    if (slug === 'new') {
      form.reset({
        images: [],
        licensePlates: '',
        brandId: 0,
        modelId: 0,
        seats: 4,
        yearOfManufacture: 2023,
        transmission: 'AUTOMATIC_TRANSMISSION',
        fuel: 'GASOLINE',
        description: '',
        features: [],
        pricePerDay: 1000,
      });
    } else {
      getCarById(slug);
    }
  }, [slug]);

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
