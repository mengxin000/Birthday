import React, { useState } from 'react';
import { Wand2, Copy, Check, RefreshCw, MessageSquareHeart } from 'lucide-react';
import { WishRequest } from '../types';
import { generateBirthdayWish } from '../services/geminiService';

const WishGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState<WishRequest>({
    name: '',
    age: '',
    relationship: '',
    hobbies: '',
    tone: 'Sincere'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const wish = await generateBirthdayWish(formData);
      setResult(wish);
    } catch (error) {
      setResult("哎呀，许愿池刚才冒了个泡，请再试一次吧。");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider">寿星大名</label>
              <input
                type="text"
                name="name"
                required
                placeholder="例如：小明"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider">几岁啦 (选填)</label>
              <input
                type="text"
                name="age"
                placeholder="例如：18"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider">你们的关系</label>
            <input
              type="text"
              name="relationship"
              required
              placeholder="例如：死党、妈妈、暗恋对象"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider">兴趣爱好 / 特点</label>
            <textarea
              name="hobbies"
              rows={2}
              placeholder="例如：喜欢打游戏、爱吃火锅、最近在减肥"
              value={formData.hobbies}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-500 resize-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cyan-200 uppercase tracking-wider">祝福风格</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="Sincere">❤️ 走心温暖</option>
              <option value="Funny">🤪 幽默搞怪</option>
              <option value="Poetic">📜 藏头诗/文采风</option>
              <option value="Creative">✨ 脑洞大开</option>
              <option value="Short">📱 朋友圈短句</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                AI 正在酝酿灵感...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                生成独家祝福
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="h-full flex flex-col animate-fade-in">
          <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-6 border border-cyan-500/30 relative overflow-hidden flex flex-col justify-center items-center text-center shadow-inner">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            <MessageSquareHeart className="w-8 h-8 text-pink-400 mb-4 opacity-50" />
            <p className="text-lg md:text-xl text-slate-100 font-medium leading-loose whitespace-pre-wrap font-serif-sc tracking-wide">
              {result}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => setResult(null)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              再写一个
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/40 font-bold active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制' : '复制文案'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishGenerator;