import axios from 'axios';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Upload ảnh thẳng từ trình duyệt lên Cloudinary (unsigned preset) và trả về URL https.
 * Ảnh không đi qua backend nên request API nhỏ và nhanh.
 */
export async function uploadImageToCloudinary(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Chỉ chấp nhận file ảnh');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Ảnh tối đa 5MB');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) throw new Error('Chưa cấu hình Cloudinary');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

  return data.secure_url as string;
}
