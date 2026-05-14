const API_BASE = '/api/slots';

export const api = {
  getMarketSlots: async () => {
    const res = await fetch(API_BASE);
    return res.json();
  },
  getPortfolioSlots: async (userId: string) => {
    const res = await fetch(`${API_BASE}/portfolio/${userId}`);
    return res.json();
  },
  buySlot: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}/buy`, { method: 'POST' });
    return res.json();
  },
  analyzeAndSell: async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}/analyze-and-sell`, { method: 'POST' });
    return res.json();
  },
  seedSlots: async () => {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return res.json();
  }
};
