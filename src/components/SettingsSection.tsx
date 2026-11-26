import React from 'react';
import { Settings as SettingsIcon, Check } from 'lucide-react';
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
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Einstellungen Card matching Reference 3 Bottom-Right */}
      <div className="relative overflow-hidden bg-[#FDF7F0] border border-[#E6D7C8] rounded-3xl p-5 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#FAD7DC]/80 border border-[#F0BFC7] flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-[#49352D]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#49352D]">
              Einstellungen
            </h1>
            <p className="text-xs font-semibold text-[#8C7568]">
              Passe Kartenrichtung, aktive Lernmodi und Pinyin-Anzeige an
            </p>
          </div>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E6D7C8] rounded-2xl p-5 sm:p-7 space-y-6">
          {/* 1. Kartenrichtung (Standard) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center pb-5 border-b border-[#EFE4D8]">
            <div className="sm:col-span-5">
              <label
                htmlFor="direction-select"
                className="block text-sm font-bold text-[#49352D]"
              >
                Kartenrichtung (Standard)
              </label>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                Standardrichtung für Vokabelkarten
              </p>
            </div>

            <div className="sm:col-span-7 flex flex-wrap items-center gap-2">
              <select
                id="direction-select"
                value={settings.defaultDirection}
                onChange={(e) =>
                  onUpdateDirection(e.target.value as StudyDirection)
                }
                className="px-4 py-2.5 rounded-xl bg-[#FDF7F0] border border-[#E6D7C8] text-sm font-bold text-[#49352D] focus:outline-none focus:border-[#E98F9C] cursor-pointer"
              >
                <option value="zh-to-de">Chinesisch → Deutsch</option>
                <option value="de-to-zh">Deutsch → Chinesisch</option>
              </select>
            </div>
          </div>

          {/* 2. Kartentypen im Lernmodus (Vokabeln, Schreiben, Hören) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pb-5 border-b border-[#EFE4D8]">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">
                Kartentypen im Lernmodus
              </p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                Wähle, welche Übungsformen beim gemischten Lernen erscheinen
              </p>
            </div>

            <div className="sm:col-span-7 space-y-2.5">
              {(
                [
                  {
                    id: 'vocab',
                    label: 'Vokabeln',
                    desc: 'Schriftzeichen & deutsche Bedeutung',
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
                    onClick={() => onToggleMode(item.id)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FDF7F0] transition-colors text-left cursor-pointer"
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                        checked
                          ? 'bg-[#E38B98] border-[#D57886] text-white'
                          : 'bg-[#FFF9F1] border-[#D8C5B4] text-transparent'
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center pb-5 border-b border-[#EFE4D8]">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">
                Pinyin-Anzeige
              </p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                Zeige Pinyin als Aussprachehilfe auf Vokabelkarten
              </p>
            </div>

            <div className="sm:col-span-7 flex items-center">
              <button
                type="button"
                role="switch"
                aria-checked={settings.showPinyin}
                onClick={onTogglePinyin}
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  settings.showPinyin
                    ? 'bg-[#FAD7DC] border-[#E98F9C] text-[#49352D]'
                    : 'bg-[#F3E9DC] border-[#D8C5B4] text-[#6B5344]'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full transition-colors ${
                    settings.showPinyin ? 'bg-[#D86C7C]' : 'bg-[#A39286]'
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

          {/* 4. Design Swatches (Pastel Beige / Pink / Sage palette matching Reference 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center">
            <div className="sm:col-span-5">
              <p className="text-sm font-bold text-[#49352D]">Design</p>
              <p className="text-xs font-semibold text-[#8C7568] mt-0.5">
                Sanftes Pastell-Papierware-Farbschema
              </p>
            </div>

            <div className="sm:col-span-7 flex items-center gap-3">
              {(
                [
                  { id: 'pink', color: 'bg-[#F4B5BE]', ring: 'ring-[#D87A88]', label: 'Baby Pink' },
                  { id: 'sage', color: 'bg-[#B9C7A7]', ring: 'ring-[#7F946D]', label: 'Salbeigrün' },
                  { id: 'cream', color: 'bg-[#F2DEC7]', ring: 'ring-[#C5A482]', label: 'Warmes Creme' },
                  { id: 'lavender', color: 'bg-[#DFCCE6]', ring: 'ring-[#A889B5]', label: 'Zartes Lavendel' },
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
                    className={`w-8 h-8 rounded-full ${swatch.color} transition-transform cursor-pointer ${
                      isSelected
                        ? `ring-2 ring-offset-2 ring-offset-[#FFFDF9] ${swatch.ring} scale-110`
                        : 'hover:scale-105 opacity-85'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer row with Demo-Daten zurücksetzen & Sleeping Cat Mascot */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-[#8C7568]">
            <span>Sprachprofil: Deutsch → Vereinfachtes Chinesisch (Mandarin)</span>
            <span className="mx-2">·</span>
            <button
              type="button"
              onClick={onResetDemoData}
              className="underline hover:text-[#49352D] cursor-pointer"
            >
              Beispieldaten zurücksetzen
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
