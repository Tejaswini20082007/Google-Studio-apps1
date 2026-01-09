
import { GoogleGenAI, Type } from "@google/genai";

const AI_MODEL_PRO = "gemini-3-pro-preview";
const AI_MODEL_FLASH = "gemini-3-flash-preview";

export const geminiService = {
  improveResume: async (originalResume: string, jobDescription: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are a world-class executive resume writer. Rewrite the resume to be high-impact.
      RULES: Use POWER VERBS, QUANTIFY ACHIEVEMENTS, TAILOR to keywords, return clean Markdown.
      RESPONSE FORMAT: JSON object with "improvedResume" (Markdown) and "coverLetter" (1-para snippet).
    `;

    const prompt = `JOB DESCRIPTION:\n${jobDescription}\n\nORIGINAL RESUME:\n${originalResume}`;

    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL_PRO,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              improvedResume: { type: Type.STRING },
              coverLetter: { type: Type.STRING },
            },
            required: ["improvedResume", "coverLetter"]
          },
        },
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to process resume.");
    }
  },

  checkATSScore: async (resumeText: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are an expert Applicant Tracking System (ATS) analyzer for Resume Pro. 
      Evaluate the provided resume text and provide a score out of 100.
      Break down the analysis into: Keywords, Formatting, Quantified Impact, and Contact Info.
      Return a JSON object.
    `;

    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL_FLASH,
        contents: `Evaluate this resume:\n${resumeText}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Total score out of 100" },
              analysis: {
                type: Type.OBJECT,
                properties: {
                  keywords: { type: Type.STRING, description: "Feedback on keyword usage" },
                  formatting: { type: Type.STRING, description: "Feedback on layout and parsing" },
                  impact: { type: Type.STRING, description: "Feedback on quantified metrics" },
                  contact: { type: Type.STRING, description: "Feedback on contact details" }
                },
                required: ["keywords", "formatting", "impact", "contact"]
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of specific actionable items to improve"
              }
            },
            required: ["score", "analysis", "suggestions"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("ATS Check Error:", error);
      throw new Error("Failed to calculate ATS score.");
    }
  },

  generateResumeFromScratch: async (data: any) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are an expert resume architect at AI Resume Pro. Create a professional, high-impact resume from the provided structured data.
      RULES:
      1. Create a logical, aesthetic layout in Markdown.
      2. Use strong action verbs for experience and achievements.
      3. Format sections clearly: Contact, Summary, Experience, Education, Skills, and Certifications.
      4. Ensure it looks modern and professional.
      
      RESPONSE FORMAT: JSON object with key "resume" containing the Markdown string.
    `;

    const prompt = `Create a resume for the following individual:\n${JSON.stringify(data, null, 2)}`;

    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL_PRO,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              resume: { type: Type.STRING },
            },
            required: ["resume"]
          },
        },
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw new Error("Failed to generate resume.");
    }
  },

  chatWithAssistant: async (history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      You are 'ProAssistant', the official AI Career Coach for the "AI Resume Pro" platform.
      Your knowledge is restricted to the features of our website and professional career growth.
      
      WEBSITE FEATURES:
      1. **Resume Improver**: Rewrites existing resumes to be high-impact using Gemini 3 Pro.
      2. **Resume Builder**: A 5-step tool to build resumes from scratch with LinkedIn/GitHub links and Projects.
      3. **ATS Checker**: A scanner that provides a score out of 100 and suggests improvements for keywords and formatting.
      4. **Archive**: A place where all user-generated resumes are stored locally.

      STANDARD RESUME STRUCTURE YOU MUST RECOMMEND:
      1. **Contact Info:** Name, phone, professional email, and LinkedIn URL.
      2. **Professional Summary:** A 2-3 sentence "elevator pitch" highlighting years of experience and top achievements.
      3. **Work Experience:** List roles in reverse-chronological order. Use bullet points starting with action verbs (e.g., **Managed**, **Developed**, **Increased**).
      4. **Skills:** A dedicated section for technical skills (software, languages) and soft skills (leadership, communication).
      5. **Education:** Degree, institution, and graduation year.
      
      **Pro Tip:** Always quantify your results whenever possible (e.g., "Reduced costs by 15%").

      STYLE RULES:
      - Use Markdown to **bold** important terms.
      - Keep answers concise.
      - Always encourage users to use our platform's **ATS Checker** or **Improver** tools.
      - If asked about general topics, politely redirect to career-related features on our site.
    `;

    try {
      const chat = ai.chats.create({
        model: AI_MODEL_FLASH,
        config: { systemInstruction, temperature: 0.7 },
        history: history
      });
      const response = await chat.sendMessage({ message: newMessage });
      return response.text;
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw new Error("Assistant offline.");
    }
  }
};
