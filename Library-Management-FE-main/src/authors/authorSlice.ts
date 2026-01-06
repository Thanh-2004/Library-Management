//
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../config";

// Hàm lấy danh sách tác giả
export const fetchAuthors = createAsyncThunk(
    'authors/fetchAuthors',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${config.dataAPI}authors`);
            return data; // Giả sử trả về mảng [{_id: "...", name: "..."}]
        } catch (e: any) {
            return rejectWithValue(e.message);
        }
    }
);

// Hàm tạo tác giả mới
export const createAuthor = createAsyncThunk(
    'authors/createAuthor',
    async (authorName: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            // API tạo tác giả (Lưu ý: Payload phải khớp với Backend của bạn)
            const { data } = await axios.post(
                `${config.dataAPI}authors`, 
                { name: authorName, biography: "New author" }, 
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            return data; // Backend phải trả về object tác giả vừa tạo (có _id)
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message || e.message);
        }
    }
);

// ... (Phần slice reducer bạn tự cấu hình tương tự bookSlice)