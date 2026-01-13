import express from 'express';
import uploadController from '../controllers/uploadController.js';
import { uploadMiddleware } from '../configs/cloudinaryConfig.js'; // Import middleware ở bước 2

const router = express.Router();

// Route này sẽ nhận file từ field tên là "image"
router.post('/', uploadMiddleware.single('image'), uploadController.uploadImage);

export default router;