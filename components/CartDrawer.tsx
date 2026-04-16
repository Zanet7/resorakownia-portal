"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, isLoading, addItem, decreaseItem, removeItem, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="relative z-[100]" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* DrawerPanel */}
            <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out shadow-2xl bg-white flex flex-col">
              
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2" id="slide-over-title">
                  <ShoppingBag className="w-6 h-6 text-orange-500" /> Twój koszyk
                </h2>
                <button
                  type="button"
                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Ładowanie koszyka...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Koszyk jest pusty</p>
                      <p className="text-gray-500 text-sm mt-1">Czas na nowe, niesamowite okazy!</p>
                    </div>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-orange-600 font-semibold hover:text-orange-700"
                    >
                      Wróć do sklepu
                    </button>
                  </div>
                ) : (
                  <ul role="list" className="-my-6 divide-y divide-gray-100">
                    {items.map((item) => (
                      <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-2">
                          <img
                            src={item.product.imageUrl || "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=200"}
                            alt={item.product.name}
                            className="h-full w-full object-contain mx-auto"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="line-clamp-2 pr-4"><Link href={`/sklep/${item.product.id}`}>{item.product.name}</Link></h3>
                              <p className="ml-4 whitespace-nowrap">{Number(item.product.price).toFixed(2)} zł</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 uppercase">{item.product.brand}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button 
                                onClick={() => decreaseItem(item.id)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 font-medium text-gray-900 border-x border-gray-200 min-w-[2.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => addItem(item.product.id)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" /> <span>Usuń</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                    <p>Suma częściowa</p>
                    <p>{cartTotal.toFixed(2)} zł</p>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="flex items-center justify-center rounded-2xl border border-transparent bg-black px-6 py-4 text-base font-semibold text-white shadow-xl hover:bg-gray-900 transition-colors"
                    >
                      Zamawiam i płacę
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      lub{" "}
                      <button
                        type="button"
                        className="font-semibold text-orange-600 hover:text-orange-500"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Kontynuuj zakupy
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
