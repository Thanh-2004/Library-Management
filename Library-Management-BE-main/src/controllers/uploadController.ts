import { type Request, type Response } from 'express';
import { ApiError } from '../utils/ApiError.js';

const uploadImage = (req: Request, res: Response, next: any) => {
  if (!req.file) {
    next(ApiError.badRequest('No file uploaded'));
    return;
  }
  
  // Cloudinary sẽ trả về đường dẫn file trong req.file.path
  res.status(200).json({
    message: 'Upload successful',
    url: req.file.path 
  });
};

export default { uploadImage };