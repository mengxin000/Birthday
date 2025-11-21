import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Play, Save } from 'lucide-react';

interface VoiceRecorderProps {
  onBack: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        // Stop Visualizer
        if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioUrl(null);

      // Visualize
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      visualize();

    } catch (err) {
      console.error("Error accessing mic:", err);
      alert("无法访问麦克风");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#1e293b'; // Background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900/90 backdrop-blur-xl p-6">
       <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-2xl font-title text-orange-400">时光留声机</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Visualizer Display */}
        <div className="w-full max-w-md bg-slate-800 rounded-xl overflow-hidden border-4 border-slate-700 shadow-inner h-48 relative">
            <canvas ref={canvasRef} width="400" height="200" className="w-full h-full opacity-80"></canvas>
            <div className="absolute top-4 right-4 text-xs font-mono text-green-400 flex items-center gap-2">
                {isRecording && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                {isRecording ? "REC" : "STANDBY"}
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
           {!isRecording ? (
             <button onClick={startRecording} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all transform hover:scale-110">
                <Mic className="w-8 h-8 text-white" />
             </button>
           ) : (
             <button onClick={stopRecording} className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center shadow-lg border-2 border-slate-500">
                <Square className="w-6 h-6 text-white" />
             </button>
           )}
        </div>

        {audioUrl && (
          <div className="w-full max-w-md bg-slate-800 p-4 rounded-lg animate-fade-in-up border border-white/10">
            <div className="flex items-center justify-between gap-4">
                <audio controls src={audioUrl} className="flex-1 h-8" />
                <button className="p-2 bg-green-600 rounded-full hover:bg-green-500" title="保存 (模拟)">
                    <Save className="w-4 h-4" />
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">录音已生成！点击右侧保存到生日档案。</p>
          </div>
        )}

        <p className="text-slate-500 text-sm max-w-xs text-center">
           在这里留下你想对现在的自己，或者未来的自己说的话吧。
        </p>
      </div>
    </div>
  );
};

export default VoiceRecorder;