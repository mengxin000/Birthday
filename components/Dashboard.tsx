import React from 'react';
import { Cake, Camera, Mic, PenTool, Sparkles, Gift } from 'lucide-react';
import { AppIconProps, ViewState } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ label, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center gap-3 group cursor-pointer"
  >
    <div 
      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_var(--tw-shadow-color)] active:scale-95 border border-white/20 backdrop-blur-sm relative overflow-hidden`}
      style={{ backgroundColor: `${color}cc`, '--tw-shadow-color': color } as any}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
      <div className="text-white w-8 h-8 md:w-10 md:h-10 flex justify-center items-center drop-shadow-md">
          {icon}
      </div>
    </div>
    <span className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm tracking-wide">
        {label}
    </span>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const apps = [
    { label: "许愿蛋糕", icon: <Cake />, color: "#db2777", view: 'APP_CAKE' },
    { label: "AI 祝福", icon: <Sparkles />, color: "#7c3aed", view: 'APP_WISH' },
    { label: "惊喜盲盒", icon: <Gift />, color: "#f59e0b", view: 'APP_GIFT' },
    { label: "回忆相册", icon: <Camera />, color: "#059669", view: 'APP_ALBUM' },
    { label: "留声机", icon: <Mic />, color: "#ea580c", view: 'APP_RECORDER' },
    { label: "签名板", icon: <PenTool />, color: "#2563eb", view: 'APP_SIGNATURE' },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 relative z-10">
      
      {/* Header */}
      <div className="absolute top-10 text-center animate-fade-in-down w-full px-4">
        <h1 className="text-5xl md:text-7xl font-title text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)] mb-2">
          念念生日快乐
        </h1>
        <p className="text-indigo-200/80 font-light tracking-widest uppercase text-xs md:text-sm">Birthday ProMinMAX V2.0</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-14 max-w-4xl w-full animate-fade-in-up mt-10">
        {apps.map((app) => (
          <div key={app.label} className="flex justify-center">
            <AppIcon 
              label={app.label} 
              icon={app.icon} 
              color={app.color} 
              onClick={() => onNavigate(app.view as ViewState)}
            />
          </div>
        ))}
      </div>
      
      {/* Footer Hint */}
      <div className="absolute bottom-8 text-indigo-300/60 text-xs animate-pulse">
         点击屏幕空白处释放烟花 ✨
      </div>
    </div>
  );
};

export default Dashboard;