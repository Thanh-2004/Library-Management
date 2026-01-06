import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const e = error as ZodError;
      const errorMessages: string[] = [];
      
      // Lấy thông báo lỗi từ Zod
      if (e.errors) {
         e.errors.forEach((err) => {
           errorMessages.push(err.message);
         });
      }
      
      next(ApiError.badRequest("Validation Error", errorMessages.join(", ")));
    }
  };