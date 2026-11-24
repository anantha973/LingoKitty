import React from 'react';

interface IllustrationProps {
  className?: string;
}

/**
 * Original cute white cat mascot with pink bow sipping bubble tea alongside a happy baozi bun
 * Matches the Home dashboard hero and reference sheet top-left pose
 */
export const CatWithBobaAndBao: React.FC<IllustrationProps> = ({ className = 'w-36 h-28' }) => (
  <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft ground shadow */}
    <ellipse cx="90" cy="128" rx="70" ry="7" fill="#E6D7C8" opacity="0.6" />

    {/* Cat Body */}
    <path
      d="M44 92C38 102 40 122 52 124H92C104 122 106 102 100 92C94 84 50 84 44 92Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Pink dress/shirt tint */}
    <path
      d="M52 94C52 94 72 98 92 94C96 104 95 118 89 122H55C49 118 48 104 52 94Z"
      fill="#F7C6CE"
    />

    {/* Cat Feet / Paws */}
    <ellipse cx="48" cy="117" rx="9" ry="11" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" />
    <ellipse cx="96" cy="117" rx="9" ry="11" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" />

    {/* Cat Head */}
    <path
      d="M34 55C34 38 48 28 72 28C96 28 110 38 110 55C110 75 96 86 72 86C48 86 34 75 34 55Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Left Ear */}
    <path
      d="M37 42L32 18L54 30"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Ear */}
    <path
      d="M90 30L112 18L107 42"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Signature Pink Bow on Right Ear */}
    <g transform="translate(78, 16) rotate(12)">
      <path
        d="M14 12C6 2 0 6 2 15C4 22 10 22 14 14Z"
        fill="#F4A8B6"
        stroke="#5C4035"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M20 14C24 22 30 22 32 15C34 6 28 2 20 12Z"
        fill="#F4A8B6"
        stroke="#5C4035"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="13" r="4.5" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.8" />
    </g>

    {/* Eyes & Nose */}
    <ellipse cx="53" cy="60" rx="3" ry="4" fill="#5C4035" />
    <ellipse cx="91" cy="60" rx="3" ry="4" fill="#5C4035" />
    {/* Rosy Cheeks */}
    <ellipse cx="45" cy="65" rx="4.5" ry="2.5" fill="#F7C6CE" />
    <ellipse cx="99" cy="65" rx="4.5" ry="2.5" fill="#F7C6CE" />
    {/* Little Oval Nose */}
    <ellipse cx="72" cy="64" rx="3.2" ry="2.2" fill="#F6D0A7" stroke="#5C4035" strokeWidth="2" />

    {/* Whiskers */}
    <line x1="25" y1="56" x2="36" y2="58" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="23" y1="64" x2="35" y2="64" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="26" y1="72" x2="37" y2="70" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />

    <line x1="119" y1="56" x2="108" y2="58" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="121" y1="64" x2="109" y2="64" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="118" y1="72" x2="107" y2="70" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />

    {/* Bubble Tea Cup held in middle */}
    <g transform="translate(56, 76)">
      {/* Straw */}
      <path d="M16 14V2" stroke="#A9B99A" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M16 14V2" stroke="#5C4035" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cup Rim */}
      <rect x="2" y="13" width="28" height="5" rx="2.5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.6" />
      {/* Cup Body */}
      <path
        d="M5 18H27L24 46C23.8 48 22 49 20 49H12C10 49 8.2 48 8 46L5 18Z"
        fill="#F3D6B3"
        stroke="#5C4035"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* Tapioca Pearls */}
      <circle cx="11" cy="43" r="2.2" fill="#5C4035" />
      <circle cx="17" cy="44" r="2.2" fill="#5C4035" />
      <circle cx="21" cy="41" r="2.2" fill="#5C4035" />
      <circle cx="14" cy="39" r="2.2" fill="#5C4035" />
    </g>

    {/* Paws holding cup */}
    <ellipse cx="56" cy="99" rx="6.5" ry="5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" />
    <ellipse cx="88" cy="99" rx="6.5" ry="5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" />

    {/* Cute Happy Steamed Bun (Baozi) next to Cat */}
    <g transform="translate(115, 86)">
      <path
        d="M6 26C6 12 16 4 28 4C40 4 50 12 50 26C50 34 43 38 28 38C13 38 6 34 6 26Z"
        fill="#FFF9F1"
        stroke="#5C4035"
        strokeWidth="2.8"
      />
      {/* Bao pleats at top */}
      <path d="M25 5C25 8 23 10 21 11" stroke="#8C7568" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 4.5V11" stroke="#8C7568" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 5C31 8 33 10 35 11" stroke="#8C7568" strokeWidth="2" strokeLinecap="round" />
      {/* Bao cute face */}
      <circle cx="21" cy="24" r="2" fill="#5C4035" />
      <circle cx="35" cy="24" r="2" fill="#5C4035" />
      <path d="M26 26C27 27.5 29 27.5 30 26" stroke="#5C4035" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="17" cy="26" rx="2.5" ry="1.5" fill="#F7C6CE" />
      <ellipse cx="39" cy="26" rx="2.5" ry="1.5" fill="#F7C6CE" />
    </g>
  </svg>
);

