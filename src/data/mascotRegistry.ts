export type MascotKey =
  | 'lanternFestival'
  | 'foodieDuo'
  | 'globeTraveler'
  | 'baoZiTime'
  | 'hopToIt'
  | 'readerKitty'
  | 'sweetheartKitty'
  | 'artistKitty'
  | 'musicMakers'
  | 'singingRain'
  | 'teatimeKitty'
  | 'picnicParty'
  | 'dreamerKitty'
  | 'gardenerKeroppi'
  | 'sweetDreams'
  | 'graduationDuo'
  | 'winnersCup'
  | 'littleExplorer'
  | 'celebrateDuo'
  | 'bubbleJoy'
  | 'littleBaker'
  | 'highFlyer'
  | 'craftyCreator'
  | 'nightPondDreams';

export type AccentKey =
  | 'starGold'
  | 'sparkleFour'
  | 'heartPink'
  | 'bowPink'
  | 'leafGreen'
  | 'baoziMini'
  | 'musicNotePink'
  | 'musicNoteGreen'
  | 'musicNoteBlue'
  | 'paperPlane'
  | 'compassMini'
  | 'miniBook';

export type OrbitPreset = 'twinkle' | 'floatUp' | 'musicBounce' | 'gentleSway' | 'none';

export interface MascotAssetMeta {
  key: MascotKey;
  label: string;
  src: string;
  alt: string;
  defaultAccents: readonly AccentKey[];
  defaultOrbit: OrbitPreset;
}

