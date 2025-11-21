import React, { useState } from 'react';
import { ArrowLeft, Gift, Sparkles, Ticket } from 'lucide-react';

interface GiftBoxProps {
  onBack: () => void;
}

const GIFTS = [
  { id: 1, title: "万能家务券", desc: "凭此券可指定一人做一次家务", icon: "🧹" },
  { id: 2, title: "奶茶畅饮卡", desc: "本周内有人请喝一杯奶茶", icon: "🥤" },
  { id: 3, title: "绝对话语权", desc: "在下次聚会中拥有一次决定权", icon: "👑" },
  { id: 4, title: "彩虹屁专属", desc: "获得大家长达1分钟的夸赞", icon: "🌈" },
  { id: 5, title: "现金红包0.52元", desc: "运气爆棚！快找发红包的人兑现", icon: "🧧" },
  { id: 6, title: "清空购物车", desc: "限额 1 元 (开玩笑的，其实是0.52元)", icon: "🛒" },
];

const GiftBox: React.FC<GiftBoxProps> = ({ onBack }) => {
  const [step, setStep] = useState<'closed' | 'shaking' | 'opened'>('closed');
  const [prize, setPrize] = useState(GIFTS[0]);

  const handleOpen = () => {
    if (step === 'closed') {
      setStep('shaking');
      setTimeout(() => {
        const randomGift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
        setPrize(randomGift);
        setStep('opened');
      }, 1500);
    }
  };

  const handleReset = () => {
    setStep('closed');
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-950 pointer-events-none"></div>
      
      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <button onClick={onBack} className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm border border-white/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        <h2 className="text-3xl md:text-4xl font-title text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400 mb-8 drop-shadow-lg">
          幸运盲盒
        </h2>

        <div className="relative h-80 w-full flex items-center justify-center">
          {step !== 'opened' ? (
            <div 
              onClick={handleOpen}
              className={`cursor-pointer transition-all duration-300 ${step === 'shaking' ? 'shake-hard scale-110' : 'hover:scale-105 animate-bounce'}`}
            >
              <div className="relative w-48 h-48">
                 {/* Box Body */}
                 <div className="absolute bottom-0 w-48 h-36 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-[0_20px_50px_rgba(220,38,38,0.4)] border-4 border-red-800"></div>
                 {/* Box Lid */}
                 <div className="absolute top-12 -left-2 w-52 h-12 bg-red-600 rounded-lg shadow-md border-b-4 border-red-800"></div>
                 {/* Ribbon Vertical */}
                 <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-36 bg-yellow-400 shadow-sm"></div>
                 {/* Ribbon Horizontal (Lid) */}
                 <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-12 bg-yellow-400 shadow-sm"></div>
                 {/* Bow */}
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-16 flex justify-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full absolute top-4 z-10 shadow-inner border border-yellow-300"></div>
                    <div className="w-14 h-14 border-[6px] border-yellow-400 rounded-full absolute left-0 top-4 transform -rotate-12"></div>
                    <div className="w-14 h-14 border-[6px] border-yellow-400 rounded-full absolute right-0 top-4 transform rotate-12"></div>
                 </div>
                 
                 {step === 'closed' && (
                   <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-yellow-200 font-bold whitespace-nowrap animate-pulse">
                     点击拆开惊喜
                   </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up flex flex-col items-center text-center">
              {/* Light Burst */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
              
              {/* Prize Card */}
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-500/50 p-8 rounded-2xl shadow-2xl transform rotate-1 max-w-xs w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
                
                <div className="text-6xl mb-4 animate-bounce">{prize.icon}</div>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">{prize.title}</h3>
                <p className="text-slate-300 mb-6">{prize.desc}</p>
                
                <div className="flex justify-center">
                  <div className="bg-black/30 px-4 py-1 rounded-full text-xs text-slate-500 border border-white/5">
                     兑换码: HAPPY-BDAY-{Math.floor(Math.random() * 1000)}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleReset}
                className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full transition-all border border-white/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                再抽一次
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftBox;