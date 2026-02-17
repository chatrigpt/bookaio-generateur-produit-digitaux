
import { CloudinaryResponse } from '../types';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dt9sxjxve/image/upload';
const UPLOAD_PRESET = 'ml_default';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Error:', error);
    throw error;
  }
};
