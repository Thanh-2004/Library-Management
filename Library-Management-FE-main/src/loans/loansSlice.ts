import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../config";
import { Loan, BorrowRequest } from "../interfaces/Loan";

interface LoanState {
  loans: Loan[];
  isLoading: boolean;
  error: string | null;
  borrowSuccess: boolean;
}

const initialState: LoanState = {
  loans: [],
  isLoading: false,
  error: null,
  borrowSuccess: false,
};

// Async Thunk: Mượn sách
export const borrowBook = createAsyncThunk(
  "loans/borrowBook",
  async (data: BorrowRequest, thunkAPI) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await axios.post(`${config.BASE_URL}/loans`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to borrow book"
      );
    }
  }
);

// Async Thunk: Lấy danh sách sách đang mượn
export const getMyLoans = createAsyncThunk(
  "loans/getMyLoans",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.BASE_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans"
      );
    }
  }
);

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    resetBorrowStatus: (state) => {
      state.borrowSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý borrowBook
    builder.addCase(borrowBook.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.borrowSuccess = false;
    });
    builder.addCase(borrowBook.fulfilled, (state, action: PayloadAction<Loan>) => {
      state.isLoading = false;
      state.borrowSuccess = true;
      state.loans.push(action.payload);
    });
    builder.addCase(borrowBook.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Xử lý getMyLoans
    builder.addCase(getMyLoans.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getMyLoans.fulfilled, (state, action: PayloadAction<Loan[]>) => {
      state.isLoading = false;
      state.loans = action.payload;
    });
    builder.addCase(getMyLoans.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetBorrowStatus } = loansSlice.actions;
export default loansSlice.reducer;