
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
// @ts-ignore
import { marked } from 'marked';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I’m your AI Career Coach. How can I help you level up today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const aiResponse = await geminiService.chatWithAssistant(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: aiResponse || 'I encountered an issue. Try again!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="glass-card mb-4 w-[350px] sm:w-[400px] h-[500px] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-indigo-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <i className="fas fa-sparkles text-sm"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">Career ProAssistant</h3>
                <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-widest">Always Active</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto custom-scrollbar space-y-4 bg-slate-50/50"
          >
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed prose prose-slate prose-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 prose-invert' 
                    : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                }`}
                  dangerouslySetInnerHTML={{ __html: marked.parse(m.text) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resume tips, jobs..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 rounded-xl text-sm font-semibold border border-transparent focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-slate-800 rotate-90' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-indigo-200'
        }`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-2xl`}></i>
      </button>
    </div>
  );
};

export default ChatAssistant;
