/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Webcam from 'react-webcam';
import { 
  Home,
  Camera, 
  ChevronRight, 
  AlertCircle, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Loader2,
  AlertTriangle,
  Send,
  Plus,
  Bell,
  Search,
  BarChart3,
  TrendingUp,
  User,
  Award,
  ThumbsUp,
  Clock,
  Settings,
  LogOut,
  Map as MapIcon,
  Filter,
  Smartphone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { analyzeIssueImage, AnalysisResult } from './services/aiService';
import { ISSUE_LABELS } from './constants';
import { cn, getSeverityColor, formatTicketId } from './lib/utils';
import { Severity, IssueType, Report, Status } from './types';

type View = 'dashboard' | 'report' | 'track' | 'community' | 'profile';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userReports, setUserReports] = useState<Report[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1E3A8A] text-white">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl">
            <MapPin className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-display font-bold tracking-tight">Namma-Raste</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-3">Smart City Reporter</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden border-x border-gray-200 shadow-2xl relative font-sans">
      {/* (Rest of the Navigation and Main content from previous turn) */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between bg-white z-20 shadow-sm border-b border-gray-100">
        <div>
          <h1 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bengaluru Smart City</h1>
          <h2 className="text-xl font-display font-bold text-[#1E3A8A]">Namma-Raste</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-gray-50 text-gray-600 active:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="p-2 rounded-xl bg-gray-100 text-[#1E3A8A] font-bold text-[10px] uppercase px-3">
             v1.0.2
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && <DashboardView onReport={() => setCurrentView('report')} />}
          {currentView === 'track' && <TrackView reports={userReports} />}
          {currentView === 'community' && <CommunityView />}
          {currentView === 'profile' && <ProfileView onLogout={() => setIsAuthenticated(false)} />}
          {currentView === 'report' && (
            <ReportView 
              onBack={() => setCurrentView('dashboard')} 
              onComplete={(report) => {
                setUserReports([report, ...userReports]);
                setCurrentView('track');
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Navigation and FAB Footer */}
      {/* ... (as in previous implementation) ... */}
      {currentView === 'dashboard' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setCurrentView('report')}
          className="fab bg-[#1E3A8A] text-white"
        >
          <Plus size={28} />
        </motion.button>
      )}

      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 flex justify-between items-center z-40">
        <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<Home size={22} />} label="Home" />
        <NavButton active={currentView === 'track'} onClick={() => setCurrentView('track')} icon={<BarChart3 size={22} />} label="Track" />
        <div className="w-10 h-10" /> 
        <NavButton active={currentView === 'community'} onClick={() => setCurrentView('community')} icon={<MapIcon size={22} />} label="Explore" />
        <NavButton active={currentView === 'profile'} onClick={() => setCurrentView('profile')} icon={<User size={22} />} label="Profile" />
      </nav>
    </div>
  );
}

function AuthView({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (step === 2) onLogin();
      else setStep(2);
    }, 1200);
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-white flex flex-col p-8 font-sans">
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1E3A8A]">
            <Smartphone size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight leading-tight">
              {step === 1 ? 'Simplify your civic reports.' : 'Check your phone.'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {step === 1 
                ? 'Join thousands of citizens improving Bengaluru with AI-powered infrastructure reporting.' 
                : 'We\'ve sent a 6-digit confirmation code to +91 98765 43210.'}
            </p>
          </div>

          <div className="space-y-4">
             {step === 1 ? (
               <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</div>
                 <input 
                   disabled={isLoading}
                   className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-4 text-sm font-bold focus:border-[#1E3A8A] transition-colors outline-none"
                   placeholder="Mobile Number"
                   defaultValue="98765 43210"
                 />
               </div>
             ) : (
               <div className="flex gap-3 justify-between">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input 
                      key={i}
                      disabled={isLoading}
                      className="w-full h-12 bg-gray-50 border-2 border-gray-100 rounded-xl text-center font-bold text-lg focus:border-[#1E3A8A] outline-none"
                      maxLength={1}
                      defaultValue={i < 5 ? (i * 2) % 10 : undefined}
                    />
                  ))}
               </div>
             )}

             <button 
                onClick={handleNext}
                disabled={isLoading}
                className="w-full material-button bg-[#1E3A8A] text-white flex items-center justify-center gap-2 py-4 h-14 font-bold uppercase tracking-widest text-xs"
             >
                {isLoading ? <Loader2 className="animate-spin" /> : step === 1 ? 'Get OTP' : 'Verify & Continue'}
             </button>
          </div>

          {step === 1 && (
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-[1px] flex-1 bg-gray-100" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">or login with</span>
                 <div className="h-[1px] flex-1 bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 text-xs">
                    <Mail size={16} /> Email
                 </button>
                 <button className="flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-gray-100 font-bold text-gray-700 text-xs">
                    Google
                 </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="py-6 flex items-center gap-2 justify-center opacity-50">
         <ShieldCheck size={14} />
         <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Government Protected Data</span>
      </div>
    </div>
  );
}