/**
 * Original cute white cat mascot peeking or holding an apple (used on Sidebar & Vocabulary cards)
 */
export const CatHoldingApple: React.FC<IllustrationProps> = ({ className = 'w-28 h-24' }) => (
  <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cat Head */}
    <path
      d="M32 58C32 39 47 28 72 28C97 28 112 39 112 58C112 78 97 90 72 90C47 90 32 78 32 58Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
    />
    {/* Ears */}
    <path d="M35 44L30 18L54 31" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" strokeLinejoin="round" />
    <path d="M90 31L114 18L109 44" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" strokeLinejoin="round" />

    {/* Pink Bow */}
    <g transform="translate(79, 16) rotate(14)">
      <path d="M13 11C5 2 0 6 2 14C4 20 10 20 13 13Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.8" />
      <path d="M19 13C22 20 28 20 30 14C32 6 27 2 19 11Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.8" />
      <circle cx="16" cy="12" r="4.2" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.8" />
    </g>

    {/* Eyes & Nose */}
    <ellipse cx="52" cy="63" rx="3" ry="4.2" fill="#5C4035" />
    <ellipse cx="92" cy="63" rx="3" ry="4.2" fill="#5C4035" />
    <ellipse cx="44" cy="68" rx="4.5" ry="2.5" fill="#F7C6CE" />
    <ellipse cx="100" cy="68" rx="4.5" ry="2.5" fill="#F7C6CE" />
    <ellipse cx="72" cy="67" rx="3.2" ry="2.2" fill="#F6D0A7" stroke="#5C4035" strokeWidth="2" />

    {/* Whiskers */}
    <line x1="22" y1="58" x2="34" y2="60" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="20" y1="66" x2="33" y2="66" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="24" y1="74" x2="35" y2="72" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="122" y1="58" x2="110" y2="60" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="124" y1="66" x2="111" y2="66" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="120" y1="74" x2="109" y2="72" stroke="#5C4035" strokeWidth="2.8" strokeLinecap="round" />

    {/* Cute Red Apple next to Cat */}
    <g transform="translate(8, 66)">
      <path
        d="M22 14C17 11 8 13 6 22C4 31 10 42 18 43C21 43 22 41 24 43C26 41 27 43 30 43C38 42 44 31 42 22C40 13 31 11 26 14C24 15 24 15 22 14Z"
        fill="#E57B84"
        stroke="#5C4035"
        strokeWidth="2.8"
      />
      {/* Apple Stem & Leaf */}
      <path d="M24 14C24 9 26 5 29 3" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M25 9C29 5 36 6 36 10C36 13 29 14 25 9Z"
        fill="#A9B99A"
        stroke="#5C4035"
        strokeWidth="2.2"
      />
      {/* Highlight */}
      <path d="M12 22C11 26 12 30 14 33" stroke="#FFF9F1" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>

    {/* Cat Paws resting */}
    <ellipse cx="48" cy="96" rx="8" ry="6" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" />
    <ellipse cx="92" cy="96" rx="8" ry="6" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" />
  </svg>
);

