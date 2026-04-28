import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({

      cart: [],
      cartOpen: false,

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      addToCart: (product, quantity = 1) => {
        const cart = get().cart;

        const existing = cart.find(
          (item) => item._id === product._id
        );

        let updatedCart;

        if (existing) {
          updatedCart = cart.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          );
        } else {
          updatedCart = [
            ...cart,
            { ...product, quantity }
          ];
        }

        set({
          cart: updatedCart,
          cartOpen: true, // 🔥 open drawer here
        });
      },

      removeItem: (id) => {
        set({
          cart: get().cart.filter(
            (item) => item._id !== id
          ),
        });
      },

      updateQty: (id, qty) => {
        if (qty < 1) return; // prevent 0 or negative

        const updated = get().cart.map((item) =>
          item._id === id
            ? { ...item, quantity: qty }
            : item
        );

        set({ cart: updated });
      },

      clearCart: () => set({ cart: [] }),

      totalPrice: () => {
        return get().cart.reduce(
          (total, item) =>
            total + item.price * item.quantity,
          0
        );
      },

    }),
    {
      name: "cart-storage",
    }
  )
);