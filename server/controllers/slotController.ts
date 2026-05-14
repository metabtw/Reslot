import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { collection, doc, getDocs, getDoc, updateDoc, setDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.js";

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Gemini API Client initialization error", e);
}

const mockEvents = [
  { event: "Yakında Teknoloji Konferansı", impact: "high_demand" },
  { event: "Şiddetli Yağmur Uyarısı", impact: "low_demand" },
  { event: "Yerel Tatil Günü", impact: "high_demand" }
];

const slotsCollection = collection(db, "slots");

export const getAllSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = query(slotsCollection, where("status", "in", ["available", "ai_priced"]));
    const snapshot = await getDocs(q);
    const slots = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const buySlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slotRef = doc(db, "slots", id);
    const slotSnap = await getDoc(slotRef);
    
    if (!slotSnap.exists()) {
      res.status(404).json({ error: "Slot bulunamadı" });
      return;
    }
    
    await updateDoc(slotRef, {
      status: "owned",
      ownerId: "user_001"
    });
    
    res.json({ id, ...slotSnap.data(), status: "owned", ownerId: "user_001" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Satın alma başarısız" });
  }
};

export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const q = query(slotsCollection, where("ownerId", "==", userId), where("status", "==", "owned"));
    const snapshot = await getDocs(q);
    const slots = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Portfolyo yüklenemedi" });
  }
};

export const analyzeAndSell = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slotRef = doc(db, "slots", id);
    const slotSnap = await getDoc(slotRef);
    
    if (!slotSnap.exists()) {
      res.status(404).json({ error: "Slot bulunamadı" });
      return;
    }

    const slotData = slotSnap.data();

    // Start SSE stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const steps = [
      "🔍 Piyasa olayları taranıyor...",
      "📊 Tarihsel fiyat verisi analiz ediliyor...",
      "🌦️ Dış etkenler değerlendiriliyor...",
      "💡 Optimum fiyat hesaplanıyor..."
    ];
    
    for (const step of steps) {
      res.write(`data: ${JSON.stringify({ step })}\n\n`);
      await new Promise(r => setTimeout(r, 800));
    }

    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

    let result = { newPrice: slotData.currentPrice, aiReason: "Piyasa koşulları standart." };

    if (ai) {
      const prompt = `You are a dynamic pricing agent. Target slot: ${slotData.name}. 
Original price: ${slotData.originalPrice} USD. 
Current market event: ${randomEvent.event} (Impact: ${randomEvent.impact}). 
The current price is ${slotData.currentPrice} USD.
Calculate a new fair market price. 
Return ONLY a raw JSON object with no markdown, no backticks, no explanation outside JSON.
Format: {"newPrice": <number>, "aiReason": "<one sentence>"}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
        });

        const text = response.text || "{}";
        const cleanedText = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        result = JSON.parse(cleanedText);
      } catch (aiError) {
        console.error("AI pricing failed", aiError);
      }
    }

    const newHistoryEntry = {
      price: result.newPrice || slotData.currentPrice,
      timestamp: new Date().toISOString(),
      reason: result.aiReason || "Yapay zeka analizi"
    };

    const currentHistory = slotData.priceHistory || [];

    const updates = {
      currentPrice: result.newPrice || slotData.currentPrice,
      aiReason: result.aiReason || "Yapay zeka analizini tamamladı.",
      status: "ai_priced",
      ownerId: null,
      isAiPriced: true,
      priceHistory: [...currentHistory, newHistoryEntry]
    };
    
    await updateDoc(slotRef, updates);
    
    res.write(`data: ${JSON.stringify({ done: true, result: { id, ...slotData, ...updates } })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Analiz hatası:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Analiz başarısız" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Analiz başarısız" })}\n\n`);
      res.end();
    }
  }
};

export const seedSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    // Basic wipe: getting all to delete them manually (for a simple MVP this is fine)
    const snapshot = await getDocs(slotsCollection);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "slots", docSnap.id));
    }

    const sampleSlots = [
      { name: "Çatı Katı Restoranı - 20:00", category: "restaurant", originalPrice: 100, currentPrice: 100, date: "2024-06-15", location: "Şehir Merkezi", status: "available", ownerId: null, isAiPriced: false, aiReason: null },
      { name: "Lüks Spa Masajı - 14:00", category: "clinic", originalPrice: 80, currentPrice: 80, date: "2024-06-16", location: "Wellness Center", status: "available", ownerId: null, isAiPriced: false, aiReason: null },
      { name: "Butik Otel Odası - 1 Gece", category: "hotel", originalPrice: 200, currentPrice: 200, date: "2024-06-17", location: "Sahil Kenarı", status: "available", ownerId: null, isAiPriced: false, aiReason: null },
      { name: "Michelin Yıldızlı Akşam Yemeği - 19:30", category: "restaurant", originalPrice: 250, currentPrice: 250, date: "2024-06-18", location: "Boğaz Manzarası", status: "available", ownerId: null, isAiPriced: false, aiReason: null },
      { name: "Diş Kontrolü - 10:00", category: "clinic", originalPrice: 50, currentPrice: 50, date: "2024-06-19", location: "Nişantaşı", status: "available", ownerId: null, isAiPriced: false, aiReason: null },
      { name: "Dağ Evi - Hafta Sonu", category: "hotel", originalPrice: 300, currentPrice: 300, date: "2024-06-20", location: "Uludağ", status: "available", ownerId: null, isAiPriced: false, aiReason: null }
    ];

    const timestamp = new Date().toISOString();
    for (const data of sampleSlots) {
      const newRef = doc(slotsCollection);
      const slotDataWithHistory = {
        ...data,
        priceHistory: [{ price: data.originalPrice, timestamp, reason: "Başlangıç fiyatı" }]
      };
      await setDoc(newRef, slotDataWithHistory);
    }
    res.json({ message: "Örnek veriler başarıyla eklendi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Örnek veri ekleme başarısız" });
  }
};

export const autoPriceRandomSlots = async () => {
  try {
    const q = query(slotsCollection, where("status", "in", ["available", "ai_priced"]));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return;
    
    const docs = snapshot.docs;
    const numToPick = Math.min(docs.length, Math.floor(Math.random() * 2) + 1);
    const pickedDocs = [];
    
    const shuffled = [...docs].sort(() => 0.5 - Math.random());
    pickedDocs.push(...shuffled.slice(0, numToPick));
    
    for (const docSnap of pickedDocs) {
      const slotData = docSnap.data();
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      
      let result = { newPrice: slotData.currentPrice, aiReason: `Otomatik analiz: ${randomEvent.event}` };
      
      if (ai) {
        const prompt = `You are a dynamic pricing agent. Target slot: ${slotData.name}. 
