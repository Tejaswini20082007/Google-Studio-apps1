
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ResumeData } from '../types';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storage';
import { exportService } from '../services/exportService';
// @ts-ignore
import { marked } from 'marked';

interface ResumeBuilderProps {
  user: User;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [renderedResume, setRenderedResume] = useState('');

  const [formData, setFormData] = useState({
    personal: { 
      name: user.name, 
      email: user.email, 
      phone: '', 
      location: '', 
      linkedin: '', 
      github: '',
      portfolio: '',
      summary: '' 
    },
    education: [{ school: '', degree: '', year: '' }],
    experience: [{ company: '', role: '', period: '', description: '' }],
    projects: [{ name: '', tech: '', link: '', description: '' }],
    skills: '',
    certifications: ''
  });

  useEffect(() => {
    if (result) {
      // @ts-ignore
      setRenderedResume(marked.parse(result));
    }
  }, [result]);

  const addEducation = () => setFormData({ ...formData, education: [...formData.education, { school: '', degree: '', year: '' }] });
  const addExperience = () => setFormData({ ...formData, experience: [...formData.experience, { company: '', role: '', period: '', description: '' }] });
  const addProject = () => setFormData({ ...formData, projects: [...formData.projects, { name: '', tech: '', link: '', description: '' }] });

