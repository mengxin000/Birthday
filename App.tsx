import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import EnvelopeIntro from './components/EnvelopeIntro';
import Dashboard from './components/Dashboard';
import VirtualCake from './components/VirtualCake';
import WishGenerator from './components/WishGenerator';
import MemoryAlbum from './components/MemoryAlbum';
import VoiceRecorder from './components/VoiceRecorder';
import SignatureBoard from './components/SignatureBoard';
import GiftBox from './components/GiftBox';
import DesktopPet from './components/DesktopPet';
import { ViewState } from './types';

// Confetti Particle for global effects
const Particle: React.FC<{ x: number, y: number, color: string }> = ({ x, y, color }) => (
  <div 
    className="click-sparkle w-2 h-2 rounded-full absolute z-[9999]"
    style={{ 
      left: x, 
      top: y, 
      backgroundColor: color,
      boxShadow: `0 0 10px ${color}`
    }}
  />
);

// Modal Wrapper for Apps
const AppWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
    <div className="w-full h-full md:h-[90vh] md:w-[90vw] md:rounded-3xl overflow-hidden relative shadow-2xl bg-slate-900/90 border border-white/20">
      {children}
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<ViewState>('INTRO_ENVELOPE');
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const particleId = useRef(0);

  // Global Click Effect (Fireworks/Confetti)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Spawn particles
      const colors = ['#f472b6', '#fbbf24', '#c084fc', '#60a5fa', '#ffffff'];
      const newParticles = [];
      
      for(let i=0; i<8; i++) {
         const angle = (Math.PI * 2 * i) / 8;
         const velocity = 20 + Math.random() * 30;
         // Note: simple visual simulation, actual physics would need requestAnimationFrame loop
         newParticles.push({
            id: particleId.current++,
            x: e.clientX + (Math.random() * 40 - 20),
            y: e.clientY + (Math.random() * 40 - 20),
            color: colors[Math.floor(Math.random() * colors.length)]
         });
      }
      
      setParticles(prev => [...prev, ...newParticles]);

      // Cleanup particles
      setTimeout(() => {
        setParticles(prev => prev.slice(8));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      
      {/* Dreamy Star Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 pointer-events-none"></div>
      
      {/* Animated Gradient Orb (Ambient Light) */}
      <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-pink-500/20 blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse delay-1000 pointer-events-none"></div>

      {/* Global Particles */}
      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}

      {/* Desktop Pet - Meowbit */}
      {view !== 'INTRO_ENVELOPE' && <DesktopPet />}

      {/* View Router */}
      {view === 'INTRO_ENVELOPE' && (
        <EnvelopeIntro onComplete={() => setView('DASHBOARD')} />
      )}

      {view === 'DASHBOARD' && (
        <Dashboard onNavigate={setView} />
      )}

      {view === 'APP_CAKE' && (
        <AppWindow>
          <div className="h-full w-full relative bg-slate-900/80 p-4 flex flex-col">
             <button onClick={() => setView('DASHBOARD')} className="absolute top-4 left-4 z-50 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
             </button>
             <VirtualCake onBlowout={() => {}} isCelebrated={false} onReset={() => {}} />
          </div>
        </AppWindow>
      )}

      {view === 'APP_WISH' && (
        <AppWindow>
           <div className="h-full w-full p-4 bg-slate-900/90 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setView('DASHBOARD')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-xl font-title text-purple-300">AI 祝福工坊</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <WishGenerator />
              </div>
           </div>
        </AppWindow>
      )}

      {view === 'APP_ALBUM' && (
        <AppWindow>
          <MemoryAlbum onBack={() => setView('DASHBOARD')} />
        </AppWindow>
      )}

      {view === 'APP_RECORDER' && (
        <AppWindow>
          <VoiceRecorder onBack={() => setView('DASHBOARD')} />
        </AppWindow>
      )}

      {view === 'APP_SIGNATURE' && (
        <AppWindow>
          <SignatureBoard onBack={() => setView('DASHBOARD')} />
        </AppWindow>
      )}

      {view === 'APP_GIFT' && (
        <AppWindow>
          <GiftBox onBack={() => setView('DASHBOARD')} />
        </AppWindow>
      )}

    </div>
  );
}