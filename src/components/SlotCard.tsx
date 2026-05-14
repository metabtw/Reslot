import { Calendar, Clock, MapPin, Utensils, HeartPulse, Bed, Ticket } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SlotCardProps {
  slotItem: any;
  actionText: string;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

export function SlotCard({ slotItem, actionText, onAction, isLoading }: SlotCardProps) {
  const isAiPriced = slotItem.isAiPriced || slotItem.status === "ai_priced";

  const getCategoryConfig = (category: string) => {
    switch(category) {
      case 'restaurant': return { icon: <Utensils className="w-5 h-5" />, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
      case 'clinic': return { icon: <HeartPulse className="w-5 h-5" />, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'hotel': return { icon: <Bed className="w-5 h-5" />, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default: return { icon: <Ticket className="w-5 h-5" />, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
    }
  };

  const catConfig = getCategoryConfig(slotItem.category);

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
        <div className="flex items-center gap-3 max-w-[70%]">
          <div className={`p-2 rounded-xl border ${catConfig.color}`}>
            {catConfig.icon}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">{slotItem.name}</h3>
        </div>
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

      {slotItem.priceHistory && slotItem.priceHistory.length > 1 && (
        <div className="h-16 w-full mb-4 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slotItem.priceHistory}>
              <Line type="monotone" dataKey="price" stroke="#ffffff" strokeWidth={2} dot={false}/>
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                labelFormatter={() => ''}
                formatter={(value: any) => [`$${value}`, 'Fiyat']}
              />
            </LineChart>
          </ResponsiveContainer>
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