// Reuse other views from previous turn, just ensure they are included in this file
// (I will merge the previous definitions here to provide the full codebase in one go)
// [OMITTED FOR BREVITY - Assume NavButton, DashboardView, TrackView, etc. are below]

function NavButton({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[60px]">
      <div className={cn("p-1 transition-all duration-300", active ? "text-[#1E3A8A] scale-110" : "text-gray-400")}>
        {icon}
      </div>
      <span className={cn("text-[9px] font-bold uppercase tracking-wider transition-colors", active ? "text-[#1E3A8A]" : "text-gray-400")}>
        {label}
      </span>
      {active && (
        <motion.div layoutId="navIndicator" className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] absolute -bottom-1" />
      )}
    </button>
  );
}

function DashboardView({ onReport }: { onReport: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-8"
    >
      {/* Welcome Card with Animated Pattern */}
      <section className="material-card bg-[#1E3A8A] p-7 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
             <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Active Civic Hero</h3>
          </div>
          <p className="text-2xl font-display font-bold leading-tight mt-2">Submit a report to improve your city.</p>
          <button 
            onClick={onReport}
            className="mt-6 material-button bg-white text-[#1E3A8A] flex items-center gap-2 text-sm font-bold shadow-xl shadow-black/20"
          >
            <Camera size={18} />
            Scan Infrastructure
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <MapPin className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 rotate-12" />
      </section>

      {/* Impact Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-display font-bold text-gray-900 tracking-tight">Your Contributions</h4>
          <button className="text-[#1E3A8A] text-xs font-bold flex items-center gap-1 uppercase tracking-tighter">
            View Badges <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="material-card p-5 border-l-4 border-l-[#10B981]">
            <div className="p-2 w-fit rounded-xl bg-emerald-50 text-[#10B981] mb-3">
              <CheckCircle2 size={22} />
            </div>
            <p className="text-3xl font-display font-bold text-gray-900">08</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Reports Resolved</p>
          </div>
          <div className="material-card p-5 border-l-4 border-l-[#F59E0B]">
            <div className="p-2 w-fit rounded-xl bg-orange-50 text-[#F59E0B] mb-3">
              <Award size={22} />
            </div>
            <p className="text-3xl font-display font-bold text-gray-900">320</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Honor Points</p>
          </div>
        </div>
      </section>

      {/* Nearby Activity List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-display font-bold text-gray-900 tracking-tight">Community Feed</h4>
          <Filter size={18} className="text-gray-400" />
        </div>
        <div className="space-y-4">
          {[
            { type: 'Pothole', loc: 'Indiranagar 100ft Rd', distance: '400m', votes: 12, severity: 'critical' },
            { type: 'Streetlight', loc: 'Koramangala 4th Block', distance: '1.2km', votes: 5, severity: 'medium' }
          ].map((item, idx) => (
            <div key={idx} className="material-card p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
                 <MapIcon size={24} className="text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-gray-900 text-sm">{item.type} Issue</h5>
                  <span className={cn("px-2 py-0.5 text-[9px] font-bold rounded-full uppercase", getSeverityColor(item.severity))}>
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={10} /> {item.loc} • {item.distance}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-[10px] font-bold text-[#1E3A8A] bg-blue-50 px-2 py-1 rounded-lg">
                    <ThumbsUp size={10} /> {item.votes} VALIDATIONS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function TrackView({ reports }: { reports: Report[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900">Track Requests</h2>
        <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full">
          {reports.length} Reports
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
            <Clock size={40} />
          </div>
          <div>
            <p className="font-bold text-gray-900">No active reports</p>
            <p className="text-sm text-gray-500 max-w-[200px] mt-1">Your infrastructure issues will appear here once submitted.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
             <div key={report.id} className="material-card p-5 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Ticket {formatTicketId(report.id)}
                    </p>
                    <h5 className="font-bold text-gray-900 text-lg capitalize">{ISSUE_LABELS[report.type]}</h5>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getSeverityColor(report.severity))}>
                    {report.severity}
                  </div>
                </div>

                {/* Vertical Timeline Simulation */}
                <div className="space-y-4 mt-6 pl-2 relative">
                   <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-gray-100" />
                   
                   <TimelineStep active status="Submitted" time="Just now" checked color="bg-primary-900" />
                   <TimelineStep status="Under Review" time="Pending" />
                   <TimelineStep status="In Progress" time="Pending" />
                   <TimelineStep status="Resolved" time="Pending" />
                </div>
             </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TimelineStep({ active, status, time, checked, color = "bg-gray-200" }: { active?: boolean, status: string, time: string, checked?: boolean, color?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className={cn("w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 transition-colors", active ? "bg-[#1E3A8A]" : color)}>
        {checked && <CheckCircle2 size={10} className="text-white m-auto translate-y-[1px]" />}
      </div>
      <div>
        <p className={cn("text-xs font-bold", active ? "text-gray-900" : "text-gray-400")}>{status}</p>
        <p className="text-[10px] text-gray-500 font-medium">{time}</p>
      </div>
    </div>
  );
}

function CommunityView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-full flex flex-col"
    >
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Nearby Highlights</h2>
        <div className="material-card h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
           {/* Mock Map Background */}
           <div className="absolute inset-0 bg-blue-50 opacity-50" />
           <div className="absolute inset-0 flex items-center justify-center">
              <MapPin size={40} className="text-[#1E3A8A] animate-bounce" />
           </div>
           <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Current Zone Status</p>
                <p className="text-sm font-bold text-gray-900">HSR Layout Sector 2 - Moderate</p>
              </div>
           </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex items-center gap-4 mb-6">
           <TrendingUp className="text-emerald-600" size={24} />
           <div>
             <p className="text-sm font-bold text-emerald-900">Great Job, Citizens!</p>
             <p className="text-xs text-emerald-700/80">92% of issues in your area were resolved last month.</p>
           </div>
        </div>

        <h4 className="text-lg font-display font-bold text-gray-900 mb-4">Recent Fixes</h4>
        <div className="grid grid-cols-2 gap-4">
           <div className="material-card p-2">
              <div className="aspect-video bg-gray-100 rounded-2xl mb-2" />
              <div className="px-1 pb-1">
                <p className="font-bold text-xs">Pothole Fixed</p>
                <p className="text-[10px] text-gray-400">Bellandur Lake Rd</p>
              </div>
           </div>
           <div className="material-card p-2">
              <div className="aspect-video bg-gray-100 rounded-2xl mb-2" />
              <div className="px-1 pb-1">
                <p className="font-bold text-xs">Lights Restored</p>
                <p className="text-[10px] text-gray-400">Outer Ring Rd</p>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-6 space-y-8"
    >
      <div className="flex flex-col items-center text-center pt-4">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gray-200 border-4 border-white shadow-xl overflow-hidden">
             <div className="w-full h-full bg-primary-900 flex items-center justify-center text-white text-3xl font-bold">JD</div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center text-white shadow-lg">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900">John Devang</h2>
        <p className="text-sm text-gray-500 font-medium">Verified Citizen Hero since 2024</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="material-card p-3 flex flex-col items-center justify-center text-center">
           <p className="text-xl font-bold text-[#1E3A8A]">24</p>
           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Reports</p>
        </div>
        <div className="material-card p-3 flex flex-col items-center justify-center text-center">
           <p className="text-xl font-bold text-[#10B981]">1,240</p>
           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Points</p>
        </div>
        <div className="material-card p-3 flex flex-col items-center justify-center text-center">
           <p className="text-xl font-bold text-[#F59E0B]">Level 4</p>
           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Veteran</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Engagement</h4>
        <div className="material-card divide-y divide-gray-50">
           <ProfileMenuItem icon={<Award size={20} className="text-[#F59E0B]" />} label="Achievement Badges" value="6 Unlocked" />
           <ProfileMenuItem icon={<TrendingUp size={20} className="text-[#10B981]" />} label="Contribution Impact" value="+12% locally" />
           <ProfileMenuItem icon={<Settings size={20} className="text-gray-400" />} label="Account Settings" />
           <ProfileMenuItem icon={<LogOut size={20} className="text-red-400" />} label="Sign Out" />
        </div>
      </div>
    </motion.div>
  );
}

function ProfileMenuItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  return (
    <button className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold text-gray-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-bold text-gray-400">{value}</span>}
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </button>
  );
}

// ... (ReportView from before)
function ReportView({ onBack, onComplete }: { onBack: () => void, onComplete: (report: Report) => void }) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      handleAnalysis(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalysis = async (image: string) => {
    setIsAnalyzing(true);
    try {
      // Simulation of geolocation
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setLocation({ lat: 12.9716, lng: 77.5946 }) // Mock Bangalore coordinates
      );

      const result = await analyzeIssueImage(image);
      setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
      // Mock result if AI fails/timeout for preview
      setAnalysis({
        type: 'pothole',
        severity: 'high',
        description: 'A large pothole detected on the main road, causing traffic slow-down.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
     if (!analysis) return;
     setIsSubmitting(true);
     
     // Mock successful submission
     setTimeout(() => {
       const newReport: Report = {
         id: Math.random().toString(36).substring(7),
         userId: 'user123',
         type: analysis.type,
         severity: analysis.severity,
         description: analysis.description,
         imageUrl: capturedImage || '',
         location: { latitude: location?.lat || 0, longitude: location?.lng || 0 },
         timestamp: Date.now(),
         status: 'submitted',
         ticketId: `TRA-${Math.floor(Math.random() * 1000000)}`,
         upvotes: 0
       };
       setIsSubmitting(false);
       onComplete(newReport);
     }, 1500);
  };

  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-6 space-y-6 pb-32"
    >
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 rounded-xl bg-gray-100 text-gray-600 transition-colors active:bg-gray-200">
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <h2 className="text-xl font-display font-bold text-gray-900">Submit Report</h2>
      </div>

      {!capturedImage ? (
        <div className="space-y-6">
          <div className="material-card aspect-[3/4] bg-black flex items-center justify-center relative border-none overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef as any}
              screenshotFormat="image/jpeg"
              className="absolute inset-0 w-full h-full object-cover"
              videoConstraints={{ facingMode: "environment" } as any}
              {...{
                disablePictureInPicture: true,
                forceScreenshotSourceSize: false,
                imageSmoothing: true,
                mirrored: false,
                onUserMedia: () => {},
                onUserMediaError: () => {},
                screenshotQuality: 0.92
              } as any}
            />
            <div className="absolute inset-0 border-2 border-white/20 rounded-3xl m-6 pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 border-2 border-dashed border-white/40 rounded-full opacity-40" />
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
               <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm">
                 Detection Ready
               </p>
               <button 
                onClick={capture}
                className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center active:scale-90 transition-all duration-300 backdrop-blur-sm bg-white/10"
              >
                <div className="w-14 h-14 bg-white rounded-full shadow-inner" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-primary-900/5 rounded-2xl flex gap-3 border border-primary-900/10">
            <AlertCircle className="text-[#1E3A8A] flex-shrink-0" size={20} />
            <p className="text-xs text-[#1E3A8A]/80 leading-relaxed font-medium">
               Make sure the issue is well-lit and clearly visible. AI analysis works best with centered subjects.
            </p>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="material-card aspect-video border-none relative overflow-hidden shadow-2xl">
            <img src={capturedImage} className="w-full h-full object-cover" alt="Captured issue" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
               <div className="flex items-center gap-2 text-white">
                  <MapPin size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Geolocation Locked</span>
               </div>
            </div>
            <button 
              onClick={reset}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-xl backdrop-blur-md active:bg-black"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {isAnalyzing ? (
            <div className="material-card p-10 flex flex-col items-center justify-center gap-6 border-dashed border-[#1E3A8A]/30">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: 360 
                }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 2 },
                  rotate: { repeat: Infinity, duration: 1.5, ease: "linear" }
                }}
              >
                <div className="relative">
                  <Loader2 className="text-[#1E3A8A] w-12 h-12" />
                  <div className="absolute inset-0 blur-lg bg-blue-400/20" />
                </div>
              </motion.div>
              <div className="text-center">
                <p className="font-display font-bold text-gray-900 text-lg">AI Engine Working</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Gemini 3 Flash is identifying the issue and assessing urgency...</p>
              </div>
            </div>
          ) : analysis ? (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="material-card p-4">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Observation</p>
                  <p className="font-bold text-gray-900 capitalize text-sm">{ISSUE_LABELS[analysis.type] || analysis.type}</p>
                </div>
                <div className={cn("material-card p-4", getSeverityColor(analysis.severity).split(' ')[1])}>
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Status Level</p>
                  <p className={cn("font-bold uppercase flex items-center gap-1 text-sm", getSeverityColor(analysis.severity).split(' ')[0])}>
                    <AlertTriangle size={14} />
                    {analysis.severity}
                  </p>
                </div>
              </div>

              <div className="material-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Auto-Description</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">AI Generated</span>
                </div>
                <textarea 
                  className="w-full text-sm text-gray-700 bg-gray-50/50 rounded-2xl p-4 border-none focus:ring-2 focus:ring-[#1E3A8A]/10 transition-all font-medium leading-relaxed"
                  rows={4}
                  defaultValue={analysis.description}
                />
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full material-button bg-[#1E3A8A] text-white py-4 rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20 active:scale-95 transition-all"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                <span className="font-bold uppercase tracking-widest text-xs">Verify & Submit Report</span>
              </button>
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
}