/**
 * Cute Cat Mascot Head for Sidebar Logo Header
 */
export const CatMascotHeader: React.FC<IllustrationProps> = ({ className = 'w-28 h-20' }) => (
  <svg viewBox="0 0 140 95" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Little green sprout on left */}
    <g transform="translate(8, 42)">
      <path d="M14 34V18" stroke="#8C7568" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M14 24C6 22 4 14 10 12C15 11 16 18 14 24Z"
        fill="#A9B99A"
        stroke="#5C4035"
        strokeWidth="2"
      />
      <path
        d="M14 20C20 15 26 16 25 22C24 27 18 26 14 20Z"
        fill="#A9B99A"
        stroke="#5C4035"
        strokeWidth="2"
      />
    </g>

    {/* Cat Head */}
    <path
      d="M44 56C44 38 58 27 82 27C106 27 120 38 120 56C120 74 106 85 82 85C58 85 44 74 44 56Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="3"
    />
    {/* Ears */}
    <path d="M47 42L42 17L65 29" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" strokeLinejoin="round" />
    <path d="M99 29L122 17L117 42" fill="#FFFDF9" stroke="#5C4035" strokeWidth="3" strokeLinejoin="round" />

    {/* Pink Bow */}
    <g transform="translate(88, 15) rotate(14)">
      <path d="M12 10C5 2 0 5 2 13C4 19 9 19 12 12Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.6" />
      <path d="M18 12C21 19 26 19 28 13C30 5 25 2 18 10Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.6" />
      <circle cx="15" cy="11" r="4" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.6" />
    </g>

    {/* Eyes & Nose */}
    <ellipse cx="63" cy="60" rx="2.8" ry="4" fill="#5C4035" />
    <ellipse cx="101" cy="60" rx="2.8" ry="4" fill="#5C4035" />
    <ellipse cx="55" cy="65" rx="4" ry="2.2" fill="#F7C6CE" />
    <ellipse cx="109" cy="65" rx="4" ry="2.2" fill="#F7C6CE" />
    <ellipse cx="82" cy="64" rx="3" ry="2" fill="#F6D0A7" stroke="#5C4035" strokeWidth="2" />

    {/* Whiskers */}
    <line x1="35" y1="56" x2="46" y2="58" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="33" y1="63" x2="45" y2="63" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="36" y1="70" x2="46" y2="68" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="129" y1="56" x2="118" y2="58" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="131" y1="63" x2="119" y2="63" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="128" y1="70" x2="118" y2="68" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />

    {/* Paws peeking on edge */}
    <ellipse cx="60" cy="85" rx="7" ry="4.5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.6" />
    <ellipse cx="104" cy="85" rx="7" ry="4.5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.6" />
  </svg>
);

/**
 * Cat writing in a notebook at a desk (used for Writing Practice mode)
 */
