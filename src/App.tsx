/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MarketScreen } from "./screens/MarketScreen";
import { PortfolioScreen } from "./screens/PortfolioScreen";
import { AnalyzeScreen } from "./screens/AnalyzeScreen";
import { BottomNav } from "./components/BottomNav";
import { ToastProvider } from "./components/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#050505] text-white">
          <main className="flex-1 w-full max-w-md mx-auto bg-[#050505] relative">
            <Routes>
              <Route path="/" element={<MarketScreen />} />
              <Route path="/portfolio" element={<PortfolioScreen />} />
              <Route path="/analyze/:id" element={<AnalyzeScreen />} />
            </Routes>
            <BottomNav />
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}
