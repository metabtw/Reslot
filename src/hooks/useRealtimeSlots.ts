import { useState, useEffect } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

export function useRealtimeSlots() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slotsCollection = collection(db, "slots");
    const q = query(slotsCollection, where("status", "in", ["available", "ai_priced"]));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      setSlots(updated);
      setLoading(false);
    }, (error) => {
      console.error("Realtime fetch error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { slots, loading };
}
