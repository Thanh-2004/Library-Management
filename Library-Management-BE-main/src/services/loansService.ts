import Loan from "../models/loansModel.js";
// import Book from "../models/bookModel.js";
import { BookModel as Book } from "../models/bookModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ILoan } from "../types/Loan.js";

// Chức năng mượn sách
export const borrowBook = async (userId: string, bookId: string, dueDate: Date): Promise<ILoan> => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  // Giả sử logic đơn giản: Nếu bạn muốn check số lượng tồn kho, thêm logic ở đây
  // if (book.quantity <= 0) throw new ApiError(400, "Out of stock");

  const newLoan = new Loan({
    userId,
    bookId,
    dueDate,
    status: "BORROWED"
  });

  await newLoan.save();
  return newLoan;
};

// Chức năng lấy danh sách sách đang mượn của user
export const getMyLoans = async (userId: string): Promise<ILoan[]> => {
  return await Loan.find({ userId }).populate("bookId", "title ISBN");
};