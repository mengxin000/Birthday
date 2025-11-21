import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeIntroProps {
  onComplete: () => void;
}

const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Wait for animation to finish extracting letter
      setTimeout(() => {
        setIsReading(true);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 p-4">
      {!isReading ? (
        <div className="envelope-perspective cursor-pointer group" onClick={handleOpen}>
          <div className={`relative w-[300px] h-[200px] bg-pink-600 shadow-2xl transition-all duration-1000 ${isOpen ? 'translate-y-[100px]' : 'hover:scale-105'}`}>
            
            {/* Envelope Flap */}
            <div className={`absolute top-0 left-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[100px] border-t-pink-700 origin-top transition-transform duration-1000 z-20 ${isOpen ? 'rotate-x-180 -z-10' : ''}`} style={{ transformOrigin: 'top' }}></div>
            
            {/* Envelope Body (Pocket) */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[150px] border-l-pink-600 border-r-[150px] border-r-pink-600 border-b-[100px] border-b-pink-500 z-10"></div>
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-b-[100px] border-b-pink-800/20 z-10"></div>

            {/* Seal */}
            <div className={`absolute top-[80px] left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-12 h-12 bg-red-800 rounded-full shadow-lg flex items-center justify-center border-2 border-red-900">
                <Heart className="w-6 h-6 text-red-200 fill-red-200" />
              </div>
            </div>

            {/* The Letter */}
            <div className={`absolute top-2 left-2 right-2 bottom-2 bg-white rounded shadow-md p-4 flex flex-col items-center justify-center transition-all duration-1000 z-0 ${isOpen ? 'letter-extract' : ''}`}>
               <div className="text-xs text-slate-400 mb-2">致 最特别的你</div>
               <div className="w-full h-0.5 bg-slate-200 mb-2"></div>
               <div className="w-3/4 h-0.5 bg-slate-200 mb-2"></div>
               <Heart className="w-4 h-4 text-pink-400 mt-2 fill-pink-400" />
            </div>
          </div>
          {!isOpen && (
             <div className="mt-12 text-center text-pink-200 animate-pulse font-title tracking-widest">
               点击开启你的专属惊喜
             </div>
          )}
        </div>
      ) : (
        // The Actual Letter View
        <div className="max-w-md w-full bg-[#fffaf0] text-slate-800 rounded-sm shadow-2xl p-8 relative animate-fade-in-up rotate-1">
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-pink-600 mb-4 font-serif-sc">亲爱的寿星:</h2>
          <p className="text-lg leading-relaxed font-hand mb-6 text-slate-700">
            见信如晤。
            <br/><br/>
            今天是个特殊的日子。我为你准备了一个小小的元宇宙，这里没有烦恼，只有快乐。
            <br/><br/>
            里面藏着蛋糕、烟花，还有一段未完待续的记忆。准备好去探索了吗？
          </p>
          <div className="flex justify-end">
            <button 
              onClick={onComplete}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              进入生日元宇宙 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvelopeIntro;