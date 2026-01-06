import { z } from "zod";

export const createLoanSchema = z.object({
  body: z.object({
    bookId: z.string({ required_error: "Book ID is required" }),
    dueDate: z.string({ required_error: "Due date is required" }).transform((str) => new Date(str)),
  }),
});