export const MASCOT_REGISTRY: Record<MascotKey, MascotAssetMeta> = {
  lanternFestival: {
    key: 'lanternFestival',
    label: 'Laternenfest',
    src: '/assets/mascots/lantern-festival.png',
    alt: 'Hello Kitty und Keroppi beim Laternenfest',
    defaultAccents: ['starGold', 'sparkleFour', 'heartPink'],
    defaultOrbit: 'twinkle',
  },
  foodieDuo: {
    key: 'foodieDuo',
    label: 'Foodie Duo',
    src: '/assets/mascots/foodie-duo.png',
    alt: 'Hello Kitty und Keroppi teilen Baozi und Ramen',
    defaultAccents: ['starGold', 'heartPink', 'baoziMini'],
    defaultOrbit: 'floatUp',
  },
  globeTraveler: {
    key: 'globeTraveler',
    label: 'Weltreisender',
    src: '/assets/mascots/globe-traveler.png',
    alt: 'Keroppi als Entdecker auf dem Globus',
    defaultAccents: ['paperPlane', 'compassMini', 'starGold'],
    defaultOrbit: 'gentleSway',
  },
  baoZiTime: {
    key: 'baoZiTime',
    label: 'Baozi Zeit',
    src: '/assets/mascots/bao-zi-time.png',
    alt: 'Keroppi genießt gedämpfte Baozi',
    defaultAccents: ['baoziMini', 'heartPink', 'leafGreen'],
    defaultOrbit: 'floatUp',
  },
  hopToIt: {
    key: 'hopToIt',
    label: 'Hop to It',
    src: '/assets/mascots/hop-to-it.png',
    alt: 'Keroppi hüpft fröhlich mit Sternen',
    defaultAccents: ['starGold', 'sparkleFour'],
    defaultOrbit: 'twinkle',
  },
  readerKitty: {
    key: 'readerKitty',
    label: 'Leserin',
    src: '/assets/mascots/reader-kitty.png',
    alt: 'Hello Kitty liest ein Buch mit Teddy',
    defaultAccents: ['miniBook', 'heartPink', 'starGold'],
    defaultOrbit: 'gentleSway',
  },
  sweetheartKitty: {
    key: 'sweetheartKitty',
    label: 'Sweetheart',
    src: '/assets/mascots/sweetheart-kitty.png',
    alt: 'Hello Kitty hält ein pastellrosa Herz',
    defaultAccents: ['heartPink', 'bowPink', 'sparkleFour'],
    defaultOrbit: 'floatUp',
  },
  artistKitty: {
    key: 'artistKitty',
    label: 'Künstlerin',
    src: '/assets/mascots/artist-kitty.png',
    alt: 'Hello Kitty malt an der Staffelei',
    defaultAccents: ['sparkleFour', 'bowPink', 'starGold'],
    defaultOrbit: 'gentleSway',
  },
  musicMakers: {
    key: 'musicMakers',
    label: 'Musik-Duo',
    src: '/assets/mascots/music-makers.png',
    alt: 'Hello Kitty und Keroppi musizieren gemeinsam',
    defaultAccents: ['musicNotePink', 'musicNoteGreen', 'musicNoteBlue'],
    defaultOrbit: 'musicBounce',
  },
  singingRain: {
    key: 'singingRain',
    label: 'Singen im Regen',
    src: '/assets/mascots/singing-rain.png',
    alt: 'Keroppi singt unter einem Blatt-Regenschirm',
    defaultAccents: ['musicNotePink', 'musicNoteBlue', 'leafGreen'],
    defaultOrbit: 'musicBounce',
  },
  teatimeKitty: {
    key: 'teatimeKitty',
    label: 'Teezeit',
    src: '/assets/mascots/teatime-kitty.png',
    alt: 'Hello Kitty trinkt gemütlich Tee mit Keksen',
    defaultAccents: ['heartPink', 'sparkleFour', 'bowPink'],
    defaultOrbit: 'gentleSway',
  },
  picnicParty: {
    key: 'picnicParty',
    label: 'Picknick',
    src: '/assets/mascots/picnic-party.png',
    alt: 'Hello Kitty und Keroppi beim Picknick',
    defaultAccents: ['leafGreen', 'heartPink', 'starGold'],
    defaultOrbit: 'gentleSway',
  },
  dreamerKitty: {
    key: 'dreamerKitty',
    label: 'Träumerin',
    src: '/assets/mascots/dreamer-kitty.png',
    alt: 'Hello Kitty mit Herz- und Sternballons',
    defaultAccents: ['heartPink', 'starGold', 'sparkleFour'],
    defaultOrbit: 'floatUp',
  },
  gardenerKeroppi: {
    key: 'gardenerKeroppi',
    label: 'Gärtner',
    src: '/assets/mascots/gardener-keroppi.png',
    alt: 'Keroppi gießt junge Sprossen',
    defaultAccents: ['leafGreen', 'sparkleFour', 'starGold'],
    defaultOrbit: 'gentleSway',
  },
  sweetDreams: {
    key: 'sweetDreams',
    label: 'Süße Träume',
    src: '/assets/mascots/sweet-dreams.png',
    alt: 'Hello Kitty schläft gemütlich mit Teddybär',
    defaultAccents: ['starGold', 'sparkleFour'],
    defaultOrbit: 'twinkle',
  },
  graduationDuo: {
    key: 'graduationDuo',
    label: 'Abschluss!',
    src: '/assets/mascots/graduation-duo.png',
    alt: 'Hello Kitty und Keroppi feiern ihren Abschluss',
    defaultAccents: ['starGold', 'sparkleFour', 'heartPink'],
    defaultOrbit: 'twinkle',
  },
  winnersCup: {
    key: 'winnersCup',
    label: 'Siegerpokal',
    src: '/assets/mascots/winners-cup.png',
    alt: 'Hello Kitty und Keroppi halten den Siegerpokal',
    defaultAccents: ['starGold', 'sparkleFour', 'heartPink'],
    defaultOrbit: 'twinkle',
  },
  littleExplorer: {
    key: 'littleExplorer',
    label: 'Entdecker',
    src: '/assets/mascots/little-explorer.png',
    alt: 'Keroppi erkundet mit Lupe und Rucksack',
    defaultAccents: ['leafGreen', 'compassMini', 'sparkleFour'],
    defaultOrbit: 'gentleSway',
  },
  celebrateDuo: {
    key: 'celebrateDuo',
    label: 'Feierlaune',
    src: '/assets/mascots/celebrate-duo.png',
    alt: 'Hello Kitty und Keroppi feiern mit Partyhüten',
    defaultAccents: ['heartPink', 'starGold', 'sparkleFour'],
    defaultOrbit: 'twinkle',
  },
  bubbleJoy: {
    key: 'bubbleJoy',
    label: 'Seifenblasen',
    src: '/assets/mascots/bubble-joy.png',
    alt: 'Keroppi pustet Seifenblasen',
    defaultAccents: ['sparkleFour', 'heartPink'],
    defaultOrbit: 'floatUp',
  },
  littleBaker: {
    key: 'littleBaker',
    label: 'Kleine Bäckerin',
    src: '/assets/mascots/little-baker.png',
    alt: 'Hello Kitty backt Kekse',
    defaultAccents: ['heartPink', 'sparkleFour'],
    defaultOrbit: 'gentleSway',
  },
  highFlyer: {
    key: 'highFlyer',
    label: 'Hochflieger',
    src: '/assets/mascots/high-flyer.png',
    alt: 'Hello Kitty im roten Propellerflugzeug',
    defaultAccents: ['paperPlane', 'starGold', 'sparkleFour'],
    defaultOrbit: 'gentleSway',
  },
  craftyCreator: {
    key: 'craftyCreator',
    label: 'Bastlerin',
    src: '/assets/mascots/crafty-creator.png',
    alt: 'Hello Kitty bastelt Herzen',
    defaultAccents: ['heartPink', 'bowPink', 'sparkleFour'],
    defaultOrbit: 'gentleSway',
  },
  nightPondDreams: {
    key: 'nightPondDreams',
    label: 'Teich bei Nacht',
    src: '/assets/mascots/night-pond-dreams.png',
    alt: 'Keroppi mit Laterne und Glühwürmchen bei Nacht',
    defaultAccents: ['starGold', 'sparkleFour'],
    defaultOrbit: 'twinkle',
  },
};

