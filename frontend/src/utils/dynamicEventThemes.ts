// Dynamic Event Color Theming System - Soft Pastel Romantic Style
export interface ColorPalette {
  bg: string;
  accent1: string;
  accent2: string;
  accent3: string;
  border: string;
  primary: string;
  buttonBase: string;
}

// Unified Soft Pastel Romantic Color Palette
const ROMANTIC_PALETTE = {
  bg: '#FDF6E3',        // Light beige background
  accent1: '#F8C8DC',   // Blush pink accents
  accent2: '#FEF3C7',   // Pale yellow (gold-foil-like)
  accent3: '#DBEAFE',   // Light blue (delicate waves)
  border: '#F8C8DC',    // Blush pink borders
  primary: '#F59E0B',   // Muted gold
  buttonBase: '#F59E0B' // Muted gold button
};

// Color palettes for all event types - Unified romantic theme
export const colorPalettes: Record<string, ColorPalette> = {
  // Corporate Events - Soft Pastel Romantic Theme
  'conference': ROMANTIC_PALETTE,
  'seminar': ROMANTIC_PALETTE,
  'corporate-party': ROMANTIC_PALETTE,
  'award-ceremony': ROMANTIC_PALETTE,
  'product-launch': ROMANTIC_PALETTE,
  'trade-show': ROMANTIC_PALETTE,
  'networking-mixer': ROMANTIC_PALETTE,
  'webinar': ROMANTIC_PALETTE,
  'leadership-summit': ROMANTIC_PALETTE,
  'hackathon': ROMANTIC_PALETTE,
  'investor-meetup': ROMANTIC_PALETTE,
  'career-expo': ROMANTIC_PALETTE,
  'industry-roundtable': ROMANTIC_PALETTE,
  'press-conference': ROMANTIC_PALETTE,

  // Social Events - Soft Pastel Romantic Theme
  'wedding': ROMANTIC_PALETTE,
  'engagement': ROMANTIC_PALETTE,
  'birthday': ROMANTIC_PALETTE,
  'anniversary': ROMANTIC_PALETTE,
  'baby-shower': ROMANTIC_PALETTE,
  'housewarming': ROMANTIC_PALETTE,
  'bachelor-party': ROMANTIC_PALETTE,
  'retirement': ROMANTIC_PALETTE,
  'farewell': ROMANTIC_PALETTE,
  'graduation-party': ROMANTIC_PALETTE,
  'kitty-party': ROMANTIC_PALETTE,
  'pre-wedding-shoot': ROMANTIC_PALETTE,
  'bridal-shower': ROMANTIC_PALETTE,
  'gender-reveal-party': ROMANTIC_PALETTE,
  'friendship-day-event': ROMANTIC_PALETTE,
  'valentines-day-celebration': ROMANTIC_PALETTE,
  'adoption-celebration': ROMANTIC_PALETTE,

  // Cultural Events - Soft Pastel Romantic Theme
  'cultural-fair': ROMANTIC_PALETTE,
  'naming-ceremony': ROMANTIC_PALETTE,
  'music-concert': ROMANTIC_PALETTE,
  'book-launch': ROMANTIC_PALETTE,
  'heritage-walk': ROMANTIC_PALETTE,
  'food-festival': ROMANTIC_PALETTE,
  'cultural-exchange': ROMANTIC_PALETTE,
  'language-festival': ROMANTIC_PALETTE,
  'handicraft-exhibition': ROMANTIC_PALETTE,
  'cultural-parade': ROMANTIC_PALETTE,
  'ethnic-wear-show': ROMANTIC_PALETTE,
  'regional-cuisine-fest': ROMANTIC_PALETTE,
  'cultural-documentary-screening': ROMANTIC_PALETTE,

  // Religious Events - Soft Pastel Romantic Theme
  'mass-gathering': ROMANTIC_PALETTE,
  'interfaith-gathering': ROMANTIC_PALETTE,
  'religious-seminar': ROMANTIC_PALETTE,
  'puja-ceremony': ROMANTIC_PALETTE,
  'kirtan': ROMANTIC_PALETTE,
  'satsang': ROMANTIC_PALETTE,
  'religious-discourse': ROMANTIC_PALETTE,
  'temple-inauguration': ROMANTIC_PALETTE,
  'religious-procession': ROMANTIC_PALETTE,
  'prayer-meeting': ROMANTIC_PALETTE,
  'community-service': ROMANTIC_PALETTE,
  'pilgrimage-tour': ROMANTIC_PALETTE,
  'blessing-ceremony': ROMANTIC_PALETTE,
  'sacred-thread-ceremony': ROMANTIC_PALETTE,

  // Festival Events - Soft Pastel Romantic Theme
  'diwali-celebration': ROMANTIC_PALETTE,
  'holi-festival': ROMANTIC_PALETTE,
  'eid-al-fitr': ROMANTIC_PALETTE,
  'eid-al-adha': ROMANTIC_PALETTE,
  'christmas-celebration': ROMANTIC_PALETTE,
  'new-years-party': ROMANTIC_PALETTE,
  'navratri-garba': ROMANTIC_PALETTE,
  'ganesh-chaturthi': ROMANTIC_PALETTE,
  'raksha-bandhan': ROMANTIC_PALETTE,
  'janmashtami': ROMANTIC_PALETTE,
  'onam': ROMANTIC_PALETTE,
  'durga-puja': ROMANTIC_PALETTE,
  'baisakhi': ROMANTIC_PALETTE,
  'gurupurab': ROMANTIC_PALETTE,
  'makar-sankranti': ROMANTIC_PALETTE,
  'easter-celebration': ROMANTIC_PALETTE,

  // Political Events - Soft Pastel Romantic Theme
  'charity-event': ROMANTIC_PALETTE,
  'political-rally': ROMANTIC_PALETTE,
  'election-campaign': ROMANTIC_PALETTE,
  'political-conference': ROMANTIC_PALETTE,
  'party-convention': ROMANTIC_PALETTE,
  'swearing-in-ceremony': ROMANTIC_PALETTE,
  'political-summit': ROMANTIC_PALETTE,
  'community-town-hall': ROMANTIC_PALETTE,

  // Sports Events - Soft Pastel Romantic Theme
  'sports-tournament': ROMANTIC_PALETTE,
  'marathon-run': ROMANTIC_PALETTE,
  'adventure-camp': ROMANTIC_PALETTE,
  'cycling-event': ROMANTIC_PALETTE,
  'sports-day': ROMANTIC_PALETTE,

  // Educational Events - Soft Pastel Romantic Theme
  'workshop': ROMANTIC_PALETTE,
  'lecture-series': ROMANTIC_PALETTE,
  'school-annual-day': ROMANTIC_PALETTE,
  'science-fair': ROMANTIC_PALETTE,
  'academic-symposium': ROMANTIC_PALETTE,
  'research-conference': ROMANTIC_PALETTE,
  'debate-competition': ROMANTIC_PALETTE,
  'quiz-contest': ROMANTIC_PALETTE,
  'literary-festival': ROMANTIC_PALETTE,

  // Health Events - Soft Pastel Romantic Theme
  'health-camp': ROMANTIC_PALETTE,
  'mental-health-awareness-event': ROMANTIC_PALETTE,
  'fitness-bootcamp': ROMANTIC_PALETTE,
  'health-fair': ROMANTIC_PALETTE,
  'blood-donation-drive': ROMANTIC_PALETTE,
  'health-screening': ROMANTIC_PALETTE,
  'medical-conference': ROMANTIC_PALETTE,
  'vaccination-drive': ROMANTIC_PALETTE,
  'health-awareness-campaign': ROMANTIC_PALETTE,

  // Environmental Events - Soft Pastel Romantic Theme
  'tree-planting-drive': ROMANTIC_PALETTE,
  'eco-festival': ROMANTIC_PALETTE,
  'clean-up-drive': ROMANTIC_PALETTE,
  'environmental-awareness-campaign': ROMANTIC_PALETTE,
  'green-living-expo': ROMANTIC_PALETTE,

  // Virtual Events - Soft Pastel Romantic Theme
  'online-webinar': ROMANTIC_PALETTE,
  'virtual-conference': ROMANTIC_PALETTE,
  'live-stream-party': ROMANTIC_PALETTE,
  'virtual-team-building-event': ROMANTIC_PALETTE,
  'online-product-launch': ROMANTIC_PALETTE,
  'virtual-charity-auction': ROMANTIC_PALETTE,
  'hybrid-festival-celebration': ROMANTIC_PALETTE,

  // Entertainment Events - Soft Pastel Romantic Theme
  'dance-performance': ROMANTIC_PALETTE,
  'comedy-show': ROMANTIC_PALETTE,
  'theater-play': ROMANTIC_PALETTE,
  'fashion-show': ROMANTIC_PALETTE,
  'magic-show': ROMANTIC_PALETTE,
  'storytelling-session': ROMANTIC_PALETTE,
  'karaoke-night': ROMANTIC_PALETTE,
  'open-mic-night': ROMANTIC_PALETTE,
  'film-screening': ROMANTIC_PALETTE,
  'poetry-reading': ROMANTIC_PALETTE,
  'celebrity-meet-greet': ROMANTIC_PALETTE,

  // Community Events - Soft Pastel Romantic Theme
  'neighborhood-gathering': ROMANTIC_PALETTE,
  'volunteer-appreciation': ROMANTIC_PALETTE,
  'fundraising-gala': ROMANTIC_PALETTE,
  'community-festival': ROMANTIC_PALETTE,
  'senior-citizen-program': ROMANTIC_PALETTE,
  'youth-development-program': ROMANTIC_PALETTE
};

