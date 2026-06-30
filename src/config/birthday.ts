// Cinematic Birthday Surprise Website Configuration

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number; // Optional, used if you want a specific correct answer
}

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  iconName: 'heart' | 'camera' | 'compass' | 'coffee' | 'music' | 'gift' | 'sparkles' | 'star';
}

export interface SyncedLyric {
  time: number; // In seconds
  text: string;
}

export interface StarReason {
  id: number;
  text: string;
  x: number; // percentage width 10-90
  y: number; // percentage height 10-80
}

export interface BirthdayConfig {
  recipientName: string;
  nickname: string;
  magicWord: string; // The secret lock word to unlock the surprise
  
  // Audio settings
  musicUrl: string; // URL of the background birthday/favorite song (MP3)
  musicVolume: number; // Between 0.0 and 1.0
  lyrics: SyncedLyric[];
  
  // Theme & Visual styling
  theme: {
    primaryColor: string; // tailwind color configuration classes (e.g. from-indigo-500 to-purple-600)
    glowingColor: string; // glowing drop-shadow colors
    confettiColors: string[]; // hex values for particles
    auroraColors: string[]; // rgba/hex colors for background aurora elements
  };

  // Step 2: Interactive Questions (Preferences stored in localStorage)
  questions: TriviaQuestion[];

  // Step 3: Guess the Occasion options
  occasionOptions: string[];
  correctOccasion: string;

  // Step 5: Cinematic Loading messages
  loadingMessages: string[];

  // Step 6: Grand Reveal photo slideshow
  slideshowPhotos: string[];

  // Step 6: Typewriter birthday message
  birthdayMessage: string;

  // Step 7: 3D Cake configuration
  cakeConfig: {
    icingColor: string;
    spongeColor: string;
    creamColor: string;
    candleCount: number;
    flameColor: string;
    plateColor: string;
  };

  // Step 9: Memory Timeline
  timeline: TimelineEntry[];

  // Step 10: Love Letter Content
  loveLetter: {
    envelopeColor: string;
    letterBgColor: string;
    textColor: string;
    heading: string;
    paragraphs: string[];
    signOff: string;
  };

  // Step 11: Final Starry Sky reasons
  reasons: StarReason[];
}

