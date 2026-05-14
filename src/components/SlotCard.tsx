import { Calendar, Clock, MapPin } from "lucide-react";

interface SlotCardProps {
  slotItem: any;
  actionText: string;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

export function SlotCard({ slotItem, actionText, onAction, isLoading }: SlotCardProps) {
  const isAiPriced = slotItem.isAiPriced || slotItem.status === "ai_priced";

  return (
    <div className={`p-5 mb-4 rounded-2xl transition-all duration-300 relative ${
        isAiPriced 
          ? "bg-[#1A1A1A] border border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
          : "bg-[#1A1A1A] border border-[#2A2A2A]"
      }`}
    >
      {isAiPriced && (
        <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
          AI PRICED
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white max-w-[75%] leading-tight">{slotItem.name}</h3>
        <div className="text-right">
          <div className="text-xl font-bold text-white">${slotItem.currentPrice}</div>
          {slotItem.originalPrice !== slotItem.currentPrice && (
            <div className="text-xs text-gray-500 line-through">${slotItem.originalPrice}</div>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-5">
        <div className="flex items-center text-sm text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          {slotItem.date}
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          {slotItem.location}
        </div>
      </div>

      {slotItem.aiReason && (
        <div className="mb-4 p-3 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A]">
          <p className="text-xs text-gray-300">
            <span className="font-bold text-white">AI Notu:</span> {slotItem.aiReason}
          </p>
        </div>
      )}

      <button 
        onClick={() => onAction(slotItem._id || slotItem.id)}
        disabled={isLoading}
        className="w-full bg-white text-black font-semibold py-3 rounded-xl disabled:opacity-50 transition-opacity"
      >
        {isLoading ? "İşleniyor..." : actionText}
      </button>
    </div>
  );
}
