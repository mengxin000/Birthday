import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Eraser, Download, Sparkles } from 'lucide-react';

interface SignatureBoardProps {
  onBack: () => void;
}

const SignatureBoard: React.FC<SignatureBoardProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#f0abfc'); // Pink default

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Handle resizing
      const parent = canvas.parentElement;
      if (parent) {
          // Set actual canvas size to match display size for sharpness
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 4;
          ctx.shadowBlur = 10; // Neon effect
          ctx.shadowColor = color;
      }
    }
  }, []);

  // Update neon color when color state changes
  useEffect(() => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
          ctx.strokeStyle = color;
          ctx.shadowColor = color;
      }
  }, [color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
     const rect = canvas.getBoundingClientRect();
     let clientX, clientY;
     if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
     } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
     }
     return {
         x: clientX - rect.left,
         y: clientY - rect.top
     };
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if(canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
  };

  const downloadSignature = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Create a temporary canvas to draw background + signature
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;

      // Fill black background
      tCtx.fillStyle = '#000000';
      tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw original canvas
      tCtx.drawImage(canvas, 0, 0);
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `birthday-signature-${Date.now()}.png`;
      link.href = tempCanvas.toDataURL();
      link.click();
  };

  const colors = ['#f0abfc', '#38bdf8', '#bef264', '#fca5a5', '#ffffff'];

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/95 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h2 className="text-xl font-title text-blue-300">荧光签名板</h2>
        </div>
        <div className="flex gap-3">
            <button onClick={clearCanvas} className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors" title="清除">
                <Eraser className="w-5 h-5" />
            </button>
            <button onClick={downloadSignature} className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50 transition-all active:scale-95" title="保存图片">
                <Download className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-2xl border border-slate-700 relative overflow-hidden cursor-crosshair touch-none shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] ring-1 ring-slate-800">
        <div className="absolute top-4 left-4 pointer-events-none opacity-30">
             <Sparkles className="w-8 h-8 text-white" />
        </div>
        <canvas 
            ref={canvasRef}
            className="w-full h-full block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tools */}
      <div className="mt-4 flex flex-col items-center gap-2">
          <div className="text-slate-500 text-xs">选择笔触颜色</div>
          <div className="flex gap-4">
            {colors.map(c => (
                <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110 ring-2 ring-white/50' : 'border-transparent'}`}
                    style={{ backgroundColor: c, boxShadow: `0 0 10px ${c}` }}
                />
            ))}
          </div>
      </div>
    </div>
  );
};

export default SignatureBoard;