  const handleLoadDemo = () => {
    setFormData({
      personal: {
        name: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        phone: '+1 (555) 012-3456',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/jordansmith-pro',
        github: 'github.com/jsmith-dev',
        portfolio: 'jordansmith.dev',
        summary: 'Senior Software Engineer with 8+ years of experience building scalable web applications. Passionate about UI/UX and cloud architecture. Proven track record of leading cross-functional teams to deliver high-impact features ahead of schedule.'
      },
      education: [
        { school: 'Stanford University', degree: 'M.S. in Computer Science', year: '2016' },
        { school: 'UC Berkeley', degree: 'B.S. in Software Engineering', year: '2014' }
      ],
      experience: [
        { 
          company: 'TechFlow Solutions', 
          role: 'Senior Full Stack Engineer', 
          period: '2019 - Present', 
          description: 'Architected a microservices-based dashboard that reduced latency by 45%. Led a team of 6 engineers in transitioning the frontend from legacy jQuery to React/TypeScript. Implemented automated CI/CD pipelines using GitHub Actions.' 
        },
        { 
          company: 'InnoData Systems', 
          role: 'Software Developer', 
          period: '2016 - 2019', 
          description: 'Developed and maintained 15+ RESTful APIs used by over 100k daily active users. Optimized SQL queries resulting in a 30% increase in database performance. Collaborated with designers to build an internal design system.' 
        }
      ],
      projects: [
        {
          name: 'AI Smart Tasker',
          tech: 'React, Node.js, OpenAI API',
          link: 'github.com/jsmith/ai-tasker',
          description: 'A task management app that uses AI to prioritize daily agendas based on user habits. Implemented real-time synchronization and voice command integration.'
        },
        {
          name: 'EcoTrack Platform',
          tech: 'Next.js, Tailwind CSS, PostgreSQL',
          link: 'ecotrack-demo.com',
          description: 'SaaS platform for small businesses to track their carbon footprint. Designed the entire database schema and visual reporting dashboard.'
        }
      ],
      skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS (S3, EC2, Lambda), Docker, Kubernetes, PostgreSQL, MongoDB, GraphQL, System Design, Agile Methodologies.',
      certifications: 'AWS Certified Solutions Architect – Associate; Google Professional Cloud Developer; Meta Frontend Professional Certificate; 2022 Hackathon Winner for "Best Scalable Solution".'
    });
    setStep(1);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await geminiService.generateResumeFromScratch(formData);
      setResult(response.resume);
      
      const newResume: ResumeData = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        originalText: "Generated from scratch",
        improvedContent: response.resume,
        jobDescription: "Self-built Resume",
        coverLetterSnippet: "Built from scratch using ProBuilder",
        createdAt: Date.now()
      };
      storageService.saveResume(newResume);
    } catch (err) {
      alert("Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition-all text-sm font-semibold text-white placeholder:text-slate-500 shadow-inner";

  if (result) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => setResult(null)} className="flex items-center text-indigo-600 font-bold hover:gap-2 transition-all">
            <i className="fas fa-arrow-left mr-2"></i> Edit Details
          </button>
          <div className="flex gap-4">
            <button onClick={() => exportService.downloadAsPDF(result, 'Generated_Resume')} className="px-6 py-2.5 bg-rose-500 text-white rounded-full font-bold text-sm shadow-lg hover:bg-rose-600 transition-all">
              <i className="fas fa-file-pdf mr-2"></i> PDF
            </button>
            <button onClick={() => exportService.downloadAsDocx(result, 'Generated_Resume')} className="px-6 py-2.5 bg-indigo-500 text-white rounded-full font-bold text-sm shadow-lg hover:bg-indigo-600 transition-all">
              <i className="fas fa-file-word mr-2"></i> Word
            </button>
          </div>
        </div>
        <div className="glass-card rounded-[3rem] p-12">
          <div className="resume-preview h-[800px] overflow-y-auto custom-scrollbar pr-6" dangerouslySetInnerHTML={{ __html: renderedResume }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center relative">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Build from Scratch</h1>
        <p className="text-slate-500">Let AI craft your professional story step-by-step.</p>
        
        <button 
          onClick={handleLoadDemo}
          className="mt-6 inline-flex items-center space-x-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all active:scale-95"
        >
          <i className="fas fa-magic"></i>
          <span>Try Demo Data</span>
        </button>

        <div className="flex justify-center mt-8 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-all ${step >= i ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[3rem] p-10 border border-slate-200">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-6">Personal Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input value={formData.personal.name} onChange={e => setFormData({...formData, personal: {...formData.personal, name: e.target.value}})} className={inputClass} placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input value={formData.personal.email} onChange={e => setFormData({...formData, personal: {...formData.personal, email: e.target.value}})} className={inputClass} placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                <input value={formData.personal.phone} onChange={e => setFormData({...formData, personal: {...formData.personal, phone: e.target.value}})} className={inputClass} placeholder="+1 234 567 890" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                <input value={formData.personal.location} onChange={e => setFormData({...formData, personal: {...formData.personal, location: e.target.value}})} className={inputClass} placeholder="New York, NY" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn URL</label>
                <input value={formData.personal.linkedin} onChange={e => setFormData({...formData, personal: {...formData.personal, linkedin: e.target.value}})} className={inputClass} placeholder="linkedin.com/in/username" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">GitHub URL</label>
                <input value={formData.personal.github} onChange={e => setFormData({...formData, personal: {...formData.personal, github: e.target.value}})} className={inputClass} placeholder="github.com/username" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Professional Summary</label>
              <textarea value={formData.personal.summary} onChange={e => setFormData({...formData, personal: {...formData.personal, summary: e.target.value}})} className={`${inputClass} h-32 resize-none`} placeholder="Briefly describe your career goals and key strengths..." />
            </div>
            <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 mt-4">Next: Education</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-6">Education</h3>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">School</label>
                    <input value={edu.school} onChange={e => {
                      const newEdu = [...formData.education];
                      newEdu[idx].school = e.target.value;
                      setFormData({...formData, education: newEdu});
                    }} className={inputClass} placeholder="University Name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Degree</label>
                    <input value={edu.degree} onChange={e => {
                      const newEdu = [...formData.education];
                      newEdu[idx].degree = e.target.value;
                      setFormData({...formData, education: newEdu});
                    }} className={inputClass} placeholder="Degree / Major" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Year</label>
                  <input value={edu.year} onChange={e => {
                    const newEdu = [...formData.education];
                    newEdu[idx].year = e.target.value;
                    setFormData({...formData, education: newEdu});
                  }} className={inputClass} placeholder="Graduation Year (e.g. 2023)" />
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">+ Add More Education</button>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="w-1/3 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="w-2/3 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-lg">Next: Experience</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-6">Work Experience</h3>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company</label>
                    <input value={exp.company} onChange={e => {
                      const newExp = [...formData.experience];
                      newExp[idx].company = e.target.value;
                      setFormData({...formData, experience: newExp});
                    }} className={inputClass} placeholder="Company Name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role</label>
                    <input value={exp.role} onChange={e => {
                      const newExp = [...formData.experience];
                      newExp[idx].role = e.target.value;
                      setFormData({...formData, experience: newExp});
                    }} className={inputClass} placeholder="Job Title" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Period</label>
                  <input value={exp.period} onChange={e => {
                    const newExp = [...formData.experience];
                    newExp[idx].period = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} className={inputClass} placeholder="Period (e.g. Jan 2021 - Present)" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                  <textarea value={exp.description} onChange={e => {
                    const newExp = [...formData.experience];
                    newExp[idx].description = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }} className={`${inputClass} h-24 resize-none`} placeholder="Key responsibilities and achievements..." />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">+ Add More Experience</button>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="w-1/3 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
              <button onClick={() => setStep(4)} className="w-2/3 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-lg">Next: Projects</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-6">Key Projects</h3>
            {formData.projects.map((proj, idx) => (
              <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
                    <input value={proj.name} onChange={e => {
                      const newProj = [...formData.projects];
                      newProj[idx].name = e.target.value;
                      setFormData({...formData, projects: newProj});
                    }} className={inputClass} placeholder="e.g. Portfolio Website" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Technologies Used</label>
                    <input value={proj.tech} onChange={e => {
                      const newProj = [...formData.projects];
                      newProj[idx].tech = e.target.value;
                      setFormData({...formData, projects: newProj});
                    }} className={inputClass} placeholder="e.g. React, Firebase" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Link (Optional)</label>
                  <input value={proj.link} onChange={e => {
                    const newProj = [...formData.projects];
                    newProj[idx].link = e.target.value;
                    setFormData({...formData, projects: newProj});
                  }} className={inputClass} placeholder="e.g. github.com/user/repo" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                  <textarea value={proj.description} onChange={e => {
                    const newProj = [...formData.projects];
                    newProj[idx].description = e.target.value;
                    setFormData({...formData, projects: newProj});
                  }} className={`${inputClass} h-24 resize-none`} placeholder="Describe what you built and the results..." />
                </div>
              </div>
            ))}
            <button onClick={addProject} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all">+ Add More Projects</button>
            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="w-1/3 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
              <button onClick={() => setStep(5)} className="w-2/3 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-lg">Next: Skills & More</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-4 mb-6">Skills & Achievements</h3>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Technical Skills</label>
              <textarea value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className={`${inputClass} h-32 resize-none`} placeholder="React, TypeScript, Node.js, Project Management, SEO..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Certifications & Achievements</label>
              <textarea value={formData.certifications} onChange={e => setFormData({...formData, certifications: e.target.value})} className={`${inputClass} h-32 resize-none`} placeholder="Google Cloud Architect, Employee of the Month 2022, etc..." />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(4)} className="w-1/3 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
              <button onClick={handleGenerate} disabled={isLoading} className="w-2/3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70">
                {isLoading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-magic"></i>}
                {isLoading ? 'Crafting...' : 'Build My Resume'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
