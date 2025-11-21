import React, { useState, useEffect, useRef } from 'react';

const DesktopPet: React.FC = () => {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [mood, setMood] = useState<'idle' | 'happy' | 'drag' | 'wink'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Random idle behavior
  useEffect(() => {
    const messages = [
      "我是喵比特，你的生日守护神！", 
      "想不想收礼物？🎁", 
      "吹个蜡烛许愿吧！", 
      "今天你最好看！✨",
      "别动，我在瞄准幸福！🏹",
      "本喵累了，求摸摸~",
      "爸爸呢?",
      "生日快乐!"
    ];

    const interval = setInterval(() => {
      if (!isDragging && Math.random() > 0.6) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        speak(randomMsg);
        
        // Random blink/wink
        const randomAction = Math.random();
        if(randomAction > 0.7) setMood('wink');
        else setMood('happy');

        setTimeout(() => setMood('idle'), 2000);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isDragging]);

  const speak = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setMood('drag');
    dragOffset.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setPosition({
        x: clientX - dragOffset.current.x,
        y: clientY - dragOffset.current.y
      });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setMood('idle');
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  
  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleClick = () => {
    if (!isDragging) {
      setMood('happy');
      speak("啾咪！💖 愿望成真！");
      setTimeout(() => setMood('idle'), 1500);
    }
  };

  return (
    <div 
      className="fixed z-[9999] cursor-grab active:cursor-grabbing select-none touch-none transition-transform duration-100"
      style={{ left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={handleClick}
    >
      {/* Speech Bubble */}
      {message && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-sm text-pink-600 px-4 py-2 rounded-2xl rounded-bl-none shadow-xl animate-bounce border-2 border-pink-100 font-bold text-sm z-50">
          {message}
        </div>
      )}

      {/* Meowbit SVG */}
      <div className={`w-28 h-28 transition-transform duration-300 ${mood === 'happy' ? 'animate-bounce' : ''} ${mood === 'drag' ? 'scale-110 rotate-6' : ''}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
           <defs>
             <linearGradient id="catBody" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#fbcfe8" /> {/* pink-200 */}
               <stop offset="100%" stopColor="#f472b6" /> {/* pink-400 */}
             </linearGradient>
             <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
           </defs>

           {/* Wings */}
           <g className="animate-[pulse_2s_infinite]">
             <path d="M50 100 Q20 80 10 110 Q30 130 60 120 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
             <path d="M150 100 Q180 80 190 110 Q170 130 140 120 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
           </g>

           {/* Halo */}
           <ellipse cx="100" cy="45" rx="40" ry="10" fill="none" stroke="#facc15" strokeWidth="4" filter="url(#glow)" className="animate-[bounce_3s_infinite]" />

           {/* Body */}
           <path d="M60 160 Q50 180 70 185 L130 185 Q150 180 140 160 L130 100 L70 100 Z" fill="url(#catBody)" />
           
           {/* Head */}
           <circle cx="100" cy="90" r="50" fill="url(#catBody)" />
           
           {/* Ears */}
           <path d="M60 60 L50 30 L85 55 Z" fill="#f472b6" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round" />
           <path d="M140 60 L150 30 L115 55 Z" fill="#f472b6" stroke="#ec4899" strokeWidth="2" strokeLinejoin="round" />

           {/* Face Details */}
           {mood === 'wink' ? (
             <>
                <path d="M75 85 Q85 85 95 85" stroke="#374151" strokeWidth="3" fill="none" />
                <circle cx="125" cy="85" r="5" fill="#374151" />
             </>
           ) : mood === 'happy' ? (
             <>
                <path d="M75 85 Q85 80 95 85" stroke="#374151" strokeWidth="3" fill="none" />
                <path d="M105 85 Q115 80 125 85" stroke="#374151" strokeWidth="3" fill="none" />
             </>
           ) : (
             <>
                <circle cx="80" cy="85" r="5" fill="#374151" />
                <circle cx="120" cy="85" r="5" fill="#374151" />
                <circle cx="82" cy="83" r="2" fill="white" />
                <circle cx="122" cy="83" r="2" fill="white" />
             </>
           )}
           
           {/* Nose & Mouth */}
           <path d="M95 95 L105 95 L100 100 Z" fill="#ec4899" />
           <path d="M95 105 Q100 110 105 105" stroke="#374151" strokeWidth="2" fill="none" />
           
           {/* Whiskers */}
           <path d="M60 95 L40 90 M60 100 L40 105" stroke="#374151" strokeWidth="2" opacity="0.6" />
           <path d="M140 95 L160 90 M140 100 L160 105" stroke="#374151" strokeWidth="2" opacity="0.6" />

           {/* Cupid Bow */}
           <g transform="translate(120, 130) rotate(-15)">
             <path d="M0 0 Q20 10 0 20" fill="none" stroke="#fcd34d" strokeWidth="3" />
             <line x1="0" y1="0" x2="0" y2="20" stroke="#fcd34d" strokeWidth="1" />
             <path d="M-5 10 L15 10" stroke="#f43f5e" strokeWidth="2" />
             <path d="M15 10 L10 7 M15 10 L10 13" stroke="#f43f5e" strokeWidth="2" />
           </g>

           {/* Sash */}
           <path d="M65 160 Q100 150 135 180" stroke="white" strokeWidth="8" strokeOpacity="0.5" fill="none" />

        </svg>
      </div>
    </div>
  );
};

export default DesktopPet;