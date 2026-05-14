import { Link, useLocation } from "react-router-dom";
import { Clock, Calendar, MapPin } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: "Piyasa", path: "/", icon: <MapPin className="w-6 h-6 mb-1" /> },
    { name: "Portföyüm", path: "/portfolio", icon: <Calendar className="w-6 h-6 mb-1" /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0A0A0A] border-t border-[#1A1A1A] pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/portfolio" && location.pathname.startsWith("/analyze"));
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-white' : 'text-gray-500'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
