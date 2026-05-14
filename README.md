# Reslot: AI-Powered Dynamic Slot Marketplace

Reslot is a modern web application that allows users to buy and sell reservation slots (such as restaurant tables, hotel rooms, spa appointments) on a dynamic market. The platform utilizes Gemini AI to analyze market events, historical data, and external factors to automatically adjust slot prices.

## 🌟 Key Features

### ⚡ Real-Time Market & Portfolio Updates
Experience a live market environment with real-time price updates. Powered by **Firestore `onSnapshot`**, any price changes made by the AI or user purchases are instantly reflected on both the Market and Portfolio screens for all users, providing a true "live market" feel without needing to refresh the page.

### 🧠 AI Reasoning Visualization (Streaming)
When you choose to analyze and re-price a slot in your portfolio, the Gemini AI engine springs into action. Using **Server-Sent Events (SSE)**, the application streams the AI's "thought process" in real-time, showing steps like scanning market events, analyzing historical prices, and calculating the optimum value with engaging animations.

### 📈 Dynamic Price History & Graphs
Every slot tracks its complete price history from inception to its current value. Reslot uses **Recharts** to render beautiful, interactive sparkline graphs directly on the slot cards, allowing users to visually track price trends at a glance.

### 🔥 Market Pulse & Portfolio Stats
Keep your finger on the pulse of the market. 
- **Market Pulse:** Calculates the average price change across all available slots and provides a real-time sentiment indicator (🔥 High Demand, ❄️ Low Demand, ⚖️ Balanced).
- **Portfolio Stats Dashboard:** Instantly tracks your Total Investment, Current Value, and P/L (Profit/Loss) with dynamic colors (Green/Red) at the top of your portfolio.

### 🤖 Auto AI Pricing Loop (Simulated Live Market)
A background process automatically picks random slots every 60 seconds and reprices them using Gemini AI. This creates a "breathing, self-updating market" effect, perfect for demos and giving users a truly dynamic experience.

### 🎨 Category Theming & Notifications
- **Categorized Cards:** Slots visually stand out with tailored icons and color themes based on their category (e.g., Orange Utensils for Restaurants, Rose HeartPulse for Clinics).
- **Toast Notifications:** Built with `framer-motion`, slick toast notifications guide the user through buying and analyzing actions.
- **Demo Mode:** A hidden button triggers a full end-to-end flow (seed, buy, and analyze) automatically for seamless presentations.

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Framer Motion
- **Backend:** Node.js, Express, Firebase Firestore
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Data Visualization:** Recharts, Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Firebase project with Firestore enabled
- A Google Gemini API Key

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env.local` or `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   Ensure your Firebase configuration (`firebase-applet-config.json`) is correctly set up in the root directory.

3. **Run the Application Locally:**
   ```bash
   npm run dev
   ```
   This will start both the backend Express server and the Vite development server concurrently.

## 💡 How to Use
1. **Marketplace:** Navigate to the Market screen to see available slots. Click "Veri Yükle" (Seed Data) to populate the database with sample slots.
2. **Buy Slots:** Purchase a slot to add it to your Portfolio. Watch for the sleek toast confirmation!
3. **AI Analysis:** Go to your Portfolio, select a slot, and click "Piyasayı Analiz Et & Sat". Watch the AI stream its reasoning and set a new, dynamic market price. Return to the Market to see the updated price and graph!
4. **Auto-Pilot Market:** Stay on the Market page and watch prices autonomously update every 60 seconds as the background AI agent analyzes market shifts.
