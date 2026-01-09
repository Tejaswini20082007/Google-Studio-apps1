
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center relative z-10">
            <div className="inline-block px-4 py-1.5 mb-8 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Powered by Gemini 3 Pro
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]">
              Land your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-400">Next Level.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 font-medium leading-relaxed">
              Stop sending resumes that disappear into the void. Use world-class AI to transform your experience into a high-impact narrative that commands attention from top recruiters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/auth" className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
                Optimize Now — Free Access
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 leading-tight">
            "The difference between a 'good' resume and a 'great' one is often just the vocabulary of impact."
          </h2>
          <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Value Prop Cards */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Built for the Modern Market.</h2>
            <p className="text-slate-500 font-medium">Why settle for standard when you can be spectacular?</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-12 rounded-[4rem] group hover:bg-white transition-all hover:shadow-xl border-transparent hover:border-indigo-100">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                <i className="fas fa-bolt-lightning text-xl"></i>
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">Dynamic Power Verbs</h3>
              <p className="text-slate-500 font-medium leading-relaxed">We replace passive phrases with strong, result-driven verbs that imply leadership and initiative throughout your history.</p>
            </div>

            <div className="glass-card p-12 rounded-[4rem] group hover:bg-white transition-all hover:shadow-xl border-transparent hover:border-purple-100">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">Achivement Engine</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Our AI identifies areas where metrics might be missing and helps you define your impact with placeholders for data.</p>
            </div>

            <div className="glass-card p-12 rounded-[4rem] group hover:bg-white transition-all hover:shadow-xl border-transparent hover:border-rose-100">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform">
                <i className="fas fa-shield-halved text-xl"></i>
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">ATS Optimization</h3>
              <p className="text-slate-500 font-medium leading-relaxed">We analyze your target job description to ensure your resume includes the exact keywords hiring algorithms look for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature / Process Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <h2 className="text-5xl md:text-6xl font-black mb-12 leading-[1.1]">The Resume <br/><span className="text-indigo-400">Evolution.</span></h2>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black text-indigo-400 border border-white/20">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Upload & Analyze</h4>
                  <p className="text-slate-400 font-medium">Import your current PDF or Word resume. Our AI reads between the lines to find your hidden strengths.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black text-indigo-400 border border-white/20">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Targeted Alignment</h4>
                  <p className="text-slate-400 font-medium">Provide a job description. We map your professional history to exactly what the hiring manager is seeking.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black text-indigo-400 border border-white/20">3</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Instant Refinement</h4>
                  <p className="text-slate-400 font-medium">Review the improved version, copy the cover letter snippet, and export your polished document.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="glass-card bg-white/5 border-white/10 p-2 rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="bg-slate-800 rounded-[2.5rem] p-8 aspect-square flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                    <i className="fas fa-sparkles text-4xl text-white animate-pulse"></i>
                  </div>
                  <h3 className="text-2xl font-black mb-2">Optimization in Progress</h3>
                  <p className="text-slate-400 text-sm max-w-xs">AI is currently re-writing bullet points using quantified metrics and power verbs tailored to your goals...</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to start <br/> the transformation?</h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-xl mx-auto font-medium">Build a resume that represents the professional you’ve become, not just where you’ve been.</p>
            <Link to="/auth" className="inline-block px-12 py-5 bg-white text-indigo-600 rounded-full font-black text-xl hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
