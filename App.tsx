import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { UserRole, UserProfile } from './types';
import LandingPage from './views/LandingPage';
import UserDashboard from './views/UserDashboard';
import EnterpriseDashboard from './views/EnterpriseDashboard';
import ModelingWizard from './views/ModelingWizard';
import ResearchCenter from './views/ResearchCenter';
import ImageStudio from './views/ImageStudio';
import { Hexagon, LogOut, Layers, ChevronRight, LayoutGrid, Cpu, ScanFace, Globe } from 'lucide-react';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 border-b-2 ${isActive ? 'text-white border-blue-600 bg-blue-500/5' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('p_link_role') as UserRole;
    if (savedRole) setUserRole(savedRole);
    
    const savedProfile = localStorage.getItem('p_link_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      const defaultProfile: UserProfile = {
        id: 'tw_007',
        name: 'Jordan Smith',
        age: 29,
        gender: 'Male',
        occupation: 'Interaction Designer',
        location: 'Austin, TX',
        twinMaturity: 45,
        earnings: 12.50,
        industries: ['Tech', 'Gaming'],
        personality: 'Early adopter, minimalist, logic-oriented',
        values: 'Simplicity, high quality, digital privacy',
        habits: 'Research-heavy buyer, daily gamer, avoids traditional social media'
      };
      setUserProfile(defaultProfile);
      localStorage.setItem('p_link_profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('p_link_role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('p_link_role');
  };

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('p_link_profile', JSON.stringify(profile));
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col page-enter selection:bg-blue-500/30">
        <nav className="sticky top-0 z-[100] nav-glass h-14">
          <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-6 h-6 bg-zinc-100 rounded-sm flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Hexagon size={14} fill="currentColor" strokeWidth={0} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-none">
                  AI<span className="text-zinc-500">USER</span>TWIN
                </span>
                <span className="text-[9px] text-zinc-600 font-mono tracking-widest leading-none mt-0.5">PROTOCOL_V3</span>
              </div>
            </Link>

            {userRole && (
              <div className="hidden lg:flex items-center gap-6">
                {userRole === UserRole.INDIVIDUAL ? (
                  <>
                    <NavLink to="/dashboard" icon={<LayoutGrid size={12}/>} label="Overview" />
                    <NavLink to="/modeling" icon={<Cpu size={12}/>} label="Core DNA" />
                    <NavLink to="/studio" icon={<ScanFace size={12}/>} label="Visual Studio" />
                  </>
                ) : (
                  <>
                    <NavLink to="/enterprise" icon={<LayoutGrid size={12}/>} label="Control Plane" />
                    <NavLink to="/research" icon={<Globe size={12}/>} label="Simulation" />
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              {userRole ? (
                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse"></div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{userRole}</div>
                    </div>
                    <div className="text-xs font-bold text-zinc-200">{userProfile?.name}</div>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-400 transition" title="Disconnect">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center text-xs font-mono">
                  <span className="text-zinc-600 mr-4">ACCESS_MODE:</span>
                  <div className="flex border border-white/10 rounded-sm overflow-hidden">
                    <button onClick={() => handleRoleSelect(UserRole.INDIVIDUAL)} className="px-4 py-1.5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition border-r border-white/5">PERSONAL</button>
                    <button onClick={() => handleRoleSelect(UserRole.ENTERPRISE)} className="px-4 py-1.5 bg-zinc-100 text-zinc-950 font-bold hover:bg-white transition">ENTERPRISE</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={!userRole ? <LandingPage onRoleSelect={handleRoleSelect} /> : <Navigate to={userRole === UserRole.INDIVIDUAL ? "/dashboard" : "/enterprise"} />} />
            <Route path="/dashboard" element={userRole === UserRole.INDIVIDUAL ? <UserDashboard profile={userProfile} /> : <Navigate to="/" />} />
            <Route path="/modeling" element={userRole === UserRole.INDIVIDUAL ? <ModelingWizard profile={userProfile} onUpdate={updateProfile} /> : <Navigate to="/" />} />
            <Route path="/studio" element={userRole === UserRole.INDIVIDUAL ? <ImageStudio profile={userProfile} /> : <Navigate to="/" />} />
            <Route path="/enterprise" element={userRole === UserRole.ENTERPRISE ? <EnterpriseDashboard /> : <Navigate to="/" />} />
            <Route path="/research" element={userRole === UserRole.ENTERPRISE ? <ResearchCenter /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="py-6 border-t border-white/5 bg-zinc-950 text-center text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
          <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>SYSTEM STATUS: OPERATIONAL // 34ms LATENCY</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-500 transition">Encryption Specs</a>
              <a href="#" className="hover:text-blue-500 transition">Legal Protocol</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;