import { useState, useEffect } from "react";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

export function useRealtimePortfolio(userId: string) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const slotsCollection = collection(db, "slots");
    const q = query(slotsCollection, where("ownerId", "==", userId), where("status", "==", "owned"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
      setSlots(updated);
      setLoading(false);
    }, (error) => {
      console.error("Portfolio realtime fetch error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { slots, loading };
}
