import React from 'react';
import { Home, Play, Layers, BarChart2, Settings } from 'lucide-react';
import { AppSection } from '../types';
import { CatMascotHeader } from './KawaiiIllustrations';

interface NavigationProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const NAV_ITEMS: { id: AppSection; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Start', icon: Home },
  { id: 'study', label: 'Lernen', icon: Play },
  { id: 'decks', label: 'Decks', icon: Layers },
  { id: 'progress', label: 'Fortschritt', icon: BarChart2 },
  { id: 'settings', label: 'Einstellungen', icon: Settings },
];

export const DesktopSidebar: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-[#FFF9F3]/90 border-r border-[#E9D8C8] px-5 pt-7 pb-6 select-none">
      {/* Top App Title & Mascot Lockup */}
      <div className="flex flex-col items-center text-center mb-3">
        <div className="flex items-center gap-2">
          <img
            src="/assets/mascots/lantern-festival.png"
            alt="Laternenfest Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-chinese text-2xl font-bold tracking-wide text-[#49352D]">
            中文卡片
          </span>
          <img
            src="/assets/accents/heart-pink.png"
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain"
          />
        </div>
        <span className="text-xs font-semibold text-[#8C7568] mt-0.5">
          Chinesisch Lernen
        </span>

        {/* Hello Kitty & Keroppi Celebrate Duo peeking over Start */}
        <div className="mt-3 -mb-2 z-10">
          <CatMascotHeader className="w-36 h-26" />
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
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-4 min-h-[46px] rounded-2xl text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#F4B5BE]/45 text-[#49352D] shadow-2xs border border-[#E98F9C]/50'
                  : 'text-[#6B5344] hover:bg-[#F8F1E7] hover:text-[#49352D]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-[#49352D] stroke-[2.3]' : 'text-[#8C7568]'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle Cosy Motto Footer */}
      <div className="mt-auto pt-6 text-center">
        <div className="relative bg-[#F8F1E7] border border-[#E9D8C8] rounded-2xl p-3.5">
          <img
            src="/assets/accents/baozi-mini.png"
            alt=""
            aria-hidden="true"
            className="w-6 h-5 object-contain absolute -top-2.5 left-3 animate-orbit-sway"
          />
          <img
            src="/assets/accents/leaf-green.png"
            alt=""
            aria-hidden="true"
            className="w-5 h-5 object-contain absolute -top-2 right-3 animate-orbit-twinkle"
          />
          <p className="font-chinese text-sm font-bold text-[#6B5344]">一天一点点</p>
          <p className="text-[11px] font-semibold text-[#8C7568] mt-0.5">
            Kleine Schritte, großer Fortschritt.
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-t border-[#E9D8C8] px-1.5 py-1"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-h-[48px] px-1 py-1 rounded-2xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#F4B5BE]/45 text-[#49352D] font-bold border border-[#E98F9C]/35'
                  : 'text-[#8C7568] font-semibold hover:text-[#49352D] border border-transparent'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-[#49352D] stroke-[2.4]' : 'text-[#8C7568] stroke-[2]'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] mt-0.5 leading-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
