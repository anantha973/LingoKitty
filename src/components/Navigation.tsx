import React from 'react';
import { Home, Play, Layers, BarChart2, Settings } from 'lucide-react';
import { AppSection } from '../types';
import { CatMascotHeader } from './KawaiiIllustrations';

interface NavigationProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const NAV_ITEMS: { id: AppSection; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'study', label: 'Study', icon: Play },
  { id: 'decks', label: 'Decks', icon: Layers },
  { id: 'progress', label: 'Progress', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#FFF9F1]/80 border-r border-[#E6D7C8] px-5 pt-7 pb-6 select-none">
      {/* Top App Title & Mascot Lockup matching Reference 3 */}
      <div className="flex flex-col items-center text-center mb-3">
        <div className="flex items-center gap-1.5">
          <span className="font-chinese text-2xl font-bold tracking-wide text-[#49352D]">
            中文卡片
          </span>
          <span className="text-[#E98F9C] text-xl leading-none" aria-hidden="true">
            ♥
          </span>
        </div>
        <span className="text-xs font-semibold text-[#8C7568] mt-0.5">
          Chinesisch Lernen
        </span>

        {/* Cute Cat Mascot Peeking Over the Home Pill */}
        <div className="mt-3 -mb-2.5 z-10">
          <CatMascotHeader className="w-32 h-22" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5" aria-label="Hauptnavigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#FAD7DC] text-[#49352D] shadow-xs border border-[#F0BFC7]'
                  : 'text-[#6B5344] hover:bg-[#F5E9DC]/70 hover:text-[#49352D]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-[#5C4035]' : 'text-[#8C7568]'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle Cosy Motto Footer */}
      <div className="mt-auto pt-6 text-center">
        <div className="bg-[#F8F1E7] border border-[#E6D7C8] rounded-2xl p-3.5">
          <p className="font-chinese text-sm font-bold text-[#6B5344]">一天一点点</p>
          <p className="text-[11px] font-semibold text-[#8C7568] mt-0.5">
            Little steps, big progress.
          </p>
        </div>
      </div>
    </aside>
  );
};

export const MobileBottomNav: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F1]/95 backdrop-blur-md border-t border-[#E6D7C8] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-2xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#FAD7DC]/80 text-[#49352D] font-bold'
                  : 'text-[#8C7568] font-semibold hover:text-[#49352D]'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-[#49352D] stroke-[2.4]' : 'text-[#8C7568]'
                }`}
              />
              <span className="text-[11px] mt-0.5 leading-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
