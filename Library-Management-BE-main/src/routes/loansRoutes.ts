import express from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import * as loansController from "../controllers/loansController.js";
import { validate } from "../middlewares/validate.js"; // Dùng tạm middleware validate chung hoặc tạo riêng
import { createLoanSchema } from "../schemas/loansSchema.js";

const router = express.Router();

// Yêu cầu phải đăng nhập mới được mượn
router.use(checkAuth); 

router.post("/", validate(createLoanSchema), loansController.createLoan);
router.get("/", loansController.getMyLoans);

router.post("/bulk", validate(createLoanSchema), loansController.borrowMultipleBooks);

export default router;