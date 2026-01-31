import React, { useState } from 'react';
import { databases, DB_ID, COLL_ID } from '../lib/appwrite';
import { ID } from 'appwrite';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  MessageSquare, 
    CheckCircle2, 
    ArrowRight,
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

// Brand Palette: #070504 (Dark), #ea282c (Red), #fefdfd (White), #9f8580 (Muted), #dda816 (Gold)

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  course: string;
  comment: string;
}

const COURSES = [
  "ADSE",
  "Cybersecurity & Digital Forensics",
  "Artificial Intelligence(AI)",
  "Office Automation",
  "Web Development",
  "Data Science",
  "Data Analytics",
  "Cyber Security",
  "UI/UX Design",
  "Digital Marketing",
  "Mobile App Development"] as const;

export default function UserPortal() {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '', 
    lastName: '', 
    email: '', 
    phoneNumber: '', 
    course: '', 
    comment: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const registrationPromise = databases.createDocument(
      DB_ID, 
      COLL_ID, 
      ID.unique(), 
      formData
    );

    toast.promise(registrationPromise, {
      loading: 'Securing your spot...',
      success: () => {
        setSent(true);
        return 'Registration confirmed!';
      },
      error: 'Registration failed. Please check your details.',
    });

    try {
      await registrationPromise;
    } catch (err) {
      console.error('Registration Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (sent) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefdfd] p-6">
      <div className="text-center max-w-sm animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-red-50 text-[#ea282c] rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-100/50">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-[#070504] tracking-tight uppercase">You're In!</h1>
        <p className="text-[#9f8580] mt-4 font-medium leading-relaxed">
          Your registration for <span className="text-[#ea282c] font-bold">{formData.course}</span> was successful.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-[#070504] rounded-2xl text-xs font-black text-white hover:bg-[#ea282c] transition-all active:scale-95 uppercase tracking-widest"
        >
          Register Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fefdfd] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-50/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-50/40 blur-[120px]" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/40 border-t-8 border-[#ea282c]">
        <header className="mb-10 text-center md:text-left">
          {/* Logo outside the pill for proper dimensioning */}
          <div className="mb-8 flex justify-center md:justify-start">
            <img 
              src="/aptech-jos-logo.PNG" 
              alt="Aptech Jos Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#ea282c] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <span className="w-2 h-2 bg-[#ea282c] rounded-full animate-pulse" />
            Aptech Jos Interest Portal
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-[#070504] tracking-tight uppercase">
            Join the Future
          </h2>
          <p className="text-[#9f8580] mt-2 font-medium text-sm">
            Please fill in your details to register your interest in Aptech Jos courses.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative group">
            <User className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <input required placeholder="First Name" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold placeholder:font-medium" 
              onChange={e => updateField('firstName', e.target.value)} />
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <input required placeholder="Last Name" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold placeholder:font-medium" 
              onChange={e => updateField('lastName', e.target.value)} />
          </div>

          <div className="relative group md:col-span-2">
            <Mail className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <input required type="email" placeholder="Email Address" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold placeholder:font-medium" 
              onChange={e => updateField('email', e.target.value)} />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <input required type="tel" placeholder="Phone Number" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold placeholder:font-medium" 
              onChange={e => updateField('phoneNumber', e.target.value)} />
          </div>

          <div className="relative group">
            <BookOpen className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <select required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold appearance-none cursor-pointer text-sm"
              onChange={e => updateField('course', e.target.value)}>
              <option value="">Choose Course</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="relative group md:col-span-2">
            <MessageSquare className="absolute left-4 top-4 text-[#9f8580] group-focus-within:text-[#ea282c] transition-colors" size={18} />
            <textarea placeholder="Any specific requirements or comments?" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-[#ea282c]/5 focus:border-[#ea282c] outline-none transition-all font-bold placeholder:font-medium h-28 resize-none"
              onChange={e => updateField('comment', e.target.value)} />
          </div>
        </div>

        <button 
          disabled={loading} 
          className="w-full mt-8 bg-[#070504] text-white py-5 rounded-[20px] font-black text-lg hover:bg-[#ea282c] transition-all shadow-xl shadow-red-900/10 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group uppercase tracking-widest"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Register
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[#9f8580] text-[10px] mt-6 font-black uppercase tracking-widest">
          Empowering your future with Aptech Jos
        </p>
      </form>
    </div>
  );
}