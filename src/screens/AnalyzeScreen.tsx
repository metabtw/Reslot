import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { useAuthContext } from '../hooks/useAuth';

export function AnalyzeScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slot, setSlot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const { showToast } = useToast();
  const user = useAuthContext();

  useEffect(() => {
    // In a real app we'd fetch the single slot. 
    // Here we'll fetch portfolio and find it.
    const fetchSlot = async () => {
      try {
        if (!user?.uid) return;
        const slots = await api.getPortfolioSlots(user.uid);
        const found = slots.find((s: any) => (s._id || s.id) === id);
        if (found) setSlot(found);
        else navigate("/portfolio");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlot();
  }, [id, navigate, user]);

  const handleAnalyzeAndSell = async () => {
    if (!id) return;
    setAnalyzing(true);
    setAnalysisStep("Bağlantı kuruluyor...");
    
    try {
      const response = await fetch(`/api/slots/${id}/analyze-and-sell`, {
        method: 'POST',
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.step) {
                setAnalysisStep(data.step);
              } else if (data.done) {
                showToast("Analiz tamamlandı, yeni fiyat belirlendi!", "success");
                navigate("/");
                return;
              } else if (data.error) {
                console.error(data.error);
                setAnalyzing(false);
                return;
              }
            } catch (e) {
              // Ignore partial chunk parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setAnalyzing(false);
    }
  };

  if (loading || !slot) {
    return <div className="flex-1 flex justify-center items-center text-white h-full p-10">Veri hazırlanıyor...</div>;
  }

  return (
    <div className="pb-24 pt-8 px-4 h-full overflow-y-auto w-full flex flex-col">
      <div className="mb-8">
        <button onClick={() => navigate("/portfolio")} className="text-gray-400 text-sm mb-4">← Geri</button>
        <h1 className="text-3xl font-bold tracking-tight">YZ Analiz Merkezi</h1>
        <p className="text-gray-400 text-sm mt-1">Yapay zeka piyasa dinamiklerine göre slotunuzu fiyatlandıracak.</p>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] mb-8">
        <h2 className="text-xl font-bold mb-4">{slot.name}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
            <span className="text-gray-400">Şu Anki Piyasa Değeri</span>
            <span className="text-xl font-bold text-white">${slot.currentPrice}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
            <span className="text-gray-400">Tarih</span>
            <div className="flex items-center text-white"><Calendar className="w-4 h-4 mr-2"/> {slot.date}</div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Konum</span>
            <div className="flex items-center text-white"><MapPin className="w-4 h-4 mr-2"/> {slot.location}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        {analyzing ? (
          <div className="flex flex-col items-center justify-center p-6 bg-[#1A1A1A] rounded-2xl border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse">
            <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium text-center">{analysisStep || "Gemini AI olayları analiz ediyor..."}</p>
          </div>
        ) : (
          <button 
            onClick={handleAnalyzeAndSell}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl text-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Piyasayı Analiz Et & Sat
          </button>
        )}
      </div>
    </div>
  );
}
