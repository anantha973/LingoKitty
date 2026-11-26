import React, { useState } from 'react';
import {
  ACCENT_REGISTRY,
  AccentKey,
  MASCOT_REGISTRY,
  MascotKey,
  OrbitPreset,
} from '../data/mascotRegistry';

interface AnimatedMascotSceneProps {
  mascot: MascotKey;
  className?: string;
  imgClassName?: string;
  accents?: readonly AccentKey[];
  orbit?: OrbitPreset;
  showAccents?: boolean;
  isAudioPlaying?: boolean;
  celebrateTrigger?: string | number | boolean;
  idleMotion?: 'float' | 'breathe' | 'none';
}

const ACCENT_SLOTS: {
  posClass: string;
  sizeClass: string;
  delay: string;
}[] = [
  { posClass: '-top-2 -left-2.5', sizeClass: 'w-5 h-5 sm:w-6 sm:h-6', delay: '0s' },
  { posClass: '-top-2 -right-2', sizeClass: 'w-4 h-4 sm:w-5 sm:h-5', delay: '0.45s' },
  { posClass: 'bottom-1 -right-2.5', sizeClass: 'w-5 h-5 sm:w-5.5 sm:h-5.5', delay: '0.9s' },
];

export const AnimatedMascotScene: React.FC<AnimatedMascotSceneProps> = ({
  mascot,
  className = 'w-32 h-28',
  imgClassName = 'w-full h-full object-contain',
  accents,
  orbit,
  showAccents = true,
  isAudioPlaying = false,
  celebrateTrigger,
  idleMotion = 'float',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const meta = MASCOT_REGISTRY[mascot];
  const activeAccents = accents ?? meta.defaultAccents;
  const activeOrbit = orbit ?? meta.defaultOrbit;

  const getOrbitClass = () => {
    if (activeOrbit === 'none') return '';
    if (activeOrbit === 'musicBounce') {
      return isAudioPlaying ? 'animate-orbit-music-active' : 'animate-orbit-music-idle';
    }
    if (activeOrbit === 'floatUp') return 'animate-orbit-float';
    if (activeOrbit === 'gentleSway') return 'animate-orbit-sway';
    return 'animate-orbit-twinkle';
  };

  const idleClass =
    idleMotion === 'breathe'
      ? 'animate-mascot-breathe'
      : idleMotion === 'float'
      ? 'animate-float-gentle'
      : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {showAccents &&
        activeOrbit !== 'none' &&
        activeAccents.slice(0, ACCENT_SLOTS.length).map((accentKey, idx) => {
          const slot = ACCENT_SLOTS[idx];
          const accent = ACCENT_REGISTRY[accentKey];
          return (
            <img
              key={`${accentKey}-${idx}`}
              src={accent.src}
              alt=""
              aria-hidden="true"
              decoding="async"
              style={{ animationDelay: slot.delay }}
              className={`pointer-events-none absolute z-10 object-contain drop-shadow-[0_1px_1px_rgba(73,53,45,0.12)] ${slot.posClass} ${slot.sizeClass} ${getOrbitClass()}`}
            />
          );
        })}

      {imgFailed ? (
        <div
          aria-label={meta.alt}
          className="w-full h-full rounded-2xl bg-[#FAD7DC]/60 border border-[#F0BFC7] flex items-center justify-center text-xs font-bold text-[#49352D] p-2 text-center"
        >
          {meta.label}
        </div>
      ) : (
        <img
          key={celebrateTrigger ? String(celebrateTrigger) : meta.src}
          src={meta.src}
          alt={meta.alt}
          decoding="async"
          onError={() => setImgFailed(true)}
          className={`relative z-0 transition-transform duration-200 ${idleClass} ${
            celebrateTrigger ? 'animate-celebrate-hop' : ''
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};
