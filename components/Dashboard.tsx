
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ResumeData } from '../types';
import { storageService } from '../services/storage';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);

  useEffect(() => {
    const data = storageService.getResumes(user.id);
    setResumes(data);
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="text-indigo-500 font-bold uppercase tracking-widest text-xs">Overview</span>
          <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">Hi, {user.name.split(' ')[0]} ✨</h1>
          <p className="text-slate-500 font-medium mt-2">Ready to secure that next big opportunity?</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/ats-checker" 
            className="bg-white text-emerald-600 px-8 py-4 rounded-full font-black text-lg hover:bg-emerald-50 transition-all border-2 border-emerald-100 flex items-center space-x-3 shadow-sm active:scale-95"
          >
            <i className="fas fa-gauge-high"></i>
            <span>ATS Checker</span>
          </Link>
          <Link 
            to="/builder" 
            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-black text-lg hover:bg-indigo-50 transition-all border-2 border-indigo-100 flex items-center space-x-3 shadow-sm active:scale-95"
          >
            <i className="fas fa-hammer"></i>
            <span>Build New</span>
          </Link>
          <Link 
            to="/improve" 
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-indigo-700 transition-all flex items-center space-x-3 shadow-xl shadow-indigo-100 active:scale-95"
          >
            <i className="fas fa-wand-magic-sparkles"></i>
            <span>Improve Resume</span>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Your Archive</h2>
            <Link to="/history" className="text-sm font-bold text-indigo-500 hover:underline">See full history</Link>
          </div>
          
          {resumes.length === 0 ? (
            <div className="glass-card rounded-[3rem] p-20 text-center border-2 border-dashed border-indigo-100">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-wind text-indigo-300 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">It's a bit quiet here</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start building or improving your resume to see it here.</p>
              <div className="flex justify-center gap-4">
                <Link to="/builder" className="text-indigo-500 font-black px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all border border-indigo-50">
                  Build New
                </Link>
                <Link to="/improve" className="text-white font-black px-6 py-3 bg-indigo-500 rounded-full shadow-md hover:bg-indigo-600 transition-all">
                  Improve
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {resumes.slice(0, 4).map((resume) => (
                <div key={resume.id} className="glass-card p-6 rounded-[2rem] flex justify-between items-center hover:bg-white transition-all group border-transparent hover:border-indigo-100 border">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg line-clamp-1">{resume.jobDescription.split('\n')[0].substring(0, 40)}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(resume.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link 
                    to="/history" 
                    className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-500 transition-all"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform"></div>
            <h3 className="text-2xl font-black mb-4">Pro Insight</h3>
            <p className="text-indigo-50 font-medium leading-relaxed mb-8">
              Recruiters spend <span className="underline decoration-indigo-300">6 seconds</span> on average scanning a resume. Our AI ensures your top metrics pop in those 6 seconds.
            </p>
            <div className="flex items-center space-x-3 text-indigo-200">
              <i className="fas fa-lightbulb"></i>
              <span className="text-xs font-bold uppercase tracking-widest">Mastering the ATS</span>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[3rem]">
            <h3 className="text-xl font-black text-slate-800 mb-6">Check Performance</h3>
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Wondering how you stack up? Our ATS Scanner uses real-world hiring logic.
              </p>
              <Link to="/ats-checker" className="block text-center py-3 bg-white text-indigo-600 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-50 transition-all text-sm">
                Get Your Score
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