export const CatWritingNotebook: React.FC<IllustrationProps> = ({ className = 'w-24 h-20' }) => (
  <svg viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cat Head */}
    <path
      d="M30 50C30 33 44 23 65 23C86 23 100 33 100 50C100 66 86 76 65 76C44 76 30 66 30 50Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="2.8"
    />
    {/* Ears */}
    <path d="M33 38L29 15L50 26" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M80 26L101 15L97 38" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" strokeLinejoin="round" />

    {/* Pink Bow */}
    <g transform="translate(71, 13) rotate(12)">
      <path d="M11 9C4 2 0 5 2 12C3 17 8 17 11 11Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
      <path d="M16 11C19 17 24 17 26 12C27 5 23 2 16 9Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
      <circle cx="13.5" cy="10" r="3.6" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
    </g>

    {/* Focused Eyes & Nose */}
    <ellipse cx="49" cy="54" rx="2.5" ry="3.5" fill="#5C4035" />
    <ellipse cx="81" cy="54" rx="2.5" ry="3.5" fill="#5C4035" />
    <ellipse cx="65" cy="58" rx="2.8" ry="1.8" fill="#F6D0A7" stroke="#5C4035" strokeWidth="1.8" />

    {/* Whiskers */}
    <line x1="21" y1="50" x2="31" y2="52" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="20" y1="57" x2="30" y2="57" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="109" y1="50" x2="99" y2="52" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="110" y1="57" x2="100" y2="57" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />

    {/* Open Notebook */}
    <path
      d="M22 86L55 80L65 84L75 80L108 86L98 100L65 95L32 100L22 86Z"
      fill="#FFF9F1"
      stroke="#5C4035"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <line x1="65" y1="84" x2="65" y2="95" stroke="#5C4035" strokeWidth="2.2" />

    {/* Pencil in Right Paw */}
    <path
      d="M44 62L57 83"
      stroke="#F4A8B6"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M44 62L57 83"
      stroke="#5C4035"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <ellipse cx="51" cy="76" rx="6" ry="5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.5" />
    <ellipse cx="79" cy="77" rx="6" ry="5" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.5" />
  </svg>
);

/**
 * Sleeping Cat Mascot with "z Z z" (used on Settings card bottom-right)
 */
export const CatSleeping: React.FC<IllustrationProps> = ({ className = 'w-32 h-24' }) => (
  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cushion / Mat */}
    <path
      d="M16 88C16 82 32 78 78 78C124 78 140 82 140 88C140 94 128 97 78 97C28 97 16 94 16 88Z"
      fill="#F5E6D3"
      stroke="#5C4035"
      strokeWidth="2.6"
    />

    {/* Sleeping Curled Body */}
    <path
      d="M78 52C104 52 124 62 124 76C124 84 114 87 88 87H68V52H78Z"
      fill="#F7C6CE"
      stroke="#5C4035"
      strokeWidth="2.8"
    />
    {/* Little Tail */}
    <path
      d="M124 74C132 72 136 77 132 82C129 85 123 84 122 81"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* Cat Head resting on paws */}
    <path
      d="M28 60C28 43 42 33 64 33C86 33 100 43 100 60C100 76 86 86 64 86C42 86 28 76 28 60Z"
      fill="#FFFDF9"
      stroke="#5C4035"
      strokeWidth="2.8"
    />
    {/* Ears */}
    <path d="M32 47L28 24L49 35" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M79 35L100 24L96 47" fill="#FFFDF9" stroke="#5C4035" strokeWidth="2.8" strokeLinejoin="round" />

    {/* Pink Bow */}
    <g transform="translate(70, 22) rotate(15)">
      <path d="M11 9C4 2 0 5 2 12C3 17 8 17 11 11Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
      <path d="M16 11C19 17 24 17 26 12C27 5 23 2 16 9Z" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
      <circle cx="13.5" cy="10" r="3.6" fill="#F4A8B6" stroke="#5C4035" strokeWidth="2.5" />
    </g>

    {/* Closed Peaceful Eyes */}
    <path d="M43 63C45 66 50 66 52 63" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M76 63C78 66 83 66 85 63" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    <ellipse cx="39" cy="67" rx="4" ry="2.2" fill="#F7C6CE" />
    <ellipse cx="89" cy="67" rx="4" ry="2.2" fill="#F7C6CE" />
    <ellipse cx="64" cy="67" rx="2.8" ry="1.8" fill="#F6D0A7" stroke="#5C4035" strokeWidth="1.8" />

    {/* Whiskers */}
    <line x1="20" y1="60" x2="29" y2="61" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="67" x2="29" y2="67" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="108" y1="60" x2="99" y2="61" stroke="#5C4035" strokeWidth="2.4" strokeLinecap="round" />

    {/* Sleeping z Z z */}
    <text x="108" y="34" fill="#5C4035" fontSize="12" fontWeight="700" fontFamily="Quicksand, sans-serif">
      z
    </text>
    <text x="120" y="24" fill="#5C4035" fontSize="15" fontWeight="700" fontFamily="Quicksand, sans-serif">
      Z
    </text>
    <text x="135" y="14" fill="#5C4035" fontSize="13" fontWeight="700" fontFamily="Quicksand, sans-serif">
      z
    </text>
  </svg>
);

