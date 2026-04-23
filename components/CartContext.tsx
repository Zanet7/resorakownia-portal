"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, decreaseCartQuantity, removeCartItem } from "@/app/sklep/actions";
import { useRouter } from "next/navigation";

type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: any;
    imageUrl: string | null;
    brand: string | null;
  };
};

interface CartContextType {
  items: CartItemType[];
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartError: string | null;
  setCartError: (error: string | null) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  decreaseItem: (itemId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCart = async () => {
    setIsLoading(true);
    const { items: fetchedItems, error } = await getCart();
    if (error || !fetchedItems) {
      setItems([]);
    } else {
      setItems(fetchedItems as any);
    }
    setIsLoading(false);
  };

  const clearCart = () => {
    setItems([]);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: string) => {
    const { error } = await addToCart(productId);
    if (error === "unauthorized") {
      router.push("/login");
      return;
    }
    if (error === "brak_w_magazynie") {
      setCartError("Niestety, brak wystarczającej ilości tego produktu w magazynie.");
      setIsCartOpen(true);
      setTimeout(() => setCartError(null), 4000);
      return;
    }
    // Optimistic UI might be handy here, but for simplicity we refetch
    await fetchCart();
    setIsCartOpen(true); // Open drawer on add
  };

  const decreaseItem = async (itemId: string) => {
    await decreaseCartQuantity(itemId);
    await fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await removeCartItem(itemId);
    await fetchCart();
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        cartError,
        setCartError,
        fetchCart,
        addItem,
        decreaseItem,
        removeItem,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
