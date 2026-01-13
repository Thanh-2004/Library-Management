import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { ExtendedBooksInitialAdaptedState } from "../interfaces/InitialState";
import { Book } from "../interfaces/Book";
import { FetchBooksPaginatedAndFiltered, FetchSingleBook } from "../interfaces/APIQuerries";
import { config } from "../config";
import { RootState } from "../storeConfig/store";
import axios from "axios";

const extendedAdaptedState: ExtendedBooksInitialAdaptedState = {
    singleBook : null,
    isLoading: false,
    page: 1,
    perPage: 10,
    totalPageCount: 1,
    dataCount: 1,
    singleBookCopies : 0
}

const booksAdapter = createEntityAdapter<Book>({
    selectId: (book) => book._id
})

const initialState = booksAdapter.getInitialState(extendedAdaptedState)

export const fetchBooksFilteredAndPaginated = createAsyncThunk(
    'fetchBookFilteredAndPaginated',
    async ({ page, perPage, searchQuery, authorName, categoryName, edition, publisher ,sortBy, sortOrder }: FetchBooksPaginatedAndFiltered, { rejectWithValue } ) => {
        try {
            const { data } = await axios(config.dataAPI  + 
                `books/?filter=1` +
                `&page=${page}` +
                `&perPage=${perPage}` +
                `&sortBy=${sortBy}` +
                `&sortOrder=${sortOrder}` +
                `&search=${searchQuery === undefined ? '' : searchQuery}` +
                `&publisher=${publisher === undefined ? '' : publisher}` +
                `&authorName=${authorName === undefined ? '' :  authorName}` +
                `&categoryName=${categoryName === undefined ? '' : categoryName}`+
                `&edition=${edition === undefined ? '' : edition}`)
            return data
        } catch (e) {
            const error = e as Error
            return rejectWithValue(error.message)
        }
    }
)

export const fetchSingleBook = createAsyncThunk(
    'fetchSingleBook',
    async({ ISBN }: FetchSingleBook, { rejectWithValue }) => {
        try {
            const { data }  = await axios(config.dataAPI + `books/ISBN/${ISBN}`)
            return data
        } catch (e) {
            const error = e as Error
            return rejectWithValue(error.message)
        }
    }
)

export const createNewBook = createAsyncThunk(
    'books/createNewBook',
    async (bookData: any, { rejectWithValue }) => {
        try {
            // Lấy token từ localStorage để chứng thực Admin
            const token = localStorage.getItem("token");
            
            // Gọi API POST /books với dữ liệu JSON
            const { data } = await axios.post(
                `${config.dataAPI}books`, 
                bookData,
                {
                    headers: {
                        // Backend yêu cầu token ở header này
                        "Authorization": `Bearer ${token}` 
                    }
                }
            )
            return data
        } catch (e: any) {
            // Xử lý lỗi trả về từ Backend (nếu có)
            return rejectWithValue(e.response?.data?.message || e.message)
        }
    }
)

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchBooksFilteredAndPaginated.fulfilled, (state, action) => {
                if (!(action.payload instanceof Error)){
                    state.dataCount = action.payload.totalCount
                    state.page = action.payload.page
                    state.perPage = action.payload.perPage
                    state.totalPageCount = action.payload.totalPageCount
                    booksAdapter.setAll(state, action.payload.data)
                    state.isLoading = false
                }
            })            
            .addCase(fetchBooksFilteredAndPaginated.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(fetchBooksFilteredAndPaginated.rejected, (state , action) => {
                if (action.payload instanceof Error){
                    state.isLoading = false
                    state.error = action.payload.message
                }
            })
            .addCase(fetchSingleBook.fulfilled, (state, action) => {
                if (!(action.payload instanceof Error)){
                    const copy = state.entities[action.payload._id]
                    if (copy !== undefined){
                        state.singleBookCopies = copy.availableCopies[0].total
                    } else {
                       state.singleBookCopies = 0
                    }
                    state.singleBook = action.payload
                    state.isLoading = false
                }
            })            
            .addCase(fetchSingleBook.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(fetchSingleBook.rejected, (state , action) => {
                if (action.payload instanceof Error){
                    state.isLoading = false
                    state.error = action.payload.message
                }
            })

            .addCase(createNewBook.pending, (state) => {
            state.isLoading = true;
            })
            .addCase(createNewBook.fulfilled, (state, action) => {
                state.isLoading = false;
                // Tùy chọn: Bạn có thể thêm sách mới vào danh sách ngay lập tức nếu muốn
                // booksAdapter.addOne(state, action.payload);
            })
            .addCase(createNewBook.rejected, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.error = action.payload as string;
                }
            })
    },
})

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (bookId: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${config.dataAPI}books/${bookId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            return bookId;
        } catch (e: any) {
            return rejectWithValue(e.message);
        }
    }
);

// Selector
export const bookSelector = booksAdapter.getSelectors((state: RootState) => state.books)

export const getState = (state: RootState) => state

export const getPageNumber = (state: RootState) => state.books.page
export const getEntriesPerPage = (state: RootState) => state.books.perPage
export const getTotalEntries = (state: RootState) => state.books.dataCount
export const getTotalPageNumber = (state: RootState) => state.books.totalPageCount
export const getSingleBook = (state: RootState) => state.books.singleBook
export const getSingleBookCopies = (state: RootState) => state.books.singleBookCopies

export const booksReducer = bookSlice.reducer
export default booksReducer