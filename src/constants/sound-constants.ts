// Expanded sound definitions
export const sounds = [
  // Existing sounds
  { id: 'rain', name: 'Rain', icon: '🌧️', path: '/sounds/rain.mp3' },
  { id: 'thunder', name: 'Thunder', icon: '⚡', path: '/sounds/thunder.mp3' },
  { id: 'fire', name: 'Campfire', icon: '🔥', path: '/sounds/fire.mp3' },
  { id: 'stream', name: 'Stream', icon: '💧', path: '/sounds/stream.mp3' },
  { id: 'river', name: 'River', icon: '🌊', path: '/sounds/river.mp3' },
  { id: 'birds', name: 'Birds', icon: '🐦', path: '/sounds/birds.mp3' },
  { id: 'sea', name: 'Sea Waves', icon: '🌊', path: '/sounds/sea.mp3' },
  { id: 'wind', name: 'Wind', icon: '💨', path: '/sounds/wind.mp3' },
  {
    id: 'crickets',
    name: 'Crickets',
    icon: '🦗',
    path: '/sounds/crickets.mp3',
  },

  // New sounds
  { id: 'cafe', name: 'Café Chatter', icon: '☕', path: '/sounds/cafe.mp3' },
  { id: 'train', name: 'Train Rhythm', icon: '🚂', path: '/sounds/train.mp3' },
  { id: 'bowls', name: 'Tibetan Bowls', icon: '🧘', path: '/sounds/bowls.mp3' },
  { id: 'cat', name: 'Purring Cat', icon: '🐱', path: '/sounds/cat.mp3' },
  { id: 'ocean', name: 'Ocean Surf', icon: '🏄', path: '/sounds/ocean.mp3' },
  {
    id: 'wind-chimes',
    name: 'Wind Chimes',
    icon: '🎐',
    path: '/sounds/chimes.mp3',
  },
  {
    id: 'city-rain',
    name: 'City Rain',
    icon: '🏙️',
    path: '/sounds/city-rain.mp3',
  },
  {
    id: 'keyboard',
    name: 'Keyboard Typing',
    icon: '⌨️',
    path: '/sounds/keyboard.mp3',
  },
  {
    id: 'summer-night',
    name: 'Summer Night',
    icon: '🌙',
    path: '/sounds/summer-night.mp3',
  },
  {
    id: 'owls',
    name: 'Owls',
    icon: '🦉',
    path: '/sounds/owls.mp3',
  },
];

// Enhanced presets
export const presets = [
  // Existing presets
  {
    id: 'focus',
    name: 'Focus',
    description: 'Rain and fire for deep concentration',
    sounds: {
      rain: { volume: 30, playing: true },
      fire: { volume: 20, playing: true },
    },
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Gentle stream and wind for calm',
    sounds: {
      stream: { volume: 40, playing: true },
      wind: { volume: 20, playing: true },
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Immersive outdoor environment',
    sounds: {
      birds: { volume: 30, playing: true },
      crickets: { volume: 15, playing: true },
      wind: { volume: 10, playing: true },
    },
  },

  // New presets
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Meditative bowl tones with water elements',
    sounds: {
      stream: { volume: 25, playing: true },
      bowls: { volume: 35, playing: true },
      'wind-chimes': { volume: 15, playing: true },
    },
  },
  {
    id: 'urban-cafe',
    name: 'Urban Café',
    description: 'Coffee shop ambiance for productive work',
    sounds: {
      cafe: { volume: 30, playing: true },
      keyboard: { volume: 25, playing: true },
    },
  },
  {
    id: 'cozy-cabin',
    name: 'Cozy Cabin',
    description: 'Winter night by the fire',
    sounds: {
      fire: { volume: 35, playing: true },
      wind: { volume: 20, playing: true },
      owls: { volume: 15, playing: true },
    },
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'Brown noise and rhythmic patterns',
    sounds: {
      train: { volume: 30, playing: true },
      river: { volume: 25, playing: true },
    },
  },
  {
    id: 'morning-mist',
    name: 'Morning Mist',
    description: 'Gentle start to the day',
    sounds: {
      birds: { volume: 25, playing: true },
      stream: { volume: 20, playing: true },
      wind: { volume: 15, playing: true },
    },
  },
  {
    id: 'digital-nomad',
    name: 'Digital Nomad',
    description: 'Café sounds with light rain',
    sounds: {
      cafe: { volume: 25, playing: true },
      'city-rain': { volume: 20, playing: true },
      keyboard: { volume: 30, playing: true },
    },
  },
  {
    id: 'sleep-sanctuary',
    name: 'Sleep Sanctuary',
    description: 'Soothing sounds for deep sleep',
    sounds: {
      'wind-chimes': { volume: 15, playing: true },
      crickets: { volume: 20, playing: true },
      ocean: { volume: 25, playing: true },
    },
  },
  {
    id: 'creative-flow',
    name: 'Creative Flow',
    description: 'Stimulating environment for ideas',
    sounds: {
      rain: { volume: 15, playing: true },
      bowls: { volume: 20, playing: true },
      keyboard: { volume: 30, playing: true },
    },
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    description: 'Nighttime nature sounds',
    sounds: {
      crickets: { volume: 25, playing: true },
      owls: { volume: 20, playing: true },
      wind: { volume: 15, playing: true },
    },
  },
  {
    id: 'stormy-day',
    name: 'Stormy Day',
    description: 'Dramatic weather atmosphere',
    sounds: {
      thunder: { volume: 20, playing: true },
      rain: { volume: 35, playing: true },
      wind: { volume: 30, playing: true },
    },
  },
];
