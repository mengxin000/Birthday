import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';

interface MemoryAlbumProps {
  onBack: () => void;
}

// Initial Mock images
const INITIAL_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', caption: '快乐开始的地方' },
  { src: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?w=400', caption: '惊喜派对！' },
  { src: 'https://images.unsplash.com/photo-1464349153912-657b7c0f006a?w=400', caption: '最好的礼物' },
];

const MemoryAlbum: React.FC<MemoryAlbumProps> = ({ onBack }) => {
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => [
            ...prev, 
            { src: event.target!.result as string, caption: '新的美好回忆' }
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-stone-900/95 backdrop-blur-xl p-4 overflow-y-auto relative">
       {/* Header */}
       <div className="flex items-center justify-between gap-4 mb-8 sticky top-0 z-50 bg-stone-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-2xl font-title text-amber-200">回忆小屋</h2>
        </div>
      </div>

      {/* Photo Grid - Scattered Polaroids */}
      <div className="flex-1 flex flex-wrap content-start justify-center gap-8 p-4 pb-32">
        
        {/* Upload Button Card */}
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-[200px] h-[240px] shrink-0 rounded-lg border-2 border-dashed border-stone-600 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 hover:border-amber-400 transition-all group"
        >
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-stone-400 font-hand text-lg group-hover:text-amber-200">贴一张新照片</span>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
            />
        </div>

        {photos.map((photo, i) => (
          <div 
            key={i}
            className="polaroid bg-white p-3 pb-10 shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer w-[200px] h-[240px] shrink-0 relative group"
            style={{ 
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          >
            <div className="w-full h-40 bg-gray-200 overflow-hidden mb-2 relative">
               <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="text-center font-hand text-slate-800 text-lg truncate px-1">
              {photo.caption}
            </div>
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm border border-white/20 rotate-2 shadow-sm"></div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-stone-500 pb-8 font-serif-sc">
        每一张照片都是时光的标本
      </div>
    </div>
  );
};

export default MemoryAlbum;