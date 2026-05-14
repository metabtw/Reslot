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
import { useAuth, AuthContext } from "./hooks/useAuth";
import { LoginScreen } from "./screens/LoginScreen";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen bg-[#050505] text-white">Yükleniyor...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#050505] text-white">
        <main className="flex-1 w-full max-w-md mx-auto bg-[#050505] relative">
          <LoginScreen />
        </main>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
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
    </AuthContext.Provider>
  );
}
