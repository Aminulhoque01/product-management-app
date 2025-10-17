import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/auth/authSlice";
import productsSlice from "./features/product/productsSlice";
import categoriesSlice from "./features/categories/categoriesSlice";
 
// import wishlistReducer from "./features/wishlist/wishlistSlice"; 
import { baseApi } from "./features/api/baseApi"; 

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsSlice,
  categories: categoriesSlice,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Persisted Reducer

// Store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
