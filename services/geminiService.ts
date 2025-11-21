import { GoogleGenAI } from "@google/genai";
import { WishRequest } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBirthdayWish = async (params: WishRequest): Promise<string> => {
  try {
    // Map internal tone values to Chinese descriptions for better context
    const toneMap: Record<string, string> = {
      'Funny': '幽默风趣，甚至可以带点损',
      'Sincere': '真挚感人，温暖',
      'Poetic': '有文采的，或者是打油诗/藏头诗',
      'Short': '简短有力，适合发朋友圈',
      'Creative': '脑洞大开，非常有创意'
    };

    const prompt = `
      请你扮演一位富有创意的生日祝福大师。请根据以下信息写一段中文生日祝福。
      
      寿星名字: ${params.name}
      年龄: ${params.age || '未知'}
      我与TA的关系: ${params.relationship}
      TA的爱好/特点: ${params.hobbies}
      期望风格: ${toneMap[params.tone] || params.tone}

      要求：
      1. 必须是中文。
      2. 不要包含 Markdown 格式（如 **加粗**），直接输出纯文本。
      3. 内容要贴切、自然，不要像机器翻译的。
      4. 长度控制在100字以内，除非风格要求写诗。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    const text = response.text;
    return text || "生日快乐！愿你年年有今日，岁岁有今朝！（AI 稍微打了个盹，这是備用祝福）";
  } catch (error) {
    console.error("Error generating wish:", error);
    throw new Error("AI 灵感枯竭了，请稍后再试。");
  }
};