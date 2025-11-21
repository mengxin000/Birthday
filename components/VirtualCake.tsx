import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Wind, RotateCcw } from 'lucide-react';

interface VirtualCakeProps {
  onBlowout: () => void;
  isCelebrated: boolean; // Kept for compatibility, but we might manage state internally for the standalone app
  onReset: () => void;
}

const VirtualCake: React.FC<VirtualCakeProps> = ({ onBlowout: externalBlowout, isCelebrated: externalCelebrated, onReset: externalReset }) => {
  // Local state management for the component when used in the OS window
  const [localCelebrated, setLocalCelebrated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0);
  const [micVolume, setMicVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const BLOW_THRESHOLD = 25;
  const BLOW_SPEED = 1.5;
  const DECAY_SPEED = 0.5;

  const startListening = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.3;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      detectBlow();
    } catch (err) {
      console.error("Mic Error:", err);
      setError("无法访问麦克风。点击蜡烛也可以直接吹灭哦！");
      setIsListening(false);
    }
  };

  const stopListening = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsListening(false);
    setMicVolume(0);
  }, []);

  const detectBlow = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;
    
    setMicVolume(average);

    if (average > BLOW_THRESHOLD) {
        const intensity = Math.min((average - BLOW_THRESHOLD) / 10, 3);
        progressRef.current = Math.min(progressRef.current + (BLOW_SPEED * intensity), 100);
    } else {
        progressRef.current = Math.max(progressRef.current - DECAY_SPEED, 0);
    }

    setBlowProgress(progressRef.current);

    if (progressRef.current >= 100) {
      extinguishCandle();
    } else {
      animationFrameRef.current = requestAnimationFrame(detectBlow);
    }
  };

  const extinguishCandle = () => {
    stopListening();
    progressRef.current = 0;
    setLocalCelebrated(true);
    externalBlowout();
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const handleManualBlow = () => {
    if (!localCelebrated) {
       extinguishCandle();
    }
  };
  
  const handleReset = () => {
    setLocalCelebrated(false);
    setBlowProgress(0);
    externalReset();
  }
  
  const flameStyle = isListening ? {
      transform: `scale(${1 - (micVolume / 255)}) skewX(${Math.sin(Date.now() / 50) * (micVolume / 5)}deg)`,
      opacity: Math.max(0.3, 1 - (blowProgress / 120))
  } : {};

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden">
      
      {/* Confetti Background only for this window when celebrated */}
      {localCelebrated && (
         <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
               <div key={i} className="absolute top-0 w-2 h-2 bg-yellow-400 animate-pulse" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`}}></div>
            ))}
         </div>
      )}

      {localCelebrated && (
        <div className="absolute top-10 inset-x-0 flex items-center justify-center z-30 pointer-events-none">
           <h2 className="text-4xl md:text-6xl font-title text-yellow-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-bounce text-center">
             许愿成功!
           </h2>
        </div>
      )}

      <div 
        className={`relative mt-10 mb-12 cursor-pointer transition-transform duration-300 ${micVolume > BLOW_THRESHOLD + 10 ? 'shake-hard' : ''} ${localCelebrated ? 'scale-110' : 'hover:scale-105'}`} 
        onClick={handleManualBlow}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl transition-all duration-1000 ${localCelebrated ? 'bg-yellow-400/40 w-96 h-96' : ''}`}></div>

        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-8 bg-slate-700/80 rounded-[100%] shadow-2xl z-0 border-b-4 border-slate-800"></div>
        
        <div className="relative z-10">
             <div className="w-56 h-20 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-700 rounded-xl shadow-lg relative mx-auto">
                <div className="absolute inset-x-0 top-0 h-4 bg-black/10 rounded-t-xl"></div>
             </div>
             <div className="w-44 h-16 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 rounded-xl shadow-md relative mx-auto -mt-2">
                <div className="absolute -top-2 -left-2 -right-2 h-8 bg-white rounded-full flex justify-around items-end overflow-hidden pb-2">
                   {[...Array(7)].map((_, i) => (
                       <div key={i} className="w-8 h-8 bg-pink-400 rounded-full transform translate-y-4 shadow-inner"></div>
                   ))}
                </div>
             </div>
        </div>

        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-6 h-28 bg-gradient-to-r from-yellow-50 to-yellow-100 border-x border-yellow-200 rounded-sm z-10 shadow-sm">
           <div className="absolute top-4 left-0 w-full h-3 bg-blue-400/40 rotate-12"></div>
           <div className="absolute top-12 left-0 w-full h-3 bg-purple-400/40 rotate-12"></div>
           <div className="absolute top-20 left-0 w-full h-3 bg-green-400/40 rotate-12"></div>
        </div>

        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-black/60 z-10"></div>

        {!localCelebrated ? (
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-20 origin-bottom transition-all duration-75" style={flameStyle}>
             <div className="relative w-10 h-14">
               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-blue-200 rounded-full blur-[1px] opacity-80"></div>
               <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-10 bg-yellow-400 rounded-full blur-[2px] flame-animate"></div>
               <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
             </div>
          </div>
        ) : (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
             <div className="w-4 h-16 bg-gray-400/50 blur-xl opacity-0 smoke-animate"></div>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs z-20 relative">
        {!localCelebrated ? (
          <>
            {!isListening ? (
               <button 
                onClick={startListening}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 px-6 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95"
               >
                 <Mic className="w-6 h-6 animate-bounce" />
                 开启吹气感应
               </button>
            ) : (
              <div className="space-y-3 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                 <div className="flex items-center justify-center gap-2 text-pink-300 font-medium animate-pulse">
                   <Wind className="w-5 h-5" />
                   {blowProgress < 30 ? "深吸一口气..." : blowProgress < 70 ? "用力吹！" : "马上灭了！"}
                 </div>
                 
                 <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
                   <div 
                     className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-75 ease-out"
                     style={{ width: `${blowProgress}%` }}
                   ></div>
                 </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center animate-fade-in-up">
             <button 
               onClick={handleReset} 
               className="flex items-center justify-center gap-2 mx-auto bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full backdrop-blur-sm border border-white/20 transition-all"
             >
               <RotateCcw className="w-4 h-4" />
               再许一次愿
             </button>
          </div>
        )}
        
        {error && <div className="mt-4 text-red-300 text-xs text-center">{error}</div>}
      </div>
    </div>
  );
};

export default VirtualCake;