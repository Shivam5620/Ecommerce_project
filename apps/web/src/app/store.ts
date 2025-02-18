import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import sessionStorage from "redux-persist/es/storage/session";
import productSlice from "./features/productSlice";
import cartSlice, { CartState } from "./features/cartSlice";
import orderSlice from "./features/orderSlice";
import brandSlice from "./features/brandSlice";

// Create middlewares based on development/production conditions
// let middlewares: Array<Middleware> = [];
// if (process.env.NODE_ENV === `development`) {
//   const logger = createLogger({
//     duration: true,
//     diff: false,
//     collapsed: true,
//   });
//   middlewares.push(logger);
// }

export const store = configureStore({
  reducer: {
    products: productSlice,
    brands: brandSlice,
    cart: persistReducer<CartState>(
      { key: "cart", storage: sessionStorage, blacklist: ["cartType"] },
      cartSlice,
    ),
    orders: orderSlice,
  },
  // devTools: process.env.NODE_ENV !== "production",
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
