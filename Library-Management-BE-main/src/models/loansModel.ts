import mongoose, { Schema } from "mongoose";
import { ILoan } from "../types/Loan.js";

const loanSchema = new Schema<ILoan>(
  {
    userId: { type: String, required: true, ref: "User" },
    bookId: { type: String, required: true, ref: "Book" },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED", "OVERDUE"],
      default: "BORROWED",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILoan>("Loan", loanSchema);