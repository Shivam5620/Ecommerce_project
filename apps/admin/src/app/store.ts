import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import sessionStorage from "redux-persist/lib/storage/session";
import persistReducer from "redux-persist/es/persistReducer";
import productSlice from "./feature/productSlice";
import orderSlice from "./feature/orderSlice";
import authSlice, { AuthState } from "./feature/authSlice";
import userSlice from "./feature/userSlice";
import brandSlice from "./feature/brandSlice";
import transportSlice from "./feature/transportSlice";
import shipmentSlice from "./feature/shipmentSlice";
import roleSlice from "./feature/roleSlice";
import materialCenterSlice from "./feature/materialCenterSlice";
import dispatchSlice from "./feature/orderDispatchSlice";
import loadingSlice from "./feature/loadingSlice";
import biltySlice from "./feature/biltySlice";
import orderLoadSlice from "./feature/orderLoadSlice";
import customerSlice from "./feature/customerSlice";
import itemGroupsSlice from "./feature/itemGroupSlice";
import billSundriesSlice from "./feature/billSundrySlice";
import customerDiscountsSlice from "./feature/customerDiscountSlice";
import customerBillSundrySlice from "./feature/customerBillSundrySlice";
import customerBeatSlice from "./feature/customerBeatSlice";
import customerBeatScheduleSlice from "./feature/customerBeatScheduleSlice";

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

// Persist the required states
const transforms = [
  encryptTransform({
    secretKey: "d20ac630-ba07-11eb-8529-0242ac930003",
    onError: function (error: Error) {
      // Handle the error.
      console.error("Transform error", error);
    },
  }),
];

export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(
      { key: "auth", storage: sessionStorage, transforms },
      authSlice,
    ),
    products: productSlice,
    brands: brandSlice,
    users: userSlice,
    loadings: loadingSlice,
    transports: transportSlice,
    orders: orderSlice,
    shipments: shipmentSlice,
    roles: roleSlice,
    customers: customerSlice,
    customerDiscounts: customerDiscountsSlice,
    customerBillSundries: customerBillSundrySlice,
    itemGroups: itemGroupsSlice,
    billSundries: billSundriesSlice,
    materialCenter: materialCenterSlice,
    dispatches: dispatchSlice,
    orderLoads: orderLoadSlice,
    bilty: biltySlice,
    customerBeats: customerBeatSlice,
    customerBeatSchedules: customerBeatScheduleSlice,
  },
  // devTools: process.env.NODE_ENV !== "production",
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
