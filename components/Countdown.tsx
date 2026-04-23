"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Countdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; isEnded: boolean } | null>(null);

  useEffect(() => {
    const end = new Date(endDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isEnded: false,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (!timeLeft) return null;

  if (timeLeft.isEnded) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-100">
        <Clock className="w-5 h-5" /> Aukcja zakończona
      </div>
    );
  }

  return (
    <div className="flex gap-2 text-center">
      <div className="bg-gray-100 rounded-xl p-3 min-w-[60px]">
        <div className="text-xl font-bold text-gray-900">{timeLeft.days}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Dni</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-3 min-w-[60px]">
        <div className="text-xl font-bold text-gray-900">{timeLeft.hours}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Godz</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-3 min-w-[60px]">
        <div className="text-xl font-bold text-gray-900">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Min</div>
      </div>
      <div className="bg-gray-100 rounded-xl p-3 min-w-[60px]">
        <div className="text-xl font-bold text-red-600">{timeLeft.seconds}</div>
        <div className="text-xs text-red-400 uppercase tracking-wide">Sek</div>
      </div>
    </div>
  );
}