// Helper functions
export const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

export const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

export const getEventType = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('eventType') || 'wedding';
};

export const updateHeading = (eventType: string): void => {
  const headingElement = document.querySelector('[data-heading="event-requirements"]');
  if (headingElement) {
    const capitalizedEventType = eventType.charAt(0).toUpperCase() + eventType.slice(1).replace(/-/g, ' ');
    headingElement.textContent = `Your ${capitalizedEventType} Requirements`;
  }
};

export const applyTheme = (eventType: string): void => {
  const palette = colorPalettes[eventType] || colorPalettes['wedding'];
  const buttonDark = darkenColor(palette.buttonBase, 20);
  
  document.body.className = `theme-${eventType.toLowerCase()}`;
  
  // Apply CSS variables
  document.documentElement.style.setProperty('--theme-bg', palette.bg);
  document.documentElement.style.setProperty('--theme-accent1', palette.accent1);
  document.documentElement.style.setProperty('--theme-accent2', palette.accent2);
  document.documentElement.style.setProperty('--theme-accent3', palette.accent3);
  document.documentElement.style.setProperty('--theme-border', palette.border);
  document.documentElement.style.setProperty('--theme-primary', palette.primary);
  document.documentElement.style.setProperty('--theme-button-dark', buttonDark);
  document.documentElement.style.setProperty('--theme-button-hover', lightenColor(buttonDark, 10));
};

// Initialize theming on load
export const initializeTheming = (): void => {
  const eventType = getEventType();
  applyTheme(eventType);
  updateHeading(eventType);
  
  // Listen for event type changes
  const eventSelect = document.querySelector('select[name="eventName"], input[name="eventName"]') as HTMLSelectElement | HTMLInputElement;
  if (eventSelect) {
    eventSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement | HTMLInputElement;
      const newEventType = target.value.toLowerCase().replace(/\s+/g, '-');
      applyTheme(newEventType);
      updateHeading(newEventType);
    });
  }
};