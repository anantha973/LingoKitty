import React, { useState } from 'react';
import { Settings as SettingsIcon, Check, RotateCcw } from 'lucide-react';
import { StudyDirection, StudyMode, UserSettings } from '../types';
import { CatSleeping } from './KawaiiIllustrations';
import { AnimatedMascotScene } from './AnimatedMascotScene';

interface SettingsSectionProps {
  settings: UserSettings;
  onUpdateDirection: (dir: StudyDirection) => void;
  onToggleMode: (mode: StudyMode) => void;
  onTogglePinyin: () => void;
  onUpdateThemeAccent: (accent: UserSettings['themeAccent']) => void;
  onResetDemoData: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onUpdateDirection,
  onToggleMode,
  onTogglePinyin,
  onUpdateThemeAccent,
  onResetDemoData,
}) => {
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleResetClick = () => {
    onResetDemoData();
    setResetConfirmed(true);
    window.setTimeout(() => setResetConfirmed(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Einstellungen Card */}
      <div className="relative overflow-hidden bg-[#FFF9F3] border border-[#E9D8C8] rounded-3xl p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#F4B5BE]/45 border border-[#E98F9C]/50 flex items-center justify-center shrink-0">
            <SettingsIcon className="w-5 h-5 text-[#49352D]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#49352D] leading-tight">
              Einstellungen
            </h1>
            <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
              Standard-Lernrichtung, aktive Kartentypen und Darstellung anpassen
            </p>
          </div>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E9D8C8] rounded-2xl p-4 sm:p-6 space-y-5">
          {/* 1. Kartenrichtung (Standard) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center pb-5 border-b border-[#E9D8C8]">
            <div className="sm:col-span-5">
              <label
                htmlFor="direction-select"
                className="block text-sm font-bold text-[#49352D]"
              >
                Kartenrichtung (Standard)
              </label>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5 leading-snug">
                Startrichtung für Vokabelkarten. Ein manueller Richtungswechsel während einer aktiven Sitzung bleibt davon unberührt.
              </p>
            </div>

            <div className="sm:col-span-7 flex flex-wrap items-center gap-2">
              <select
                id="direction-select"
                value={settings.defaultDirection}
                onChange={(e) =>
                  onUpdateDirection(e.target.value as StudyDirection)
                }
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F8F1E7] border border-[#E9D8C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C] cursor-pointer"
              >
                <option value="zh-to-de">Chinesisch → Deutsch</option>
                <option value="de-to-zh">Deutsch → Chinesisch</option>
              </select>
            </div>
          </div>

          {/* 2. Kartentypen im Lernmodus (Vokabeln, Schreiben, Hören) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-5 border-b border-[#E9D8C8]">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">
                Aktivierte Lernmodi
              </p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5 leading-snug">
                Wähle, welche Kartentypen im gemischten Modus („Alle Modi“) abgefragt werden
              </p>
            </div>

            <div className="sm:col-span-7 space-y-2">
              {(
                [
                  {
                    id: 'vocab',
                    label: 'Vokabeln',
                    desc: 'Schriftzeichen, Pinyin & deutsche Bedeutung',
                  },
                  {
                    id: 'writing',
                    label: 'Schreiben',
                    desc: 'Vereinfachte Schriftzeichen per Tastatur eingeben',
                  },
                  {
                    id: 'listening',
                    label: 'Hören',
                    desc: 'Gesprochenes Mandarin ohne Text-Hilfe verstehen',
                  },
                ] as const
              ).map((item) => {
                const checked = settings.enabledModes[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => onToggleMode(item.id)}
                    className="w-full min-h-[48px] flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F1E7] transition-colors text-left cursor-pointer"
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                        checked
                          ? 'bg-[#E98F9C] border-[#D57886] text-white'
                          : 'bg-[#FFF9F3] border-[#D8C5B4] text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#49352D]">
                        {item.label}
                      </p>
                      <p className="text-xs font-semibold text-[#8C7568]">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pinyin Visibility Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center pb-5 border-b border-[#E9D8C8]">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">
                Pinyin-Anzeige
              </p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5 leading-snug">
                Zeige Pinyin als Aussprachehilfe auf der Vorderseite von Vokabelkarten
              </p>
            </div>

            <div className="sm:col-span-7 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={settings.showPinyin}
                onClick={onTogglePinyin}
                className={`min-h-[44px] inline-flex items-center gap-3 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  settings.showPinyin
                    ? 'bg-[#F4B5BE]/45 border-[#E98F9C] text-[#49352D]'
                    : 'bg-[#F8F1E7] border-[#D8C5B4] text-[#6B5344]'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    settings.showPinyin ? 'bg-[#E98F9C]' : 'bg-[#A39286]'
                  }`}
                />
                <span>
                  {settings.showPinyin
                    ? 'Pinyin sichtbar (píngguǒ)'
                    : 'Nur Schriftzeichen (苹果)'}
                </span>
              </button>
            </div>
          </div>

          {/* 4. Appearance / Accent Swatches */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">Farbakzent</p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                Sanftes Pastell-Farbschema
              </p>
            </div>

            <div className="sm:col-span-7 flex items-center gap-3">
              {(
                [
                  { id: 'pink', color: 'bg-[#F4B5BE]', ring: 'ring-[#E98F9C]', label: 'Baby Pink' },
                  { id: 'sage', color: 'bg-[#A9B99A]', ring: 'ring-[#7F946D]', label: 'Salbeigrün' },
                  { id: 'cream', color: 'bg-[#F2DEC7]', ring: 'ring-[#C5A482]', label: 'Warmes Creme' },
                  { id: 'lavender', color: 'bg-[#E8D9EB]', ring: 'ring-[#A889B5]', label: 'Zartes Lavendel' },
                ] as const
              ).map((swatch) => {
                const isSelected = settings.themeAccent === swatch.id;
                return (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => onUpdateThemeAccent(swatch.id)}
                    aria-label={swatch.label}
                    title={swatch.label}
                    className={`w-10 h-10 rounded-full border border-[#49352D]/15 ${swatch.color} transition-transform cursor-pointer ${
                      isSelected
                        ? `ring-2 ring-offset-2 ring-offset-[#FFFDF9] ${swatch.ring} scale-105`
                        : 'hover:scale-105 opacity-85'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer row with Beispieldaten zurücksetzen & Sleeping Cat Mascot */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#8C7568]">
            <span>Sprachprofil: Deutsch → Vereinfachtes Chinesisch</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleResetClick}
              className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F1E7] hover:bg-[#EFE4D6] border border-[#E9D8C8] text-[#49352D] font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {resetConfirmed
                  ? 'Beispieldaten wiederhergestellt ✓'
                  : 'Beispieldaten zurücksetzen'}
              </span>
            </button>
          </div>

          <div className="-mb-2 flex items-end gap-3">
            <AnimatedMascotScene
              mascot="nightPondDreams"
              className="w-24 h-22"
              accents={['starGold']}
              idleMotion="float"
            />
            <CatSleeping className="w-36 h-28" />
          </div>
        </div>
      </div>
    </div>
  );
};
