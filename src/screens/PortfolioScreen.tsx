import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SlotCard } from '../components/SlotCard';

export function PortfolioScreen() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPortfolio = async () => {
    try {
      const data = await api.getPortfolioSlots("user_001");
      setSlots(data);
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAnalyze = (id: string) => {
    navigate(`/analyze/${id}`);
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center text-white h-full p-10">Yükleniyor...</div>;
  }

  return (
    <div className="pb-24 pt-8 px-4 h-full overflow-y-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Portföyüm</h1>
        <p className="text-gray-400 text-sm mt-1">Sahip olduğunuz slotlar</p>
      </div>

      {slots.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Henüz slot almadınız.</div>
      ) : (
        slots.map((slot) => (
          <SlotCard 
            key={slot._id || slot.id} 
            slotItem={slot} 
            actionText="ANALİZ ET & SAT" 
            onAction={handleAnalyze} 
          />
        ))
      )}
    </div>
  );
}
