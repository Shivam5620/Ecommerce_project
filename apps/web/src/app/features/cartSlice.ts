import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "@repo/ui/types/cart";
import { IGroupedProduct } from "@repo/ui/types/product";
import { CartType } from "@repo/ui/enums/cart";

export interface CartState {
  items: ICartItem[];
  cartType: CartType;
  productAvailability: boolean;
}

const initialState: CartState = {
  items: [],
  cartType: CartType.PAIR,
  productAvailability: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: IGroupedProduct;
        size: string;
        quantity: number;
      }>,
    ) => {
      const { product, size, quantity } = action.payload;
      const items = [...state.items];
      const index = items.findIndex(
        (item) => item.code === product.code && item.color === product.color,
      );
      if (index !== -1) {
        const sizeIndex = items[index].sizes.findIndex(
          (item) => item.size === size,
        );

        if (sizeIndex !== -1) {
          items[index].sizes[sizeIndex].quantity += quantity;
        }
        // items[index].quantity += quantity;
      } else {
        const sizes = product.sizes.map((size) => {
          let quantity = 0;
          if (size.size === action.payload.size) {
            quantity += action.payload.quantity;
          }

          return {
            ...size,
            quantity,
          };
        });

        const newItem: ICartItem = {
          ...product,
          sizes,
          comment: "",
        };

        items.push(newItem);
      }

      state.items = items;
    },
    expressAddToCart: (
      state,
      action: PayloadAction<{
        product: IGroupedProduct;
      }>,
    ) => {
      const { product } = action.payload;
      const items = [...state.items];
      const index = items.findIndex(
        (item) => item.code === product.code && item.color === product.color,
      );
      // Set the product quantities if product is already there in cart
      if (index !== -1) {
        items[index].sizes = items[index].sizes.map((size) => {
          if (size.quantity === 0) {
            if (state.cartType === CartType.CARTON) {
              size.quantity = product.PRCTN;
            } else {
              size.quantity = product.MOQ;
            }
          }
          return size;
        });
      } else {
        const sizes = product.sizes.map((size) => {
          return { ...size, quantity: product.MOQ };
        });
        const newItem: ICartItem = {
          ...product,
          sizes,
          comment: "",
        };
        items.unshift(newItem);
      }

      state.items = items;
    },
    updateCartItem: (state, action: PayloadAction<ICartItem>) => {
      const { code, color } = action.payload;
      const items = [...state.items];
      const index = items.findIndex(
        (item) => item.code === code && item.color === color,
      );
      if (index !== -1) {
        items[index] = action.payload;
      }
      state.items = items;
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ code: string; color: string; size: string }>,
    ) => {
      const { code, color } = action.payload;
      const items = [...state.items];
      const itemIndex = items.findIndex(
        (item) => item.code === code && item.color === color,
      );
      if (itemIndex !== -1) {
        items[itemIndex].sizes = items[itemIndex].sizes.map((size) => {
          if (size.size === action.payload.size) {
            size.quantity = 0;
          }
          return size;
        });

        // Remove the item from cart items array if all the sizes in items is 0
        const removeItem = state.items[itemIndex].sizes.every(
          (size) => size.quantity === 0,
        );

        if (removeItem) {
          items.splice(itemIndex, 1);
        }

        state.items = items;
      }
    },
    increaseQuantity: (
      state,
      action: PayloadAction<{ code: string; color: string; size: string }>,
    ) => {
      const { code, color } = action.payload;
      const items = [...state.items];

      const itemIndex = items.findIndex(
        (item) => item.code === code && item.color === color,
      );

      if (itemIndex !== -1) {
        items[itemIndex].sizes = state.items[itemIndex].sizes.map((size) => {
          if (size.size === action.payload.size) {
            size.quantity += 1;
          }
          return size;
        });
      }

      state.items = items;
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{ code: string; color: string; size: string }>,
    ) => {
      const { code, color } = action.payload;
      const items = [...state.items];

      const itemIndex = items.findIndex(
        (item) => item.code === code && item.color === color,
      );

      if (itemIndex !== -1) {
        items[itemIndex].sizes = items[itemIndex].sizes.map((size) => {
          if (size.size === action.payload.size) {
            size.quantity -= 1;
          }
          return size;
        });
      }

      // Remove the item from cart if all quantities are zero
      const removeItem = items[itemIndex].sizes.every(
        (size) => size.quantity === 0,
      );

      if (removeItem) {
        items.splice(itemIndex, 1);
      }

      state.items = items;
    },
    setProductAvailability: (state, action: PayloadAction<boolean>) => {
      state.productAvailability = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
    setCartType: (state, action: PayloadAction<CartType>) => {
      state.cartType = action.payload;
    },
  },
});

export const {
  addToCart,
  expressAddToCart,
  updateCartItem,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setCartType,
  setProductAvailability,
} = cartSlice.actions;

export default cartSlice.reducer;