/**
 * Whole Apple + Sliced Apple Illustration (used on Vocabulary back card & Nomen deck)
 */
export const AppleWithSlice: React.FC<IllustrationProps> = ({ className = 'w-20 h-16' }) => (
  <svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Whole Red Apple */}
    <path
      d="M58 26C51 22 38 25 35 38C32 51 41 68 53 70C57 70 59 67 62 70C65 67 67 70 71 70C83 68 92 51 89 38C86 25 73 22 66 26C63 28 61 28 58 26Z"
      fill="#E57B84"
      stroke="#5C4035"
      strokeWidth="2.6"
    />
    {/* Stem */}
    <path d="M62 27C62 19 65 13 70 10" stroke="#5C4035" strokeWidth="2.6" strokeLinecap="round" />
    {/* Green Leaf */}
    <path
      d="M63 18C69 12 79 13 79 19C79 24 69 25 63 18Z"
      fill="#A9B99A"
      stroke="#5C4035"
      strokeWidth="2.2"
    />
    <path
      d="M60 19C54 14 46 16 47 21C48 25 55 24 60 19Z"
      fill="#A9B99A"
      stroke="#5C4035"
      strokeWidth="2.2"
    />

    {/* Apple Slice in front */}
    <path
      d="M14 58C18 73 36 80 52 72L14 58Z"
      fill="#E57B84"
      stroke="#5C4035"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M16 56C20 69 36 75 50 69L16 56Z"
      fill="#FFF5D6"
      stroke="#5C4035"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Apple seeds */}
    <circle cx="31" cy="64" r="1.6" fill="#5C4035" />
    <circle cx="36" cy="66" r="1.6" fill="#5C4035" />
  </svg>
);

/**
 * Cherry Blossom Branch for Card & Hero Corners
 */
