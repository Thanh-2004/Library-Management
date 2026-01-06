import { Request, Response, NextFunction } from "express";
import * as loansService from "../services/loansService.js";

export const createLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user được lấy từ middleware checkAuth (đã có trong dự án)
    const userId = (req as any).user.id; 
    const { bookId, dueDate } = req.body;

    const loan = await loansService.borrowBook(userId, bookId, dueDate);
    res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

export const getMyLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const loans = await loansService.getMyLoans(userId);
    res.status(200).json(loans);
  } catch (error) {
    next(error);
  }
};

// src/controllers/loansController.ts
export const borrowMultipleBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { bookIds, dueDate } = req.body; // Nhận vào một mảng ID sách

    // Dùng Promise.all để mượn từng cuốn (hoặc viết service bulk insert sẽ tối ưu hơn)
    const results = await Promise.all(
      bookIds.map((bookId: string) => loansService.borrowBook(userId, bookId, dueDate))
    );

    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};