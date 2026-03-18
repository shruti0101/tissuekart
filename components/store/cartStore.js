import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useCartStore = create(
  persist(
    (set, get) => ({

      cart: [],
      cartOpen: false,

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      addToCart: (product, quantity = 1) => {

        const cart = get().cart
        const existing = cart.find((item) => item.name === product.name)

        if (existing) {

          const updated = cart.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )

          set({ cart: updated })

        } else {

          set({
            cart: [...cart, { ...product, quantity }]
          })

        }

        set({ cartOpen: true })
      },

      removeItem: (name) => {
        set({
          cart: get().cart.filter((item) => item.name !== name)
        })
      },

      updateQty: (name, qty) => {

        const updated = get().cart.map((item) =>
          item.name === name
            ? { ...item, quantity: qty }
            : item
        )

        set({ cart: updated })
      },

      clearCart: () => set({ cart: [] }),

      totalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      }

    }),
    { name: "cart-storage" }
  )
)