export const birthdayConfig: BirthdayConfig = {
  recipientName: "Meena Banu",
  nickname: "Meena Banu ❤️",
  magicWord: "forever", // Type 'forever' (or anything) to unlock the secret path
  
  // Audio Configuration
  // We use a high-quality royalty-free ambient piano track for the background experience
  musicUrl: "/dude-orchestral-suite.mp3",
  musicVolume: 0.5,
  lyrics: [
    { time: 0, text: "✨ Press PLAY to start the music... ✨" },
    { time: 4, text: "Today is a beautiful day, a day like no other..." },
    { time: 10, text: "For on this day, a truly special soul was born..." },
    { time: 16, text: "Every year that passes, the world gets a little brighter..." },
    { time: 22, text: "And my heart gets a little fuller, just by having you in it..." },
    { time: 28, text: "Through every laugh, every adventure, and every quiet moment..." },
    { time: 35, text: "You make the ordinary feel extraordinary..." },
    { time: 42, text: "So blow the candles, make a wish, and let it fly..." },
    { time: 49, text: "Happy Birthday, Meena Banu, today and forevermore. ❤️" }
  ],

  // Theme & Visual Configuration
  theme: {
    primaryColor: "from-pink-500 via-purple-600 to-indigo-700",
    glowingColor: "rgba(168, 85, 247, 0.4)", // purple-500 at 40% opacity
    confettiColors: ["#FF69B4", "#8A2BE2", "#4169E1", "#00FFFF", "#FFD700", "#FF4500"],
    auroraColors: [
      "rgba(147, 51, 234, 0.15)", // purple
      "rgba(79, 70, 229, 0.15)",  // indigo
      "rgba(219, 39, 119, 0.12)", // pink
      "rgba(6, 182, 212, 0.1)"    // cyan
    ]
  },

  // Step 2: Interactive Trivia (Answers stored in localStorage)
  questions: [
    {
      id: "color",
      question: "Which color speaks to your soul the most?",
      options: ["Ocean Blue", "Midnight Violet", "Forest Green", "Sunset Crimson"]
    },
    {
      id: "drink",
      question: "If we were in a cozy cafe right now, what are we ordering?",
      options: ["Hot Brewed Coffee", "Matcha Latte", "Warm Chamomile Tea", "Rich Hot Chocolate"]
    },
    {
      id: "season",
      question: "Which season makes you feel most alive?",
      options: ["Blooming Spring", "Sun-kissed Summer", "Golden Autumn", "Cozy Snowy Winter"]
    },
    {
      id: "pet",
      question: "Are you dynamic and loyal like a dog, or mysterious and independent like a cat?",
      options: ["Dynamic & Playful 🐶", "Mysterious & Independent 🐱", "Both, depends on the day!", "Neither, I'm a wild spirit!"]
    },
    {
      id: "landscape",
      question: "What is your dream escape right now?",
      options: ["Starlit Beachfront 🌊", "Foggy Alpine Cabin 🏔️", "Bustling Neon City 🏙️", "Serene Countryside 🏡"]
    }
  ],

  // Step 3: Guess the Occasion
  occasionOptions: [
    "International Pizza Day 🍕",
    "Meena Banu's Birthday! 🎉",
    "National Sleep-In Day 😴",
    "Launch Day of a Spaceship 🚀"
  ],
  correctOccasion: "Meena Banu's Birthday! 🎉",

  // Step 5: Preparing the Surprise Messages
  loadingMessages: [
    "Synchronizing starry constellations...",
    "Baking the digital 3D cake...",
    "Tuning the ambient strings...",
    "Gathering shared smiles & laughter...",
    "Wrapping your digital gift boxes...",
    "Almost there... Get ready! ✨"
  ],

  // Step 6: Grand Reveal Slideshow
  // High quality Unsplash images for emotional cinematic mood (replace with real photos)
  slideshowPhotos: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop", // Festive ambient lights
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop", // Magical golden hour
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop", // Scenic mountain
    "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop", // Droplets/Bokeh light
    "https://images.unsplash.com/photo-1470252649358-969e7c7282b9?q=80&w=1200&auto=format&fit=crop"  // Golden sunrise
  ],

  // Step 6: Birthday Intro Letter/Message
  birthdayMessage: "Happy Birthday, Meena Banu! Today is all about celebrating the incredible light you bring into the lives of everyone around you. Thank you for your warmth, your laughter, and for being the wonderful person that you are. Let's take a journey down memory lane...",

  // Step 7: 3D Cake Config
  cakeConfig: {
    icingColor: "#ff9ebe", // Soft pink frosting
    spongeColor: "#d9a05b", // Warm golden sponge
    creamColor: "#ffffff", // Pure white cream layers
    candleCount: 5,
    flameColor: "#ff7b00",
    plateColor: "#1e1b4b" // Deep indigo plate
  },

  // Step 9: Memory Timeline
  timeline: [
    {
      date: "January 15",
      title: "The First Coffee",
      description: "Remember where it all started? A simple coffee that turned into hours of endless laughter.",
      iconName: "coffee"
    },
    {
      date: "April 3",
      title: "Lost in the Mountains",
      description: "Taking the wrong turn, walking in circles under the rain, yet somehow it was the highlight of our spring.",
      iconName: "compass"
    },
    {
      date: "August 24",
      title: "Midnight Stargazing",
      description: "Lying down on the hood of the car, watching shooting stars and wishing for moments that never end.",
      iconName: "star"
    },
    {
      date: "October 10",
      title: "The Unexpected Concert",
      description: "Singing along at the top of our lungs to songs we barely knew, surrounded by neon lights and crowd noise.",
      iconName: "music"
    },
    {
      date: "December 25",
      title: "Cozy Holiday Cook-off",
      description: "Our attempt at baking the perfect holiday pie that collapsed, but we ate the warm crumbs anyway.",
      iconName: "gift"
    }
  ],

  // Step 10: Love Letter Section
  loveLetter: {
    envelopeColor: "#4f46e5", // Indigo
    letterBgColor: "#fdfefe", // Elegant soft-white
    textColor: "#1f2937", // Slate gray
    heading: "Dearest Meena Banu,",
    paragraphs: [
      "I wanted to write you something that you can keep, a little digital home for my thoughts and wishes on your special day.",
      "You have an extraordinary gift: you make everyone feel safe, heard, and deeply valued. Your passion is infectious, and your kindness is a quiet force that makes the world a warmer place. Every single day with you is a gift, and I am so grateful to share this journey with you.",
      "As you blow out your candles today, I hope you realize how loved you are, how much joy you bring, and how bright your future is. May this next year bring you closer to all your dreams, filled with laughter, adventure, peace, and love.",
      "Happy Birthday. I hope this simple surprise makes you smile as much as you make me smile."
    ],
    signOff: "With all my love and warm wishes, always. ❤️"
  },

  // Step 11: Final Starry Sky Reasons
  // These stars represent personal reasons why Meena Banu is special
  reasons: [
    { id: 1, text: "Your smile instantly brightens up any room.", x: 25, y: 30 },
    { id: 2, text: "You are incredibly patient, kind, and supportive.", x: 45, y: 15 },
    { id: 3, text: "Your loyalty to the people you love is unmatched.", x: 70, y: 28 },
    { id: 4, text: "You find magic in the simple, quiet moments of life.", x: 15, y: 55 },
    { id: 5, text: "Your laugh is genuine, warm, and highly contagious.", x: 80, y: 60 },
    { id: 6, text: "You always push yourself and others to grow.", x: 55, y: 75 },
    { id: 7, text: "You have a beautiful heart that cares deeply.", x: 38, y: 48 },
    { id: 8, text: "You are simply, uniquely, and wonderfully you.", x: 62, y: 45 }
  ]
};
