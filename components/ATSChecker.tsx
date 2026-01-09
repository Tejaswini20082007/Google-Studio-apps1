
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { geminiService } from '../services/geminiService';
// @ts-ignore
import * as mammoth from 'mammoth';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface ATSCheckerProps {
  user: User;
}

const ATSChecker: React.FC<ATSCheckerProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isParsing, setIsParsing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  const parsePDF = async (data: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    setError('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (file.type === 'application/pdf') {
        const text = await parsePDF(arrayBuffer);
        setResumeText(text.trim());
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value.trim());
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText((event.target?.result as string || '').trim());
        reader.readAsText(file);
      } else {
        throw new Error('Unsupported format. Try PDF or DOCX.');
      }
    } catch (err: any) {
      setError(err.message || 'Error parsing file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCheck = async () => {
    if (!resumeText) return;
    setIsProcessing(true);
    setError('');
    try {
      const response = await geminiService.checkATSScore(resumeText);
      setResult(response);
    } catch (err: any) {
      setError('Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">ATS Score Checker</h1>
        <p className="text-slate-500 font-medium">Find out how hiring algorithms see your resume.</p>
      </div>

      {!result ? (
        <div className="glass-card rounded-[3.5rem] p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-10 w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <i className="fas fa-file-shield text-indigo-400 text-3xl"></i>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="file" 
                  id="ats-up" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt" 
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="ats-up" 
                  className="w-full py-5 px-8 bg-white border-2 border-dashed border-indigo-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group"
                >
                  <i className={`fas ${isParsing ? 'fa-spinner animate-spin' : 'fa-cloud-arrow-up'} text-2xl text-indigo-300 group-hover:text-indigo-500 mb-3`}></i>
                  <span className="text-slate-500 font-bold">{resumeText ? 'Resume Loaded' : 'Upload Resume (PDF, DOCX)'}</span>
                </label>
              </div>

              {resumeText && (
                <button 
                  onClick={handleCheck}
                  disabled={isProcessing}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-gauge-high"></i>}
                  {isProcessing ? 'Analyzing...' : 'Analyze My Score'}
                </button>
              )}
            </div>

            {error && <p className="mt-4 text-rose-500 font-bold text-sm">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="grid md:grid-cols-12 gap-10">
            {/* Score Display */}
            <div className="md:col-span-4 glass-card p-10 rounded-[3rem] text-center flex flex-col items-center justify-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Overall Score</h3>
              <div className={`text-8xl font-black ${getScoreColor(result.score)} tracking-tighter mb-2`}>
                {result.score}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Out of 100</p>
              
              <button 
                onClick={() => setResult(null)} 
                className="mt-10 px-6 py-2 bg-slate-100 text-slate-500 rounded-full font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
              >
                Retest New Resume
              </button>
            </div>

            {/* Analysis Breakdown */}
            <div className="md:col-span-8 space-y-6">
              {[
                { label: 'Keywords', val: result.analysis.keywords, icon: 'fa-tags', color: 'bg-blue-50 text-blue-500' },
                { label: 'Formatting', val: result.analysis.formatting, icon: 'fa-table-cells-large', color: 'bg-purple-50 text-purple-500' },
                { label: 'Impact', val: result.analysis.impact, icon: 'fa-chart-simple', color: 'bg-emerald-50 text-emerald-500' },
                { label: 'Contact Info', val: result.analysis.contact, icon: 'fa-address-card', color: 'bg-amber-50 text-amber-500' }
              ].map((item, i) => (
                <div key={i} className="glass-card p-6 rounded-[2rem] flex items-start gap-6 border-transparent hover:border-slate-100 transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 mb-1">{item.label}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="glass-card p-12 rounded-[4rem]">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <i className="fas fa-wand-magic-sparkles text-indigo-500"></i>
              Critical Improvements
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {result.suggestions.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0 text-[10px] font-black">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSChecker;
