export function PortfolioStats({ slots }: { slots: any[] }) {
  if (!slots || slots.length === 0) return null;

  let totalInvestment = 0;
  let currentValue = 0;
  let profitLoss = 0;

  slots.forEach(slot => {
    const boughtPrice = slot.boughtAtPrice || slot.originalPrice || 0;
    const isSold = slot.status === "ai_priced" || slot.status === "available";

    if (isSold) {
      const soldPrice = slot.soldAtPrice || slot.currentPrice || 0;
      profitLoss += (soldPrice - boughtPrice);
    } else {
      totalInvestment += boughtPrice;
      currentValue += slot.currentPrice || 0;
      profitLoss += ((slot.currentPrice || 0) - boughtPrice);
    }
  });

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center">
        <span className="text-xs text-gray-400 mb-1">Yatırım</span>
        <span className="text-lg font-bold text-white">${totalInvestment}</span>
      </div>
      <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] flex flex-col items-center justify-center">
        <span className="text-xs text-gray-400 mb-1">Değer</span>
        <span className="text-lg font-bold text-white">${currentValue}</span>
      </div>
      <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
        profitLoss > 0 ? 'bg-green-500/10 border-green-500/30' : profitLoss < 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-[#1A1A1A] border-[#2A2A2A]'
      }`}>
        <span className="text-xs text-gray-400 mb-1">K/Z</span>
        <span className={`text-lg font-bold ${
          profitLoss > 0 ? 'text-green-400' : profitLoss < 0 ? 'text-red-400' : 'text-gray-400'
        }`}>
          {profitLoss > 0 ? '+' : ''}{profitLoss}
        </span>
      </div>
    </div>
  );
}
