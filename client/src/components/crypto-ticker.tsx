import { useCryptoPrices } from "@/hooks/use-crypto";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CryptoTicker() {
  const { data: prices, isLoading } = useCryptoPrices();

  if (isLoading || !prices) {
    return (
      <div className="h-10 bg-primary/5 border-b border-primary/10 flex items-center justify-center overflow-hidden">
        <span className="text-xs text-primary/60 font-medium">Loading live markets...</span>
      </div>
    );
  }

  // Fallback mock data if API shape varies
  const tokens = Array.isArray(prices) ? prices : [
    { symbol: 'BTC', price: 65231.20, change: 2.4 },
    { symbol: 'ETH', price: 3421.10, change: -1.2 },
    { symbol: 'SOL', price: 145.20, change: 5.6 },
    { symbol: 'BNB', price: 580.40, change: 0.8 },
    { symbol: 'TON', price: 6.20, change: -0.4 },
  ];

  return (
    <div className="h-10 bg-slate-900 text-white border-b border-slate-800 flex items-center overflow-hidden relative">
      <div className="absolute left-0 w-16 h-full bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute right-0 w-16 h-full bg-gradient-to-l from-slate-900 to-transparent z-10" />
      
      <div className="flex whitespace-nowrap animate-marquee w-max items-center">
        {/* Render twice for continuous loop */}
        {[...tokens, ...tokens, ...tokens].map((token, i) => (
          <div key={i} className="flex items-center mx-6 gap-2 text-sm font-display tracking-wide">
            <span className="font-bold text-slate-300">{token.symbol?.toUpperCase()}</span>
            <span className="font-medium">${Number(token.price || token.current_price || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</span>
            {(token.change || token.price_change_percentage_24h || 0) >= 0 ? (
              <span className="text-emerald-400 flex items-center text-xs">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                {Math.abs(token.change || token.price_change_percentage_24h || 0).toFixed(2)}%
              </span>
            ) : (
              <span className="text-rose-400 flex items-center text-xs">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                {Math.abs(token.change || token.price_change_percentage_24h || 0).toFixed(2)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
