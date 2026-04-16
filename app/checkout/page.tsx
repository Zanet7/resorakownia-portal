"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, PackageSearch } from "lucide-react";
import Link from "next/link";
import { checkoutCart } from "@/app/sklep/actions";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, cartTotal, fetchCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("blik");
  const [deliveryMethod, setDeliveryMethod] = useState("kurier");
  const router = useRouter();

  const deliveryCost = deliveryMethod === "paczkomat" ? 12.99 : deliveryMethod === "kurier" ? 15.00 : 0.00;
  const deliveryName = deliveryMethod === "paczkomat" ? "Paczkomat InPost" : deliveryMethod === "kurier" ? "Kurier DPD" : "Odbiór osobisty";

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Symulacja ładowania i płatności
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await checkoutCart();
    if (result.success) {
      await fetchCart();
      setSuccess(true);
    } else {
      alert("Wystąpił błąd podczas finalizacji zamówienia.");
    }
    
    setIsProcessing(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Zamówienie przyjęte!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Dziękujemy za zakupy w Resorakowni. Twoje modele wkrótce wyruszą w drogę do Twojej kolekcji. Zobaczysz je wkrótce w swoim panelu!
          </p>
          <Link 
            href="/dashboard" 
            className="block w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Przejdź do panelu
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <PackageSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Twój koszyk jest pusty</h2>
          <p className="text-gray-500 mb-6">Wróć do sklepu i wybierz interesujące Cię modele przed przejściem do kasy.</p>
          <Link href="/sklep" className="text-orange-600 font-bold hover:underline">Wróć do sklepu rzucając okiem na nowości</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/sklep" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Wróć do sklepu
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Lewa: Formularz wysyłki i zmyślona płatność */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleCheckout} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10">
              
              {/* Sekcja: Dane */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Dane dostawy (Symulacja)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imię i nazwisko</label>
                    <input required type="text" defaultValue="Jan Kowalski" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input required type="email" defaultValue="jan@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres dostawy</label>
                    <input required type="text" defaultValue="ul. Przykładowa 12/3, 00-000 Warszawa" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>

              {/* Sekcja: Dostawa */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Metoda dostawy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${deliveryMethod === 'paczkomat' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === 'paczkomat'} onChange={() => setDeliveryMethod('paczkomat')} />
                    <span className="font-bold text-gray-900">Paczkomat InPost</span>
                    <span className="text-sm font-medium text-gray-500">12.99 zł</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${deliveryMethod === 'kurier' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === 'kurier'} onChange={() => setDeliveryMethod('kurier')} />
                    <span className="font-bold text-gray-900">Kurier DPD</span>
                    <span className="text-sm font-medium text-gray-500">15.00 zł</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${deliveryMethod === 'odbiór' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="delivery" className="sr-only" checked={deliveryMethod === 'odbiór'} onChange={() => setDeliveryMethod('odbiór')} />
                    <span className="font-bold text-gray-900">Odbiór osobisty</span>
                    <span className="text-sm font-medium text-gray-500">0.00 zł</span>
                  </label>
                </div>
              </div>

              {/* Sekcja: Płatności */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Metoda płatności</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'blik' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'blik'} onChange={() => setPaymentMethod('blik')} />
                    <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-xs">BLIK</div>
                    <span className="font-medium text-sm">BLIK</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                    <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-black' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">Karta płatnicza</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-3 transition-all ${paymentMethod === 'transfer' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" className="sr-only" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                    <Smartphone className={`w-8 h-8 ${paymentMethod === 'transfer' ? 'text-black' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">Przelew bankowy</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 hidden lg:block">
                 <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                 >
                   {isProcessing ? "Przetwarzanie..." : `Zapłać ${(cartTotal + deliveryCost).toFixed(2)} zł`}
                 </button>
              </div>
            </form>
          </div>

          {/* Prawa: Podsumowanie Koszyka */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-100/50 rounded-3xl p-8 border border-gray-100 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Podsumowanie</h3>
              
              <ul className="space-y-4 mb-6">
                {items.map(item => (
                  <li key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1 flex-shrink-0 relative overflow-hidden">
                      <img src={item.product.imageUrl || ""} alt={item.product.name} className="w-full h-full object-contain" />
                      <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 uppercase mt-0.5">{item.product.brand}</p>
                    </div>
                    <div className="font-bold text-gray-900 whitespace-nowrap text-sm">
                      {(Number(item.product.price) * item.quantity).toFixed(2)} zł
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 py-4 border-y border-gray-200/60 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Wartość koszyka</span>
                  <span className="font-semibold text-gray-900">{cartTotal.toFixed(2)} zł</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Dostawa ({deliveryName})</span>
                  <span className="font-semibold text-gray-900">{deliveryCost.toFixed(2)} zł</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-gray-900">Do zapłaty</span>
                <span className="text-3xl font-black text-gray-900">{(cartTotal + deliveryCost).toFixed(2)} zł</span>
              </div>
              
              {/* Przycisk mobiny */}
              <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all disabled:opacity-70 flex items-center justify-center gap-3 lg:hidden"
                 >
                   {isProcessing ? "Przetwarzanie..." : `Zapłać ${(cartTotal + deliveryCost).toFixed(2)} zł`}
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
