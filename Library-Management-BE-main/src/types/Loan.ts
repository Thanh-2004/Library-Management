import { Document } from "mongoose";

export interface ILoan extends Document {
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
}