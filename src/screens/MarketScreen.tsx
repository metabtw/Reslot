import { useState } from 'react';
import { api } from '../services/api';
import { SlotCard } from '../components/SlotCard';
import { useRealtimeSlots } from '../hooks/useRealtimeSlots';
import { MarketPulse } from '../components/MarketPulse';

export function MarketScreen() {
  const { slots, loading } = useRealtimeSlots();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleBuy = async (id: string) => {
    setActionLoading(id);
    try {
      await api.buySlot(id);
    } catch (error) {
      console.error("Buy failed", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeed = async () => {
    await api.seedSlots();
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center text-white h-full p-10">Yükleniyor...</div>;
  }

  return (
    <div className="pb-24 pt-8 px-4 h-full overflow-y-auto w-full">
      <MarketPulse slots={slots} />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market</h1>
          <p className="text-gray-400 text-sm mt-1">Alınabilir slotlar</p>
        </div>
        <button onClick={handleSeed} className="text-xs text-gray-500 underline border border-gray-800 px-2 py-1 rounded">Veri Yükle</button>
      </div>

      {slots.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Şu an piyasada slot yok.</div>
      ) : (
        slots.map((slot) => (
          <SlotCard 
            key={slot._id || slot.id} 
            slotItem={slot} 
            actionText="SATIN AL" 
            onAction={handleBuy}
            isLoading={actionLoading === (slot._id || slot.id)}
          />
        ))
      )}
    </div>
  );
}
