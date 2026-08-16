import React, { useState } from 'react';
import { 
  Wind, 
  Car, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  Globe2, 
  UserCheck, 
  Activity,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  alertCount: number;
}

export const CITIES = [
  { name: 'Hyderabad', state: 'Telangana', flag: '🇮🇳' },
  { name: 'Banglore', state: 'Karnataka', flag: '🇮🇳' },
  { name: 'Delhi', state: 'NCR', flag: '🇮🇳' },
  { name: 'Mumbai', state: 'Maharashtra', flag: '🇮🇳' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  alertCount
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'vehicle', label: 'Vehicle AI', icon: Car },
    { id: 'map', label: 'Pollution Map', icon: MapPin },
    { id: 'forecast', label: 'AQI Forecast', icon: TrendingUp },
    { id: 'alerts', label: 'Authority Alerts', icon: ShieldAlert, badge: alertCount },
    { id: 'network', label: 'BRICS Grid', icon: Globe2 },
    { id: 'citizen', label: 'Citizen Report', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Sanskrit Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  NIRV<span className="text-emerald-400">Ā</span>YU
                </span>
                <span className="text-xs text-emerald-400/90 font-serif tracking-wider">
                  निर्वायु
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Hyperlocal Climate & Fleet Intelligence
              </p>
            </div>
          </div>

          {/* Right Action Area: Prototype Badge, City Selector, Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Prototype Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-300 font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SIMULATION FEED</span>
            </div>

            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Select urban node"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 shadow-2xl border border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Metropolitan Nodes
                  </div>
                  {CITIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCity(c.name);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left cursor-pointer ${
                        selectedCity === c.name 
                          ? 'bg-emerald-500/15 text-emerald-300 font-bold' 
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{c.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
