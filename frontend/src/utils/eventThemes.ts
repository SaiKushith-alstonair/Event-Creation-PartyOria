export interface EventTheme {
  background: string;
  cardBg: string;
  buttonBg: string;
  buttonHover: string;
  accent: string;
  text: string;
  icon: string;
  animation: string;
}

// Unified Romantic Theme
const ROMANTIC_THEME: EventTheme = {
  background: 'romantic-theme-global',
  cardBg: 'romantic-card',
  buttonBg: 'romantic-button',
  buttonHover: 'hover:shadow-lg',
  accent: 'text-romantic-primary',
  text: 'romantic-text',
  icon: 'text-romantic-primary',
  animation: 'animate-float'
};

export const eventThemes: Record<string, EventTheme> = {
  // All Events - Unified Romantic Theme
  'corporate': ROMANTIC_THEME,
  'social': ROMANTIC_THEME,
  'cultural': ROMANTIC_THEME,
  'religious': ROMANTIC_THEME,
  'festival': ROMANTIC_THEME,
  'political': ROMANTIC_THEME,
  'sports': ROMANTIC_THEME,
  'educational': ROMANTIC_THEME,
  'health': ROMANTIC_THEME,
  'environmental': ROMANTIC_THEME,
  'virtual': ROMANTIC_THEME
};

// All subsection themes use the unified romantic theme
const subsectionThemes: Record<string, EventTheme> = {
  'wedding': ROMANTIC_THEME,
  'birthday': ROMANTIC_THEME,
  'conference': ROMANTIC_THEME,
  'diwali-celebration': ROMANTIC_THEME,
  'sports-tournament': ROMANTIC_THEME
};

export const getEventTheme = (eventType: string, subsectionId?: string): EventTheme => {
  // All events use the unified romantic theme
  return ROMANTIC_THEME;
};