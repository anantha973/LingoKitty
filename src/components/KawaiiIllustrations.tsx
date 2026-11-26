import React from 'react';
import { AnimatedMascotScene } from './AnimatedMascotScene';
import {
  DECK_ILLUSTRATION_TO_MASCOT,
  MascotKey,
} from '../data/mascotRegistry';

interface IllustrationProps {
  className?: string;
}

export const CatWithBobaAndBao: React.FC<IllustrationProps> = ({
  className = 'w-44 h-36',
}) => (
  <AnimatedMascotScene
    mascot="foodieDuo"
    className={className}
    idleMotion="float"
  />
);

export const CatHoldingApple: React.FC<IllustrationProps> = ({
  className = 'w-28 h-24',
}) => (
  <AnimatedMascotScene
    mascot="sweetheartKitty"
    className={className}
    idleMotion="breathe"
  />
);

export const CatMascotHeader: React.FC<IllustrationProps> = ({
  className = 'w-32 h-24',
}) => (
  <AnimatedMascotScene
    mascot="celebrateDuo"
    className={className}
    accents={['heartPink', 'starGold']}
    idleMotion="float"
  />
);

export const CatWritingNotebook: React.FC<IllustrationProps> = ({
  className = 'w-24 h-20',
}) => (
  <AnimatedMascotScene
    mascot="artistKitty"
    className={className}
    showAccents={false}
    idleMotion="breathe"
  />
);

export const CatSleeping: React.FC<IllustrationProps> = ({
  className = 'w-36 h-28',
}) => (
  <AnimatedMascotScene
    mascot="sweetDreams"
    className={className}
    accents={['starGold', 'sparkleFour']}
    orbit="twinkle"
    idleMotion="breathe"
  />
);

export const AppleWithSlice: React.FC<IllustrationProps> = ({
  className = 'w-24 h-20',
}) => (
  <AnimatedMascotScene
    mascot="sweetheartKitty"
    className={className}
    showAccents={false}
    idleMotion="breathe"
  />
);

export const SakuraBranchCorner: React.FC<{ className?: string; flip?: boolean }> = ({
  className = 'w-14 h-12',
  flip = false,
}) => (
  <img
    src="/assets/accents/bow-pink.png"
    alt=""
    aria-hidden="true"
    decoding="async"
    className={`pointer-events-none select-none object-contain opacity-90 animate-orbit-sway ${
      flip ? '-scale-x-100' : ''
    } ${className}`}
  />
);

export const SmallSakuraFlower: React.FC<IllustrationProps> = ({
  className = 'w-7 h-7',
}) => (
  <img
    src="/assets/accents/heart-pink.png"
    alt=""
    aria-hidden="true"
    decoding="async"
    className={`pointer-events-none select-none object-contain animate-orbit-twinkle ${className}`}
  />
);

export const PottedFlowerIllustration: React.FC<IllustrationProps> = ({
  className = 'w-14 h-14',
}) => (
  <AnimatedMascotScene
    mascot="readerKitty"
    className={className}
    showAccents={false}
    idleMotion="none"
  />
);

export const LeavesInVaseIllustration: React.FC<IllustrationProps> = ({
  className = 'w-14 h-14',
}) => (
  <AnimatedMascotScene
    mascot="picnicParty"
    className={className}
    showAccents={false}
    idleMotion="none"
  />
);

export const DangoSkewerIllustration: React.FC<IllustrationProps> = ({
  className = 'w-14 h-14',
}) => (
  <AnimatedMascotScene
    mascot="musicMakers"
    className={className}
    showAccents={false}
    idleMotion="none"
  />
);

export const CuteCalendarIcon: React.FC<IllustrationProps> = ({
  className = 'w-12 h-12',
}) => (
  <AnimatedMascotScene
    mascot="baoZiTime"
    className={className}
    showAccents={false}
    idleMotion="breathe"
  />
);

export const CuteFlameIcon: React.FC<IllustrationProps> = ({
  className = 'w-11 h-11',
}) => (
  <AnimatedMascotScene
    mascot="hopToIt"
    className={className}
    accents={['starGold']}
    idleMotion="float"
  />
);

export const CuteLayersIcon: React.FC<IllustrationProps> = ({
  className = 'w-11 h-11',
}) => (
  <AnimatedMascotScene
    mascot="readerKitty"
    className={className}
    showAccents={false}
    idleMotion="breathe"
  />
);

export const CuteChartIcon: React.FC<IllustrationProps> = ({
  className = 'w-11 h-11',
}) => (
  <AnimatedMascotScene
    mascot="winnersCup"
    className={className}
    accents={['sparkleFour']}
    idleMotion="float"
  />
);

export const DeckStickerArtwork: React.FC<{
  illustration?: string;
  className?: string;
  showAccents?: boolean;
}> = ({ illustration = 'flower', className = 'w-14 h-14', showAccents = false }) => {
  const mascotKey: MascotKey =
    DECK_ILLUSTRATION_TO_MASCOT[illustration] || 'readerKitty';
  return (
    <AnimatedMascotScene
      mascot={mascotKey}
      className={className}
      showAccents={showAccents}
      idleMotion="none"
    />
  );
};
