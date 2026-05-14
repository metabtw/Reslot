export function PortfolioStats({ slots }: { slots: any[] }) {
  if (!slots || slots.length === 0) return null;

  const totalInvestment = slots.reduce((acc, slot) => acc + (slot.originalPrice || 0), 0);
  const currentValue = slots.reduce((acc, slot) => acc + (slot.currentPrice || 0), 0);
  const profitLoss = currentValue - totalInvestment;

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
