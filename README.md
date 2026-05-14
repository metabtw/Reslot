<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Reslot: AI-Powered Dynamic Slot Marketplace

Reslot is a modern web application that allows users to buy and sell reservation slots (such as restaurant tables, hotel rooms, spa appointments) on a dynamic market. The platform utilizes Gemini AI to analyze market events, historical data, and external factors to automatically adjust slot prices.

## 🌟 Key Features

### ⚡ Real-Time Market Updates
Experience a live market environment with real-time price updates. Powered by **Firestore `onSnapshot`**, any price changes made by the AI or user purchases are instantly reflected on the Market screen for all users, providing a true "live market" feel without needing to refresh the page.

### 🧠 AI Reasoning Visualization (Streaming)
When you choose to analyze and re-price a slot in your portfolio, the Gemini AI engine springs into action. Using **Server-Sent Events (SSE)**, the application streams the AI's "thought process" in real-time, showing steps like scanning market events, analyzing historical prices, and calculating the optimum value with engaging animations.

### 📈 Dynamic Price History & Graphs
Every slot tracks its complete price history from inception to its current value. Reslot uses **Recharts** to render beautiful, interactive sparkline graphs directly on the slot cards, allowing users to visually track price trends at a glance.

### 🔥 Market Sentiment Indicator (Market Pulse)
Keep your finger on the pulse of the market. The application calculates the average price change across all available slots and provides a real-time sentiment indicator—showing whether the market is experiencing High Demand (🔥), Low Demand (❄️), or is currently Balanced (⚖️).

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
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
2. **Buy Slots:** Purchase a slot to add it to your Portfolio.
3. **AI Analysis:** Go to your Portfolio, select a slot, and click "Piyasayı Analiz Et & Sat". Watch the AI stream its reasoning and set a new, dynamic market price. Return to the Market to see the updated price and graph!
