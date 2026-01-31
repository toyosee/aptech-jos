import React, { useState, useEffect } from 'react';
import { databases, DB_ID, COLL_ID } from '../lib/appwrite';
import { Query, type Models } from 'appwrite';
import { 
  LayoutDashboard, Users, BarChart3, Search,
  LogOut, ChevronRight, Inbox, ShieldCheck, Filter, Download, PieChart, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

// Brand Palette Integration:
// Primary Red: #ea282c | Dark: #070504 | Light: #fefdfd | Muted: #9f8580 | Gold: #dda816

interface SidebarBtnProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatCardProps {
  title: string;
  value: number | string;
  trend: string;
  icon?: React.ReactNode;
}

type AttendeeDoc = Models.Document & {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  course: string;
  comment?: string;
};

export default function AdminPanel() {
  const [isAuth, setIsAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState<'dash' | 'records' | 'analytics'>('dash');
  const [data, setData] = useState<AttendeeDoc[]>([]);
  const [search, setSearch] = useState('');

  const fetchRecords = React.useCallback(async () => {
    try {
      const res = await databases.listDocuments<AttendeeDoc>(
        DB_ID, 
        COLL_ID, 
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      setData(res.documents);
    } catch (err) { 
      console.error(err);
      toast.error("Failed to fetch database records");
    }
  }, []);

  useEffect(() => { 
    if (isAuth) {
      (async () => {
        await fetchRecords();
      })();
    }
  }, [isAuth, fetchRecords]);

  const exportToCSV = () => {
    if (data.length === 0) return toast.error("No data to export");
    const headers = ["First Name", "Last Name", "Email", "Phone", "Course", "Date", "Comments"];
    const rows = data.map(u => [
      u.firstName, u.lastName, u.email, u.phoneNumber, u.course,
      new Date(u.$createdAt).toLocaleDateString(),
      `"${u.comment?.replace(/"/g, '""') || ""}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  if (!isAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#070504] p-6">
      <div className="bg-[#fefdfd] p-10 rounded-[40px] shadow-2xl w-full max-w-sm text-center border-t-8 border-[#ea282c]">
        <div className="mx-auto w-16 h-16 bg-red-50 text-[#ea282c] rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 text-[#070504]">Admin Access</h2>
        <p className="text-[#9f8580] mb-8 text-sm font-medium">Please enter your secure passkey</p>
        <input 
          type="password" 
          autoFocus
          onChange={(e) => setPass(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && (pass === 'admin2026' ? setIsAuth(true) : toast.error('Invalid Key'))}
          className="w-full p-4 bg-slate-50 rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-[#ea282c] transition-all text-center tracking-widest font-bold" 
          placeholder="••••••••" 
        />
        <button 
          onClick={() => pass === 'admin2026' ? setIsAuth(true) : toast.error('Invalid Key')} 
          className="w-full bg-[#ea282c] text-white py-4 rounded-2xl font-bold hover:brightness-110 transition shadow-lg shadow-red-200 active:scale-95"
        >
          Verify Identity
        </button>
      </div>
    </div>
  );

  const filtered = data.filter(u => 
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const courseCounts = data.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.course] = (acc[curr.course] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-[#fefdfd] font-sans text-[#070504]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#070504] flex flex-col hidden lg:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ea282c] rounded-xl flex items-center justify-center text-white font-black text-xl">A</div>
          <span className="text-xl font-black tracking-tight text-white uppercase">Aptech Admin</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarBtn icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} />
          <SidebarBtn icon={<Users size={20}/>} label="Registrations" active={activeTab === 'records'} onClick={() => setActiveTab('records')} />
          <SidebarBtn icon={<BarChart3 size={20}/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={() => setIsAuth(false)} className="flex items-center gap-3 text-[#9f8580] hover:text-[#ea282c] transition-colors px-4 py-2 w-full font-bold uppercase text-xs tracking-widest">
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-2xl w-full max-w-md border border-slate-100">
            <Search size={18} className="text-[#9f8580]" />
            <input 
               value={search} 
               onChange={(e) => setSearch(e.target.value)} 
               placeholder="Search by name or email..." 
               className="bg-transparent border-none outline-none text-sm w-full font-bold placeholder:text-[#9f8580]" 
            />
          </div>
          <div className="flex items-center gap-4">
             {activeTab === 'records' && (
               <button 
                 onClick={exportToCSV}
                 className="flex items-center gap-2 px-5 py-2.5 bg-[#dda816] text-[#070504] rounded-xl text-sm font-black hover:brightness-105 transition shadow-lg shadow-yellow-100 active:scale-95 uppercase tracking-tight"
               >
                 <Download size={16} /> Export CSV
               </button>
             )}
            <div className="h-10 w-10 bg-[#070504] rounded-2xl flex items-center justify-center text-white font-black border-2 border-[#ea282c]">A</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {activeTab === 'dash' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <header>
                <h1 className="text-3xl font-black text-[#070504] tracking-tight uppercase">Overview</h1>
                <p className="text-[#9f8580] font-medium">Real-time stats for Aptech Jos registrations.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={data.length} trend="+12% growth" icon={<Users className="text-[#ea282c]" size={20}/>}/>
                <StatCard title="Categories" value={Object.keys(courseCounts).length} trend="Active Courses" icon={<BarChart3 className="text-[#dda816]" size={20}/>}/>
                <StatCard title="New Today" value={data.filter(d => new Date(d.$createdAt).toDateString() === new Date().toDateString()).length} trend="Live Updates" icon={<TrendingUp className="text-[#070504]" size={20}/>}/>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                 <h3 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-tight"><Filter size={18} className="text-[#ea282c]"/> Course Distribution</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {Object.entries(courseCounts).map(([course, count]) => (
                      <div key={course} className="flex flex-col">
                        <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-widest">
                          <span className="text-[#9f8580]">{course}</span>
                          <span className="text-[#ea282c]">{count} Students</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div className="bg-[#ea282c] h-full transition-all duration-1000" style={{ width: `${(count / data.length) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
              <h2 className="text-2xl font-black text-[#070504] mb-8 uppercase tracking-tight">Registration Records</h2>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 bg-white rounded-[32px] border border-slate-200">
                  <Inbox size={48} className="text-[#9f8580] opacity-20 mb-4" />
                  <p className="text-[#9f8580] font-bold uppercase tracking-widest text-sm">No matches found</p>
                </div>
              ) : (
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-[#070504] text-white">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Attendee</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Contact Details</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Applied Course</th>
                        <th className="p-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(user => (
                        <tr key={user.$id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-6 font-black text-[#070504]">{user.firstName} {user.lastName}</td>
                          <td className="p-6">
                            <div className="text-sm font-bold text-[#ea282c]">{user.email}</div>
                            <div className="text-xs font-medium text-[#9f8580]">{user.phoneNumber}</div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1.5 bg-slate-100 text-[#070504] rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                              {user.course}
                            </span>
                          </td>
                          <td className="p-6 text-right"><ChevronRight size={18} className="text-slate-300 inline" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <h1 className="text-3xl font-black text-[#070504] tracking-tight uppercase">Visual Analytics</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-tight text-[#070504]">
                        <PieChart size={18} className="text-[#ea282c]"/> Market Share
                    </h3>
                    <div className="space-y-6">
                       {Object.entries(courseCounts).sort((a,b) => b[1] - a[1]).map(([name, val]) => (
                         <div key={name}>
                            <div className="flex justify-between mb-2">
                               <span className="text-xs font-black uppercase text-[#9f8580] tracking-widest">{name}</span>
                               <span className="text-xs font-black text-[#ea282c]">{((val / data.length) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                               <div className="bg-[#ea282c] h-full border-r border-white" style={{ width: `${(val / data.length) * 100}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-[#070504] p-10 rounded-[40px] flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea282c] opacity-10 rounded-full -mr-16 -mt-16" />
                    <div className="w-20 h-20 bg-white/5 text-[#ea282c] rounded-[24px] flex items-center justify-center mb-6 border border-white/10">
                       <TrendingUp size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Growth Trend</h3>
                    <p className="text-[#9f8580] mt-4 font-medium leading-relaxed">
                        Data shows a high demand for <span className="text-white">Web Development</span> this quarter.
                    </p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const SidebarBtn = ({ icon, label, active, onClick }: SidebarBtnProps) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-[#ea282c] text-white shadow-lg shadow-red-900/20' 
        : 'text-[#9f8580] hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className={`${active ? 'text-white' : 'group-hover:text-[#ea282c] transition-colors'}`}>
        {icon}
    </span>
    <span className="font-black text-[11px] uppercase tracking-[0.15em]">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, icon }: StatCardProps) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-[#ea282c] transition-all group">
    <div className="flex justify-between items-start mb-6">
       <p className="text-[#9f8580] text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
       <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-red-50 transition-colors">{icon}</div>
    </div>
    <h3 className="text-5xl font-black text-[#070504] tracking-tighter">{value}</h3>
    <div className="mt-6 text-[#070504] font-black text-[10px] bg-[#dda816] w-fit px-4 py-1.5 rounded-full uppercase tracking-widest italic">
      {trend}
    </div>
  </div>
);