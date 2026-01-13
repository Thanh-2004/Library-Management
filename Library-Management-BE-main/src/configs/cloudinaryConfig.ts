import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Bạn cần lấy thông tin này từ Dashboard của Cloudinary sau khi đăng ký
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'library-books', // Tên thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  } as any,
});

export const uploadMiddleware = multer({ storage: storage });