export const ACCENT_REGISTRY: Record<AccentKey, { src: string; alt: string }> = {
  starGold: { src: '/assets/accents/star-gold.png', alt: '' },
  sparkleFour: { src: '/assets/accents/sparkle-four.png', alt: '' },
  heartPink: { src: '/assets/accents/heart-pink.png', alt: '' },
  bowPink: { src: '/assets/accents/bow-pink.png', alt: '' },
  leafGreen: { src: '/assets/accents/leaf-green.png', alt: '' },
  baoziMini: { src: '/assets/accents/baozi-mini.png', alt: '' },
  musicNotePink: { src: '/assets/accents/music-note-pink.png', alt: '' },
  musicNoteGreen: { src: '/assets/accents/music-note-green.png', alt: '' },
  musicNoteBlue: { src: '/assets/accents/music-note-blue.png', alt: '' },
  paperPlane: { src: '/assets/accents/paper-plane.png', alt: '' },
  compassMini: { src: '/assets/accents/compass-mini.png', alt: '' },
  miniBook: { src: '/assets/accents/mini-book.png', alt: '' },
};

// Backwards-compatible mapping for existing localStorage deck illustration keys + extended sticker keys
export const DECK_ILLUSTRATION_TO_MASCOT: Record<string, MascotKey> = {
  flower: 'readerKitty',
  leaves: 'picnicParty',
  dango: 'musicMakers',
  apple: 'sweetheartKitty',
  tea: 'teatimeKitty',
  cat: 'littleExplorer',
  gardener: 'gardenerKeroppi',
  baker: 'littleBaker',
  flyer: 'highFlyer',
  bubbles: 'bubbleJoy',
  baozi: 'baoZiTime',
  lantern: 'lanternFestival',
};

export const CUSTOM_DECK_STICKER_CHOICES: {
  id: string;
  mascotKey: MascotKey;
  label: string;
}[] = [
  { id: 'lantern', mascotKey: 'lanternFestival', label: 'Laternenfest' },
  { id: 'gardener', mascotKey: 'gardenerKeroppi', label: 'Gärtner' },
  { id: 'baker', mascotKey: 'littleBaker', label: 'Bäckerin' },
  { id: 'flyer', mascotKey: 'highFlyer', label: 'Hochflieger' },
  { id: 'bubbles', mascotKey: 'bubbleJoy', label: 'Seifenblasen' },
  { id: 'baozi', mascotKey: 'baoZiTime', label: 'Baozi Zeit' },
  { id: 'flower', mascotKey: 'readerKitty', label: 'Leserin' },
  { id: 'tea', mascotKey: 'teatimeKitty', label: 'Teezeit' },
];