export const SakuraBranchCorner: React.FC<{ className?: string; flip?: boolean }> = ({
  className = 'w-28 h-20',
  flip = false,
}) => (
  <svg
    viewBox="0 0 140 95"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${flip ? '-scale-x-100' : ''}`}
  >
    {/* Wooden Branch */}
    <path
      d="M140 28C110 26 84 18 52 8M96 24C84 36 72 44 54 50"
      stroke="#8C6754"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    {/* Blossom 1 (Large) */}
    <g transform="translate(36, 4)">
      <circle cx="14" cy="10" r="6" fill="#FAD2D8" />
      <circle cx="20" cy="15" r="6" fill="#FAD2D8" />
      <circle cx="17" cy="22" r="6" fill="#FAD2D8" />
      <circle cx="10" cy="22" r="6" fill="#FAD2D8" />
      <circle cx="8" cy="15" r="6" fill="#FAD2D8" />
      <circle cx="14" cy="17" r="3.5" fill="#E98F9C" />
    </g>
    {/* Blossom 2 */}
    <g transform="translate(76, 12)">
      <circle cx="12" cy="8" r="5" fill="#FAD2D8" />
      <circle cx="17" cy="13" r="5" fill="#FAD2D8" />
      <circle cx="15" cy="19" r="5" fill="#FAD2D8" />
      <circle cx="9" cy="19" r="5" fill="#FAD2D8" />
      <circle cx="7" cy="13" r="5" fill="#FAD2D8" />
      <circle cx="12" cy="14" r="3" fill="#E98F9C" />
    </g>
    {/* Blossom 3 */}
    <g transform="translate(44, 38)">
      <circle cx="11" cy="7" r="4.5" fill="#FAD2D8" />
      <circle cx="16" cy="11" r="4.5" fill="#FAD2D8" />
      <circle cx="14" cy="17" r="4.5" fill="#FAD2D8" />
      <circle cx="8" cy="17" r="4.5" fill="#FAD2D8" />
      <circle cx="6" cy="11" r="4.5" fill="#FAD2D8" />
      <circle cx="11" cy="12" r="2.6" fill="#E98F9C" />
    </g>
    {/* Falling Petals */}
    <ellipse cx="22" cy="34" rx="4" ry="2.5" transform="rotate(-25 22 34)" fill="#F4B5BE" />
    <ellipse cx="94" cy="54" rx="3.5" ry="2.2" transform="rotate(30 94 54)" fill="#F4B5BE" />
    <ellipse cx="68" cy="68" rx="3" ry="2" transform="rotate(-15 68 68)" fill="#FAD2D8" />
  </svg>
);

/**
 * Small Sakura Flower Motif for card bottom corners
 */
export const SmallSakuraFlower: React.FC<IllustrationProps> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="20" cy="12" r="6.5" fill="#FAD2D8" stroke="#E98F9C" strokeWidth="1" />
    <circle cx="27" cy="18" r="6.5" fill="#FAD2D8" stroke="#E98F9C" strokeWidth="1" />
    <circle cx="24" cy="26" r="6.5" fill="#FAD2D8" stroke="#E98F9C" strokeWidth="1" />
    <circle cx="16" cy="26" r="6.5" fill="#FAD2D8" stroke="#E98F9C" strokeWidth="1" />
    <circle cx="13" cy="18" r="6.5" fill="#FAD2D8" stroke="#E98F9C" strokeWidth="1" />
    <circle cx="20" cy="20" r="3.5" fill="#E98F9C" />
  </svg>
);

/**
 * Deck Illustrations matching the 3 cards in "Meine Decks" (Potted Flower, Leaves in Vase, Dango Skewer)
 */
export const PottedFlowerIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-14' }) => (
  <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stem & Leaves */}
    <path d="M30 28V48" stroke="#6B5344" strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M30 42C22 40 18 34 23 32C27 30 30 36 30 42Z"
      fill="#A9B99A"
      stroke="#6B5344"
      strokeWidth="2"
    />
    <path
      d="M30 42C38 40 42 34 37 32C33 30 30 36 30 42Z"
      fill="#A9B99A"
      stroke="#6B5344"
      strokeWidth="2"
    />
    {/* Pink Petals */}
    <circle cx="30" cy="12" r="5.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2" />
    <circle cx="38" cy="18" r="5.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2" />
    <circle cx="35" cy="26" r="5.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2" />
    <circle cx="25" cy="26" r="5.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2" />
    <circle cx="22" cy="18" r="5.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2" />
    <circle cx="30" cy="20" r="3.5" fill="#F6D0A7" stroke="#6B5344" strokeWidth="1.8" />
    {/* Terracotta Pot */}
    <rect x="17" y="47" width="26" height="5" rx="2" fill="#D9A78B" stroke="#6B5344" strokeWidth="2" />
    <path
      d="M20 52H40L37 66H23L20 52Z"
      fill="#D9A78B"
      stroke="#6B5344"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const LeavesInVaseIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-14' }) => (
  <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stems */}
    <path d="M30 58V20M30 36L20 24M30 32L40 22" stroke="#6B5344" strokeWidth="2.2" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M30 20C25 14 27 8 30 8C33 8 35 14 30 20Z" fill="#A9B99A" stroke="#6B5344" strokeWidth="2" />
    <path d="M21 25C15 24 13 18 16 16C19 14 23 19 21 25Z" fill="#A9B99A" stroke="#6B5344" strokeWidth="2" />
    <path d="M39 23C45 22 47 16 44 14C41 12 37 17 39 23Z" fill="#A9B99A" stroke="#6B5344" strokeWidth="2" />
    <path d="M27 33C20 33 17 28 20 26C23 24 27 28 27 33Z" fill="#A9B99A" stroke="#6B5344" strokeWidth="2" />
    {/* Glass Vase */}
    <path
      d="M25 40H35L36 45C39 48 40 52 40 58C40 63 36 66 30 66C24 66 20 63 20 58C20 52 21 48 24 45L25 40Z"
      fill="#DCE5D0"
      fillOpacity="0.7"
      stroke="#6B5344"
      strokeWidth="2"
    />
  </svg>
);

export const DangoSkewerIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-14' }) => (
  <svg viewBox="0 0 64 68" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Wooden Skewer Stick */}
    <line x1="12" y1="10" x2="52" y2="58" stroke="#6B5344" strokeWidth="2.6" strokeLinecap="round" />
    {/* Pink Top Dango */}
    <circle cx="22" cy="22" r="9.5" fill="#F4B5BE" stroke="#6B5344" strokeWidth="2.2" />
    {/* Cream Middle Dango */}
    <circle cx="32" cy="34" r="9.5" fill="#FFF9F1" stroke="#6B5344" strokeWidth="2.2" />
    {/* Matcha Green Bottom Dango */}
    <circle cx="42" cy="46" r="9.5" fill="#A9B99A" stroke="#6B5344" strokeWidth="2.2" />
  </svg>
);

/**
 * Cute Calendar Icon for "Heute lernen" card
 */
export const CuteCalendarIcon: React.FC<IllustrationProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="12" width="40" height="36" rx="8" fill="#FFF9F1" stroke="#8C6754" strokeWidth="2.5" />
    <path
      d="M8 20C8 15.5817 11.5817 12 16 12H40C44.4183 12 48 15.5817 48 20V22H8V20Z"
      fill="#F4B5BE"
      stroke="#8C6754"
      strokeWidth="2.5"
    />
    <line x1="19" y1="8" x2="19" y2="15" stroke="#8C6754" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="37" y1="8" x2="37" y2="15" stroke="#8C6754" strokeWidth="2.8" strokeLinecap="round" />
    {/* Calendar Dots */}
    <circle cx="18" cy="30" r="2" fill="#8C6754" />
    <circle cx="28" cy="30" r="2" fill="#8C6754" />
    <circle cx="38" cy="30" r="2" fill="#8C6754" />
    <circle cx="18" cy="39" r="2" fill="#8C6754" />
    <circle cx="28" cy="39" r="2" fill="#E98F9C" />
    <circle cx="38" cy="39" r="2" fill="#8C6754" />
  </svg>
);

/**
 * Cute Flame, Stack, and Bar Chart Icons for the 3 Home Stats Cards
 */
export const CuteFlameIcon: React.FC<IllustrationProps> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M23 6C23 6 34 15 34 26C34 33.1797 28.1797 38 21.5 38C14.8203 38 10 32.8203 10 26C10 21 13 16 16 13C16 16 18 18 19 18C18 13 20 8 23 6Z"
      fill="#F2A679"
      stroke="#6B5344"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M22 21C22 21 27 25 27 30C27 33.3137 24.5376 36 21.5 36C18.4624 36 16 33.3137 16 30C16 26.5 19 23.5 22 21Z"
      fill="#FAD99B"
    />
  </svg>
);

export const CuteLayersIcon: React.FC<IllustrationProps> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M22 25L36 31L22 37L8 31L22 25Z"
      fill="#DCE5D0"
      stroke="#6B5344"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
    <path
      d="M22 17L36 23L22 29L8 23L22 17Z"
      fill="#C5D4B3"
      stroke="#6B5344"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
    <path
      d="M22 9L36 15L22 21L8 15L22 9Z"
      fill="#A9B99A"
      stroke="#6B5344"
      strokeWidth="2.3"
      strokeLinejoin="round"
    />
  </svg>
);

export const CuteChartIcon: React.FC<IllustrationProps> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="26" width="6" height="10" rx="2" fill="#A9B99A" stroke="#6B5344" strokeWidth="2.2" />
    <rect x="19" y="19" width="6" height="17" rx="2" fill="#A9B99A" stroke="#6B5344" strokeWidth="2.2" />
    <path
      d="M33 9L38 15H35V36H29V15H26L33 9Z"
      fill="#A9B99A"
      stroke="#6B5344"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);
