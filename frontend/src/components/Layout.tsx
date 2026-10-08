import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Dumbbell, Wallet, Briefcase, 
  Sparkles, MessageCircle, CalendarCheck, Settings, Search, Bell, 
  User, Activity, Home, Calendar, Plus, BarChart2, Brain
} from 'lucide-react';

const navigation = [
  {
    group: 'Home',
    items: [
      { path: '/', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    group: 'Life',
    items: [
      { path: '/academic', label: 'Academic', icon: GraduationCap },
      { path: '/productivity', label: 'Productivity', icon: Activity },
      { path: '/fitness', label: 'Health', icon: Dumbbell },
      { path: '/finance', label: 'Finance', icon: Wallet },
      { path: '/career', label: 'Career', icon: Briefcase },
    ]
  },
  {
    group: 'Twin',
    items: [
      { path: '/ask-twin', label: 'Ask Twin', icon: MessageCircle },
      { path: '/future-self', label: 'Future Self', icon: Sparkles },
      { path: '/weekly-review', label: 'Weekly Review', icon: CalendarCheck },
    ]
  },
  {
    group: 'System',
    items: [
      { path: '/settings', label: 'Settings', icon: Settings },
    ]
  }
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app bg-[var(--color-bg)] overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col sidebar h-screen overflow-hidden">
        {/* Logo block */}
        <div className="flex items-center gap-[10px] logo">
          <div className="w-2 h-2 bg-[var(--color-accent)]" />
          <h1 className="font-display text-[20px] text-[var(--color-text)]">Twin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto hide-scrollbar">
          {navigation.map((section, idx) => (
            <div key={idx}>
              <h3 className="nav-group-title">
                {section.group}
              </h3>
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative nav-item transition-colors text-body ${
                        isActive
                          ? 'bg-[var(--color-surface)] text-[var(--color-text)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[var(--color-accent)]'
                          : 'text-[var(--color-text-2)] hover:bg-[var(--color-surface)]'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    <item.icon size={16} strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top bar */}
        <header className="h-[56px] border-b border-[var(--color-line)] flex items-center justify-between px-[16px] md:px-[40px] shrink-0">
          <div className="flex items-center gap-[16px]">
            <Search size={16} strokeWidth={1.5} className="text-[var(--color-text-2)]" />
          </div>

          <div className="flex items-center gap-[16px]">
            <NavLink to="/ask-twin" className="btn-text">
              Ask Twin
            </NavLink>
            <Bell size={16} strokeWidth={1.5} className="text-[var(--color-text)]" />
            <div className="w-[24px] h-[24px] rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] flex items-center justify-center">
              <User size={12} strokeWidth={1.5} className="text-[var(--color-text-2)]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="main">
            <div className="main-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={{
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
                  }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[var(--color-bg)] border-t border-[var(--color-line)] flex items-center justify-around px-4 pb-safe-area-inset-bottom z-50">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-2)]'}`}>
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Home</span>
        </NavLink>
        <NavLink to="/today" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-2)]'}`}>
          <Calendar size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Today</span>
        </NavLink>
        <button className="w-[40px] h-[40px] rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] flex items-center justify-center shadow-none mb-4">
          <Plus size={20} strokeWidth={2} />
        </button>
        <NavLink to="/insights" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-2)]'}`}>
          <BarChart2 size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Insights</span>
        </NavLink>
        <NavLink to="/ask-twin" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-2)]'}`}>
          <Brain size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Twin</span>
        </NavLink>
      </nav>
    </div>
  );
}

