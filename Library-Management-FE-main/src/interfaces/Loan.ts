import { Book } from "./Book";

export interface Loan {
  _id: string;
  userId: string;
  bookId: Book; // Backend đã populate thông tin sách
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "BORROWED" | "RETURNED" | "OVERDUE";
}

export interface BorrowRequest {
  bookId: string;
  dueDate: string;
}