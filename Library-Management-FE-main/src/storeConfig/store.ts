import { configureStore } from "@reduxjs/toolkit"
import booksReducer from "../books/bookSlice";
import categoriesReducer from "../categories/categorySlice";
import userReducer from "../user/userSlice";
import cartReducer from "../cart/cartSlice";
import loansReducer from "../loans/loansSlice";

export const createStore = () => {
    return configureStore({
        reducer : {
            books: booksReducer,
            categories: categoriesReducer,
            user: userReducer,
            cart: cartReducer,
            loans: loansReducer
        }
    })
}

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;