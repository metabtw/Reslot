export function MarketPulse({ slots }: { slots: any[] }) {
  if (!slots || slots.length === 0) return null;

  let validSlots = 0;
  const avgChange = slots.reduce((acc, s) => {
    if (!s.originalPrice) return acc;
    validSlots++;
    return acc + ((s.currentPrice - s.originalPrice) / s.originalPrice * 100);
  }, 0) / (validSlots || 1);
  
  const sentiment = avgChange > 5 ? "🔥 Yüksek Talep" 
                  : avgChange < -5 ? "❄️ Düşük Talep" 
                  : "⚖️ Dengeli";
  
  return (
    <div className="flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-xl mb-4 border border-[#2A2A2A]">
      <div className={`w-2 h-2 rounded-full animate-pulse ${
        avgChange > 0 ? 'bg-green-400' : avgChange < 0 ? 'bg-red-400' : 'bg-gray-400'
      }`}/>
      <span className="text-sm text-gray-300">{sentiment}</span>
      <span className={`text-sm font-bold ml-auto ${
        avgChange > 0 ? 'text-green-400' : avgChange < 0 ? 'text-red-400' : 'text-gray-400'
      }`}>
        {avgChange > 0 ? '+' : ''}{avgChange.toFixed(1)}%
      </span>
    </div>
  );
}