Original price: ${slotData.originalPrice} USD. 
Current market event: ${randomEvent.event} (Impact: ${randomEvent.impact}). 
The current price is ${slotData.currentPrice} USD.
Calculate a new fair market price. 
Return ONLY a raw JSON object with no markdown, no backticks, no explanation outside JSON.
Format: {"newPrice": <number>, "aiReason": "<one sentence>"}`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
          });

          const text = response.text || "{}";
          const cleanedText = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
          result = JSON.parse(cleanedText);
        } catch (aiError) {
          console.error("Auto AI pricing failed for", slotData.name, aiError);
        }
      }
      
      const newHistoryEntry = {
        price: result.newPrice || slotData.currentPrice,
        timestamp: new Date().toISOString(),
        reason: result.aiReason || "Otomatik YZ analizi"
      };

      const currentHistory = slotData.priceHistory || [];

      const updates = {
        currentPrice: result.newPrice || slotData.currentPrice,
        aiReason: result.aiReason || "Otomatik YZ analizini tamamladı.",
        status: "ai_priced",
        isAiPriced: true,
        priceHistory: [...currentHistory, newHistoryEntry]
      };
      
      await updateDoc(docSnap.ref, updates);
      console.log(`[Auto AI] Priced: ${slotData.name} -> $${updates.currentPrice}`);
    }
  } catch (error) {
    console.error("Auto pricing interval error:", error);
  }
};
