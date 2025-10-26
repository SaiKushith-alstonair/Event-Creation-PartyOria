
// Organized by event categories for better maintainability

// Common requirement templates to reduce duplication
const commonRequirements = {
  photography: [
    { id: 'event-photography', label: 'Event Photography', category: 'photography' },
    { id: 'candid-photography', label: 'Candid Photography', category: 'photography' },
    { id: 'professional-portraits', label: 'Professional Portraits', category: 'photography' }
  ],
  videography: [
    { id: 'event-videography', label: 'Event Videography', category: 'videography' },
    { id: 'highlight-reel', label: 'Highlight Reel', category: 'videography' },
    { id: 'live-streaming', label: 'Live Streaming', category: 'videography' }
  ],
  catering: [
    { id: 'event-catering', label: 'Event Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
    { id: 'refreshments', label: 'Refreshments', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
    { id: 'beverage-service', label: 'Beverage Service', category: 'catering', unit: 'hours', placeholder: 'How many hours?' }
  ],
  decoration: [
    { id: 'event-decoration', label: 'Event Decoration', category: 'decoration' },
    { id: 'floral-arrangements', label: 'Floral Arrangements', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' },
    { id: 'lighting-setup', label: 'Lighting Setup', category: 'decoration' }
  ],
  coordination: [
    { id: 'event-coordination', label: 'Event Coordination', category: 'coordination' },
    { id: 'timeline-management', label: 'Timeline Management', category: 'coordination' },
    { id: 'vendor-coordination', label: 'Vendor Coordination', category: 'coordination' }
  ],
  technical: [
    { id: 'av-equipment', label: 'AV Equipment', category: 'other', unit: 'sets', placeholder: 'How many AV sets?' },
    { id: 'sound-system', label: 'Sound System', category: 'music_dj' },
    { id: 'microphone-setup', label: 'Microphone Setup', category: 'music_dj', unit: 'microphones', placeholder: 'How many microphones?' }
  ]
};

// Helper function to create event requirements
const createEventRequirements = (categories: Record<string, any[]>) => {
  return categories;
};

export const eventSpecificRequirements: Record<string, any> = {
  // CORPORATE EVENTS
  'conference': createEventRequirements({
    'Technical Setup': [
      { 
        id: 'av-equipment', 
        label: 'AV Equipment', 
        category: 'other',
        questions: [
          { id: 'av-type', label: 'What type of AV equipment do you need?', type: 'dropdown', options: ['Projectors', 'Screens', 'Speakers', 'Microphones', 'All of the above'] },
          { id: 'venue-size', label: 'What is your venue size?', type: 'dropdown', options: ['Small (up to 50)', 'Medium (50-200)', 'Large (200-500)', 'Extra Large (500+)'] },
          { id: 'backup-equipment', label: 'Do you need backup equipment?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'projector-setup', 
        label: 'Projector Setup', 
        category: 'other', 
        unit: 'units', 
        placeholder: 'How many projectors?',
        questions: [
          { id: 'projector-type', label: 'Which projector type?', type: 'dropdown', options: ['LCD', 'DLP', 'LED', 'Laser'] },
          { id: 'brightness-level', label: 'What brightness level (lumens)?', type: 'dropdown', options: ['2000-3000', '3000-4000', '4000-5000', '5000+'] },
          { id: 'screen-size', label: 'Screen size preference?', type: 'dropdown', options: ['Small (6-8 ft)', 'Medium (8-12 ft)', 'Large (12-16 ft)', 'Extra Large (16+ ft)'] },
          { id: 'usage-location', label: 'Indoor or outdoor use?', type: 'dropdown', options: ['Indoor', 'Outdoor', 'Both'] },
          { id: 'installation-type', label: 'Portable or fixed installation?', type: 'dropdown', options: ['Portable', 'Fixed', 'Both'] }
        ]
      },
      { 
        id: 'microphone-system', 
        label: 'Microphone System', 
        category: 'music_dj', 
        unit: 'microphones', 
        placeholder: 'How many microphones?',
        questions: [
          { id: 'speaker-count', label: 'How many speakers?', type: 'number', min: 1, max: 50 },
          { id: 'microphone-type', label: 'Microphone type?', type: 'dropdown', options: ['Wireless', 'Lapel', 'Handheld', 'Podium', 'Multiple types'] },
          { id: 'recording-capability', label: 'Do you need recording capability?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'live-streaming', 
        label: 'Live Streaming', 
        category: 'videography',
        questions: [
          { id: 'streaming-platform', label: 'Which platform?', type: 'dropdown', options: ['YouTube', 'Zoom', 'Facebook Live', 'Custom Platform', 'Multiple Platforms'] },
          { id: 'expected-viewers', label: 'Expected viewers?', type: 'dropdown', options: ['Under 100', '100-500', '500-1000', '1000-5000', '5000+'] },
          { id: 'camera-setup', label: 'Single camera or multi-camera?', type: 'dropdown', options: ['Single Camera', 'Multi-Camera', 'Professional Multi-Camera'] },
          { id: 'recording-needed', label: 'Do you need recording?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'conference-app', 
        label: 'Conference App', 
        category: 'other',
        questions: [
          { id: 'attendee-count', label: 'Number of attendees?', type: 'number', min: 10, max: 10000 },
          { id: 'app-features', label: 'Features needed?', type: 'dropdown', options: ['Schedule only', 'Schedule + Networking', 'Schedule + Polls + Q&A', 'Full featured (All options)'] },
          { id: 'integration-requirements', label: 'Integration requirements?', type: 'dropdown', options: ['None', 'CRM Integration', 'Registration System', 'Custom Integration'] }
        ]
      },
      { 
        id: 'wifi-setup', 
        label: 'WiFi Setup', 
        category: 'other', 
        unit: 'access points', 
        placeholder: 'How many access points?',
        questions: [
          { id: 'user-count', label: 'Number of users?', type: 'dropdown', options: ['Under 50', '50-100', '100-300', '300-500', '500+'] },
          { id: 'bandwidth-requirements', label: 'Bandwidth requirements?', type: 'dropdown', options: ['Basic (10 Mbps)', 'Standard (50 Mbps)', 'High (100 Mbps)', 'Premium (500+ Mbps)'] },
          { id: 'security-level', label: 'Security level needed?', type: 'dropdown', options: ['Basic', 'Standard', 'High Security', 'Enterprise Level'] }
        ]
      },
      { 
        id: 'simultaneous-translation', 
        label: 'Simultaneous Translation', 
        category: 'other', 
        unit: 'booths', 
        placeholder: 'How many translation booths?',
        questions: [
          { id: 'language-count', label: 'How many languages?', type: 'number', min: 1, max: 20 },
          { id: 'participants-per-language', label: 'Number of participants per language?', type: 'dropdown', options: ['Under 20', '20-50', '50-100', '100+'] },
          { id: 'equipment-type', label: 'Equipment type?', type: 'dropdown', options: ['Wireless receivers only', 'Translation booths only', 'Both wireless and booths'] }
        ]
      }
    ],
    'Catering Services': [
      { 
        id: 'event-catering', 
        label: 'Event Catering', 
        category: 'catering', 
        unit: 'meals', 
        placeholder: 'How many meals?',
        questions: [
          { id: 'guest-count', label: 'Number of guests?', type: 'number', min: 1, max: 5000 },
          { id: 'meal-type', label: 'Meal type?', type: 'dropdown', options: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Multiple meals'] },
          { id: 'dietary-restrictions', label: 'Dietary restrictions?', type: 'dropdown', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Jain', 'Multiple options'] },
          { id: 'service-style', label: 'Service style?', type: 'dropdown', options: ['Buffet', 'Plated', 'Family-style', 'Food stations'] },
          { id: 'cuisine-preference', label: 'Cuisine preference?', type: 'dropdown', options: ['Indian', 'Continental', 'Chinese', 'Italian', 'Mixed cuisine'] }
        ]
      },
      { 
        id: 'business-lunch', 
        label: 'Business Lunch', 
        category: 'catering', 
        unit: 'meals', 
        placeholder: 'How many meals?',
        questions: [
          { id: 'attendee-count', label: 'Number of attendees?', type: 'number', min: 1, max: 200 },
          { id: 'meal-preference', label: 'Meal preference?', type: 'dropdown', options: ['Light lunch', 'Full course meal', 'Executive lunch', 'Working lunch'] },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['30 minutes', '1 hour', '1.5 hours', '2 hours'] }
        ]
      },
      { 
        id: 'coffee-breaks', 
        label: 'Coffee Breaks', 
        category: 'catering', 
        unit: 'breaks', 
        placeholder: 'How many breaks?',
        questions: [
          { id: 'break-count', label: 'Number of breaks?', type: 'number', min: 1, max: 5 },
          { id: 'people-count', label: 'Number of people?', type: 'number', min: 1, max: 1000 },
          { id: 'items-needed', label: 'Items needed?', type: 'dropdown', options: ['Coffee & Tea only', 'Coffee, Tea & Snacks', 'Coffee, Tea, Snacks & Fresh juice', 'Full refreshment spread'] }
        ]
      }
    ],
    'Documentation': [
      ...commonRequirements.photography,
      ...commonRequirements.videography
    ],
    'Coordination': [
      { 
        id: 'event-coordination', 
        label: 'Event Coordination', 
        category: 'coordination',
        questions: [
          { id: 'event-duration', label: 'Event duration?', type: 'dropdown', options: ['Half day', 'Full day', '2 days', '3+ days'] },
          { id: 'coordinators-needed', label: 'Number of coordinators needed?', type: 'number', min: 1, max: 10 },
          { id: 'specific-responsibilities', label: 'Specific responsibilities?', type: 'dropdown', options: ['General coordination', 'Speaker management', 'Registration management', 'Technical coordination', 'All areas'] }
        ]
      },
      { 
        id: 'registration-desk', 
        label: 'Registration Desk', 
        category: 'coordination', 
        unit: 'desks', 
        placeholder: 'How many desks?',
        questions: [
          { id: 'expected-attendees', label: 'Expected attendees?', type: 'dropdown', options: ['Under 100', '100-300', '300-500', '500-1000', '1000+'] },
          { id: 'registration-type', label: 'Digital or manual registration?', type: 'dropdown', options: ['Digital only', 'Manual only', 'Both digital and manual'] },
          { id: 'badge-printing', label: 'Badge printing needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'speaker-coordination', 
        label: 'Speaker Coordination', 
        category: 'coordination', 
        unit: 'coordinators', 
        placeholder: 'How many coordinators?',
        questions: [
          { id: 'speaker-count', label: 'Number of speakers?', type: 'number', min: 1, max: 50 },
          { id: 'technical-requirements', label: 'Technical requirements per speaker?', type: 'dropdown', options: ['Basic (mic + screen)', 'Standard (AV setup)', 'Advanced (full production)', 'Custom requirements'] },
          { id: 'green-room-needed', label: 'Green room needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ]
  }),

  'seminar': {
    'Technical Setup': [
      { 
        id: 'presentation-equipment', 
        label: 'Presentation Equipment', 
        category: 'other',
        questions: [
          { id: 'equipment-type', label: 'Type needed?', type: 'dropdown', options: ['Projector only', 'Screen only', 'Laptop', 'Pointer', 'Complete setup (All items)'] },
          { id: 'backup-required', label: 'Backup equipment required?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'audio-system', 
        label: 'Audio System', 
        category: 'music_dj',
        questions: [
          { id: 'room-size', label: 'Room size?', type: 'dropdown', options: ['Small (up to 30)', 'Medium (30-100)', 'Large (100-300)', 'Extra Large (300+)'] },
          { id: 'speaker-count', label: 'Number of speakers?', type: 'number', min: 1, max: 20 },
          { id: 'recording-needed', label: 'Recording needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'recording-equipment', 
        label: 'Recording Equipment', 
        category: 'videography', 
        unit: 'cameras', 
        placeholder: 'How many cameras?',
        questions: [
          { id: 'recording-type', label: 'Video or audio only?', type: 'dropdown', options: ['Video only', 'Audio only', 'Both video and audio'] },
          { id: 'quality-level', label: 'Quality level?', type: 'dropdown', options: ['Standard (720p)', 'HD (1080p)', '4K', 'Professional grade'] },
          { id: 'streaming-integration', label: 'Live streaming integration?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Educational Materials': [
      { 
        id: 'handout-printing', 
        label: 'Handout Printing', 
        category: 'other', 
        unit: 'copies', 
        placeholder: 'How many copies?',
        questions: [
          { id: 'copy-count', label: 'Number of copies?', type: 'number', min: 1, max: 1000 },
          { id: 'color-type', label: 'Color or B&W?', type: 'dropdown', options: ['Black & White', 'Color', 'Mixed (some color, some B&W)'] },
          { id: 'page-count', label: 'Page count?', type: 'dropdown', options: ['1-5 pages', '6-20 pages', '21-50 pages', '50+ pages'] },
          { id: 'binding-type', label: 'Binding type?', type: 'dropdown', options: ['No binding', 'Stapled', 'Spiral bound', 'Perfect bound'] }
        ]
      },
      { 
        id: 'workshop-materials', 
        label: 'Workshop Materials', 
        category: 'other', 
        unit: 'kits', 
        placeholder: 'How many kits?',
        questions: [
          { id: 'material-type', label: 'What materials?', type: 'dropdown', options: ['Notebooks only', 'Pens only', 'Folders only', 'Complete kit (Notebooks, Pens, Folders)', 'Custom materials'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 500 },
          { id: 'custom-branding', label: 'Custom branding?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'name-badges', 
        label: 'Name Badges', 
        category: 'other', 
        unit: 'badges', 
        placeholder: 'How many badges?',
        questions: [
          { id: 'badge-type', label: 'Badge type?', type: 'dropdown', options: ['Paper', 'Plastic', 'Magnetic', 'Premium (Metal/Wood)'] },
          { id: 'custom-design', label: 'Custom design needed?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 1000 }
        ]
      }
    ],
    'Catering Services': [
      { 
        id: 'refreshment-breaks', 
        label: 'Refreshment Breaks', 
        category: 'catering', 
        unit: 'sessions', 
        placeholder: 'How many breaks?',
        questions: [
          { id: 'break-count', label: 'Number of breaks?', type: 'number', min: 1, max: 5 },
          { id: 'people-count', label: 'Number of people?', type: 'number', min: 1, max: 500 },
          { id: 'refreshment-type', label: 'Refreshment type?', type: 'dropdown', options: ['Tea/Coffee only', 'Tea/Coffee + Light snacks', 'Full refreshment spread', 'Healthy options only'] }
        ]
      },
      { 
        id: 'lunch-catering', 
        label: 'Lunch Catering', 
        category: 'catering', 
        unit: 'meals', 
        placeholder: 'How many meals?',
        questions: [
          { id: 'meal-count', label: 'Number of meals?', type: 'number', min: 1, max: 500 },
          { id: 'meal-type', label: 'Meal type?', type: 'dropdown', options: ['Light lunch', 'Full course meal', 'Buffet style', 'Packed lunch boxes'] },
          { id: 'dietary-requirements', label: 'Dietary requirements?', type: 'dropdown', options: ['None', 'Vegetarian options', 'Vegan options', 'Gluten-free', 'Multiple dietary needs'] }
        ]
      }
    ]
  },

  'corporate-party': {
    'Entertainment': [
      { 
        id: 'corporate-dj', 
        label: 'Corporate DJ', 
        category: 'music_dj',
        questions: [
          { id: 'music-genre', label: 'Music genre preference?', type: 'dropdown', options: ['Pop/Top 40', 'Rock', 'Jazz', 'Electronic/Dance', 'Mixed genres', 'Client specific playlist'] },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['2 hours', '3 hours', '4 hours', '5+ hours', 'Full event'] },
          { id: 'special-requests', label: 'Special song requests?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'live-band', 
        label: 'Live Band', 
        category: 'entertainment',
        questions: [
          { id: 'band-genre', label: 'Band type/genre?', type: 'dropdown', options: ['Rock band', 'Jazz band', 'Acoustic', 'Cover band', 'Corporate entertainment band', 'Cultural/Traditional'] },
          { id: 'number-of-sets', label: 'Number of sets?', type: 'dropdown', options: ['1 set (45 min)', '2 sets (90 min)', '3 sets (2+ hours)', 'Continuous performance'] },
          { id: 'space-requirements', label: 'Space requirements?', type: 'dropdown', options: ['Small stage area', 'Medium stage', 'Large stage', 'No stage needed'] }
        ]
      },
      { 
        id: 'team-building-activities', 
        label: 'Team Building Activities', 
        category: 'entertainment', 
        unit: 'activities', 
        placeholder: 'How many activities?',
        questions: [
          { id: 'participant-count', label: 'Number of participants?', type: 'number', min: 5, max: 500 },
          { id: 'activity-location', label: 'Indoor or outdoor?', type: 'dropdown', options: ['Indoor only', 'Outdoor only', 'Both indoor and outdoor', 'Flexible'] },
          { id: 'activity-preference', label: 'Activity type preference?', type: 'dropdown', options: ['Problem solving games', 'Physical challenges', 'Creative workshops', 'Communication exercises', 'Mixed activities'] },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['1 hour', '2 hours', '3 hours', 'Half day', 'Full day'] }
        ]
      }
    ],
    'Catering Services': [
      { 
        id: 'cocktail-service', 
        label: 'Cocktail Service', 
        category: 'catering',
        questions: [
          { id: 'guest-count', label: 'Number of guests?', type: 'number', min: 10, max: 1000 },
          { id: 'bar-type', label: 'Open bar or limited selection?', type: 'dropdown', options: ['Open bar', 'Limited selection', 'Premium selection', 'Non-alcoholic only'] },
          { id: 'signature-cocktails', label: 'Signature cocktails?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'service-duration', label: 'Duration of service?', type: 'dropdown', options: ['2 hours', '3 hours', '4 hours', '5+ hours'] }
        ]
      },
      { 
        id: 'dinner-buffet', 
        label: 'Dinner Buffet', 
        category: 'catering', 
        unit: 'counters', 
        placeholder: 'How many counters?',
        questions: [
          { id: 'guest-count', label: 'Number of guests?', type: 'number', min: 10, max: 1000 },
          { id: 'cuisine-type', label: 'Cuisine type?', type: 'dropdown', options: ['Indian', 'Continental', 'Chinese', 'Italian', 'Mixed international', 'Regional specialty'] },
          { id: 'course-count', label: 'Number of courses?', type: 'dropdown', options: ['Appetizers only', 'Main course only', 'Appetizers + Main', 'Full course (App + Main + Dessert)'] },
          { id: 'dietary-requirements', label: 'Dietary requirements?', type: 'dropdown', options: ['Standard', 'Vegetarian options', 'Vegan options', 'Gluten-free', 'Halal', 'Multiple dietary needs'] }
        ]
      },
      { 
        id: 'bartender-service', 
        label: 'Bartender Service', 
        category: 'catering', 
        unit: 'bartenders', 
        placeholder: 'How many bartenders?',
        questions: [
          { id: 'bartender-count', label: 'Number of bartenders?', type: 'number', min: 1, max: 10 },
          { id: 'bar-setup-type', label: 'Bar setup type?', type: 'dropdown', options: ['Single main bar', 'Multiple bar stations', 'Mobile bar cart', 'Premium bar setup'] },
          { id: 'service-duration', label: 'Duration?', type: 'dropdown', options: ['2 hours', '3 hours', '4 hours', '5+ hours', 'Full event'] }
        ]
      }
    ],
    'Decoration': [
      { id: 'corporate-branding', label: 'Corporate Branding', category: 'decoration' },
      { id: 'lighting-design', label: 'Lighting Design', category: 'decoration' },
      { id: 'floral-arrangements', label: 'Floral Arrangements', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' }
    ]
  },

  'product-launch': {
    'Marketing Services': [
      { 
        id: 'pr-coordination', 
        label: 'PR Coordination', 
        category: 'other',
        questions: [
          { id: 'target-media', label: 'Target media outlets?', type: 'dropdown', options: ['Local media', 'National media', 'Industry publications', 'Digital media', 'All media types'] },
          { id: 'press-release', label: 'Press release needed?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'media-attendance', label: 'Media attendance expected?', type: 'dropdown', options: ['Under 10', '10-25', '25-50', '50+'] }
        ]
      },
      { 
        id: 'media-kit', 
        label: 'Media Kit', 
        category: 'other', 
        unit: 'kits', 
        placeholder: 'How many kits?',
        questions: [
          { id: 'kit-format', label: 'Digital or physical?', type: 'dropdown', options: ['Digital only', 'Physical only', 'Both digital and physical'] },
          { id: 'content-include', label: 'Content to include?', type: 'dropdown', options: ['Press release only', 'Press release + Images', 'Complete kit (Press release, Images, Product info)', 'Custom content'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 200 }
        ]
      },
      { 
        id: 'influencer-management', 
        label: 'Influencer Management', 
        category: 'other', 
        unit: 'influencers', 
        placeholder: 'How many influencers?',
        questions: [
          { id: 'influencer-count', label: 'Number of influencers?', type: 'number', min: 1, max: 50 },
          { id: 'platform-focus', label: 'Platform focus?', type: 'dropdown', options: ['Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Multiple platforms'] },
          { id: 'engagement-requirements', label: 'Engagement requirements?', type: 'dropdown', options: ['Micro influencers (1K-10K)', 'Mid-tier (10K-100K)', 'Macro influencers (100K+)', 'Celebrity level', 'Mixed tiers'] }
        ]
      }
    ],
    'Technical Setup': [
      { 
        id: 'product-demo-setup', 
        label: 'Product Demo Setup', 
        category: 'other', 
        unit: 'stations', 
        placeholder: 'How many demo stations?',
        questions: [
          { id: 'demo-stations', label: 'Number of demo stations?', type: 'number', min: 1, max: 20 },
          { id: 'power-requirements', label: 'Power requirements?', type: 'dropdown', options: ['Standard power', 'High power equipment', 'Backup power needed', 'No special requirements'] },
          { id: 'internet-needed', label: 'Internet needed?', type: 'dropdown', options: ['Yes - High speed', 'Yes - Standard', 'No'] }
        ]
      },
      { 
        id: 'av-production', 
        label: 'AV Production', 
        category: 'videography',
        questions: [
          { id: 'video-production', label: 'Video production needed?', type: 'dropdown', options: ['Yes - Professional', 'Yes - Standard', 'No'] },
          { id: 'graphics-animation', label: 'Graphics/animation requirements?', type: 'dropdown', options: ['None', 'Basic graphics', 'Advanced graphics', 'Full animation'] },
          { id: 'screen-sizes', label: 'Screen sizes?', type: 'dropdown', options: ['Small screens', 'Medium screens', 'Large screens', 'Multiple sizes'] }
        ]
      },
      { id: 'live-streaming', label: 'Live Streaming', category: 'videography' }
    ],
    'Documentation': [
      { id: 'product-photography', label: 'Product Photography', category: 'photography' },
      { id: 'event-videography', label: 'Event Videography', category: 'videography' }
    ]
  },

  // SOCIAL EVENTS
  'wedding': {
    'Photography Services': [
      { id: 'bridal-photography', label: 'Bridal Photography', category: 'photography' },
      { id: 'couple-photography', label: 'Couple Photography', category: 'photography' },
      { id: 'family-photography', label: 'Family Photography', category: 'photography' },
      { id: 'candid-photography', label: 'Candid Photography', category: 'photography' },
      { id: 'reception-photography', label: 'Reception Photography', category: 'photography' },
      { id: 'mehendi-photography', label: 'Mehendi Photography', category: 'photography' },
      { id: 'traditional-portraits', label: 'Traditional Portraits', category: 'photography' },
      { id: 'wedding-album-design', label: 'Wedding Album Design', category: 'photography', unit: 'albums', placeholder: 'How many albums?' }
    ],
    'Videography Services': [
      { id: 'wedding-videography', label: 'Wedding Videography', category: 'videography' },
      { id: 'drone-videography', label: 'Drone Videography', category: 'videography' },
      { id: 'highlight-reel', label: 'Highlight Reel', category: 'videography' },
      { id: 'ceremony-recording', label: 'Ceremony Recording', category: 'videography' },
      { id: 'cinematic-video', label: 'Cinematic Video', category: 'videography' },
      { id: 'live-streaming', label: 'Live Streaming', category: 'videography' },
      { id: 'same-day-edit', label: 'Same Day Edit', category: 'videography' },
      { id: 'pre-wedding-video', label: 'Pre-Wedding Video', category: 'videography' }
    ],
    'Catering Services': [
      { id: 'wedding-catering', label: 'Wedding Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'cocktail-service', label: 'Cocktail Service', category: 'catering' },
      { id: 'wedding-cake', label: 'Wedding Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' }
    ],
    'Decoration & Setup': [
      { id: 'mandap-decoration', label: 'Mandap Decoration', category: 'decoration' },
      { id: 'floral-decoration', label: 'Floral Decoration', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' },
      { id: 'lighting-setup', label: 'Lighting Setup', category: 'decoration' }
    ],
    'Entertainment': [
      { id: 'wedding-band', label: 'Wedding Band', category: 'entertainment' },
      { id: 'dj-services', label: 'DJ Services', category: 'music_dj' },
      { id: 'traditional-musicians', label: 'Traditional Musicians', category: 'entertainment', unit: 'musicians', placeholder: 'How many musicians?' }
    ]
  },

  // ENVIRONMENTAL EVENTS
  'tree-planting-drive': {
    'Plant & Equipment': [
      { id: 'tree-saplings', label: 'Tree Saplings', category: 'other', unit: 'saplings', placeholder: 'How many saplings?' },
      { id: 'gardening-tools', label: 'Gardening Tools', category: 'other', unit: 'sets', placeholder: 'How many tool sets?' },
      { id: 'watering-equipment', label: 'Watering Equipment', category: 'other', unit: 'units', placeholder: 'How many watering units?' },
      { id: 'soil-fertilizer', label: 'Soil & Fertilizer', category: 'other', unit: 'bags', placeholder: 'How many bags?' }
    ],
    'Educational Services': [
      { id: 'environmental-educator', label: 'Environmental Educator', category: 'other', unit: 'educators', placeholder: 'How many educators?' },
      { id: 'planting-instructor', label: 'Planting Instructor', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' }
    ],
    'Logistics': [
      { id: 'transportation-plants', label: 'Transportation for Plants', category: 'transportation', unit: 'vehicles', placeholder: 'How many vehicles?' },
      { id: 'volunteer-coordination', label: 'Volunteer Coordination', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' },
      { id: 'site-preparation', label: 'Site Preparation', category: 'other' }
    ],
    'Documentation': [
      ...commonRequirements.photography,
      { id: 'progress-documentation', label: 'Progress Documentation', category: 'videography' }
    ]
  },

  'birthday': {
    'Entertainment': [
      { id: 'magic-show', label: 'Magic Show', category: 'entertainment', unit: 'shows', placeholder: 'How many shows?' },
      { id: 'clown-performance', label: 'Clown Performance', category: 'entertainment', unit: 'performers', placeholder: 'How many clowns?' },
      { id: 'face-painting', label: 'Face Painting', category: 'entertainment', unit: 'artists', placeholder: 'How many artists?' },
      { id: 'balloon-artist', label: 'Balloon Artist', category: 'entertainment', unit: 'artists', placeholder: 'How many artists?' }
    ],
    'Catering Services': [
      { id: 'birthday-cake', label: 'Birthday Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' },
      { id: 'snacks-catering', label: 'Snacks & Refreshments', category: 'catering', unit: 'platters', placeholder: 'How many platters?' },
      { id: 'party-treats', label: 'Party Treats', category: 'catering', unit: 'varieties', placeholder: 'How many varieties?' }
    ],
    'Decoration': [
      { id: 'balloon-decoration', label: 'Balloon Decoration', category: 'decoration', unit: 'setups', placeholder: 'How many setups?' },
      { id: 'theme-decoration', label: 'Theme Decoration', category: 'decoration', unit: 'themes', placeholder: 'How many themes?' },
      { id: 'banner-setup', label: 'Banner Setup', category: 'decoration', unit: 'banners', placeholder: 'How many banners?' }
    ],
    'Photography Services': commonRequirements.photography
  },

  // Add all other events with proper structure
  'engagement': {
    'Photography Services': commonRequirements.photography,
    'Decoration': commonRequirements.decoration,
    'Catering Services': commonRequirements.catering
  },

  'sports-tournament': {
    'Equipment & Facilities': [
      { id: 'sports-equipment', label: 'Sports Equipment', category: 'other', unit: 'sets', placeholder: 'How many equipment sets?' },
      { id: 'scoreboards', label: 'Scoreboards', category: 'other', unit: 'boards', placeholder: 'How many scoreboards?' },
      { id: 'timing-systems', label: 'Timing Systems', category: 'other' }
    ],
    'Officials & Staff': [
      { id: 'referees-umpires', label: 'Referees/Umpires', category: 'other', unit: 'officials', placeholder: 'How many officials?' },
      { id: 'medical-staff', label: 'Medical Staff', category: 'other', unit: 'staff', placeholder: 'How many medical staff?' }
    ],
    'Support Services': [
      { id: 'player-refreshments', label: 'Player Refreshments', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'trophy-awards', label: 'Trophy & Awards', category: 'other', unit: 'trophies', placeholder: 'How many trophies?' }
    ]
  },

  'online-webinar': {
    'Technical Platform': [
      { id: 'webinar-platform', label: 'Webinar Platform', category: 'other' },
      { id: 'streaming-software', label: 'Streaming Software', category: 'other' },
      { id: 'chat-moderation', label: 'Chat Moderation', category: 'other', unit: 'moderators', placeholder: 'How many moderators?' }
    ],
    'Content & Support': [
      { id: 'presentation-slides', label: 'Presentation Slides', category: 'other', unit: 'presentations', placeholder: 'How many presentations?' },
      { id: 'technical-support', label: 'Technical Support', category: 'other', unit: 'technicians', placeholder: 'How many technicians?' }
    ]
  },

  'health-camp': {
    'Medical Services': [
      { id: 'health-screening', label: 'Health Screening', category: 'other', unit: 'stations', placeholder: 'How many screening stations?' },
      { id: 'medical-equipment', label: 'Medical Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'doctors', label: 'Doctors', category: 'other', unit: 'doctors', placeholder: 'How many doctors?' }
    ],
    'Support Services': [
      { id: 'refreshment-counter', label: 'Refreshment Counter', category: 'catering', unit: 'counters', placeholder: 'How many counters?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  // Default fallback for any missing events
  'default': {
    'Essential Services': [
      ...commonRequirements.photography.slice(0, 1),
      ...commonRequirements.coordination.slice(0, 1),
      ...commonRequirements.decoration.slice(0, 1)
    ],
    'Catering Services': commonRequirements.catering,
    'Technical Support': commonRequirements.technical
  },

  'eco-festival': {
    'Sustainable Services': [
      { id: 'eco-friendly-vendors', label: 'Eco-Friendly Vendors', category: 'other', unit: 'vendors', placeholder: 'How many vendors?' },
      { id: 'organic-food-stalls', label: 'Organic Food Stalls', category: 'catering', unit: 'stalls', placeholder: 'How many stalls?' },
      { id: 'recycling-stations', label: 'Recycling Stations', category: 'other', unit: 'stations', placeholder: 'How many stations?' },
      { id: 'solar-power-setup', label: 'Solar Power Setup', category: 'other' }
    ],
    'Educational Exhibits': [
      { id: 'sustainability-displays', label: 'Sustainability Displays', category: 'other', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'workshop-facilitators', label: 'Workshop Facilitators', category: 'other', unit: 'facilitators', placeholder: 'How many facilitators?' },
      { id: 'environmental-speakers', label: 'Environmental Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' }
    ]
  },



  'marathon-run': {
    'Race Management': [
      { id: 'route-marking', label: 'Route Marking', category: 'other' },
      { id: 'timing-chips', label: 'Timing Chips', category: 'other', unit: 'chips', placeholder: 'How many chips?' },
      { id: 'water-stations', label: 'Water Stations', category: 'catering', unit: 'stations', placeholder: 'How many stations?' },
      { id: 'finish-line-setup', label: 'Finish Line Setup', category: 'other' }
    ],
    'Safety & Medical': [
      { id: 'medical-teams', label: 'Medical Teams', category: 'other', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'ambulance-service', label: 'Ambulance Service', category: 'other', unit: 'ambulances', placeholder: 'How many ambulances?' },
      { id: 'safety-marshals', label: 'Safety Marshals', category: 'other', unit: 'marshals', placeholder: 'How many marshals?' }
    ],
    'Participant Services': [
      { id: 'registration-booth', label: 'Registration Booth', category: 'coordination', unit: 'booths', placeholder: 'How many booths?' },
      { id: 'participant-kits', label: 'Participant Kits', category: 'other', unit: 'kits', placeholder: 'How many kits?' },
      { id: 'medal-ceremony', label: 'Medal Ceremony', category: 'other' }
    ]
  },



  'virtual-conference': {
    'Platform & Technology': [
      { id: 'virtual-event-platform', label: 'Virtual Event Platform', category: 'other' },
      { id: 'multi-session-support', label: 'Multi-Session Support', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'networking-tools', label: 'Networking Tools', category: 'other' },
      { id: 'virtual-exhibition', label: 'Virtual Exhibition', category: 'other', unit: 'exhibitions', placeholder: 'How many exhibitions?' }
    ],
    'Production Services': [
      { id: 'live-streaming', label: 'Live Streaming', category: 'videography' },
      { id: 'video-production', label: 'Video Production', category: 'videography', unit: 'videos', placeholder: 'How many videos?' },
      { id: 'audio-engineering', label: 'Audio Engineering', category: 'music_dj', unit: 'engineers', placeholder: 'How many engineers?' }
    ]
  },

  // FESTIVAL EVENTS
  'diwali-celebration': {
    'Decoration Services': [
      { id: 'diya-decoration', label: 'Diya Decoration', category: 'decoration', unit: 'diyas', placeholder: 'How many diyas?' },
      { id: 'rangoli-setup', label: 'Rangoli Setup', category: 'decoration', unit: 'rangolis', placeholder: 'How many rangolis?' },
      { id: 'festive-lighting', label: 'Festive Lighting', category: 'decoration' },
      { id: 'lantern-display', label: 'Lantern Display', category: 'decoration', unit: 'lanterns', placeholder: 'How many lanterns?' },
      { id: 'flower-decoration', label: 'Flower Decoration', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' },
      { id: 'torans-garlands', label: 'Torans & Garlands', category: 'decoration', unit: 'pieces', placeholder: 'How many pieces?' }
    ],
    'Entertainment': [
      { id: 'cultural-performance', label: 'Cultural Performance', category: 'entertainment', unit: 'performances', placeholder: 'How many performances?' },
      { id: 'traditional-music', label: 'Traditional Music', category: 'entertainment', unit: 'musicians', placeholder: 'How many musicians?' },
      { id: 'dance-performances', label: 'Dance Performances', category: 'entertainment', unit: 'dancers', placeholder: 'How many dancers?' },
      { id: 'fireworks-display', label: 'Fireworks Display', category: 'entertainment' }
    ],
    'Catering': [
      { id: 'festive-sweets', label: 'Festive Sweets', category: 'catering', unit: 'varieties', placeholder: 'How many varieties?' },
      { id: 'traditional-food', label: 'Traditional Food', category: 'catering', unit: 'dishes', placeholder: 'How many dishes?' },
      { id: 'mithai-counter', label: 'Mithai Counter', category: 'catering', unit: 'counters', placeholder: 'How many counters?' }
    ],
    'Cultural Activities': [
      { id: 'lakshmi-puja', label: 'Lakshmi Puja', category: 'other' },
      { id: 'aarti-ceremony', label: 'Aarti Ceremony', category: 'other' },
      { id: 'bhajan-singing', label: 'Bhajan Singing', category: 'entertainment', unit: 'singers', placeholder: 'How many singers?' }
    ]
  },

  'christmas-celebration': {
    'Decoration Services': [
      { id: 'christmas-tree-setup', label: 'Christmas Tree Setup', category: 'decoration', unit: 'trees', placeholder: 'How many trees?' },
      { id: 'festive-lighting', label: 'Festive Lighting', category: 'decoration' },
      { id: 'christmas-ornaments', label: 'Christmas Ornaments', category: 'decoration', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'nativity-scene', label: 'Nativity Scene', category: 'decoration' }
    ],
    'Entertainment': [
      { id: 'christmas-carols', label: 'Christmas Carols', category: 'entertainment', unit: 'singers', placeholder: 'How many singers?' },
      { id: 'santa-claus-performer', label: 'Santa Claus Performer', category: 'entertainment' }
    ],
    'Catering': [
      { id: 'christmas-feast', label: 'Christmas Feast', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'christmas-cake', label: 'Christmas Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' }
    ]
  },

  'holi-festival': {
    'Festival Supplies': [
      { id: 'organic-colors', label: 'Organic Colors', category: 'other', unit: 'packets', placeholder: 'How many packets?' },
      { id: 'water-guns', label: 'Water Guns', category: 'other', unit: 'guns', placeholder: 'How many guns?' },
      { id: 'color-powder', label: 'Color Powder', category: 'other', unit: 'packets', placeholder: 'How many packets?' },
      { id: 'protective-gear', label: 'Protective Gear', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ],
    'Entertainment': [
      { id: 'dhol-players', label: 'Dhol Players', category: 'entertainment', unit: 'players', placeholder: 'How many players?' },
      { id: 'folk-dancers', label: 'Folk Dancers', category: 'entertainment', unit: 'dancers', placeholder: 'How many dancers?' },
      { id: 'music-system', label: 'Music System', category: 'music_dj' }
    ],
    'Refreshments': [
      { id: 'thandai-service', label: 'Thandai Service', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
      { id: 'traditional-snacks', label: 'Traditional Snacks', category: 'catering', unit: 'platters', placeholder: 'How many platters?' },
      { id: 'cooling-drinks', label: 'Cooling Drinks', category: 'catering', unit: 'servings', placeholder: 'How many servings?' }
    ]
  },

  'ganesh-chaturthi': {
    'Decoration': [
      { id: 'ganesh-idol', label: 'Ganesh Idol', category: 'decoration', unit: 'idols', placeholder: 'How many idols?' },
      { id: 'pandal-decoration', label: 'Pandal Decoration', category: 'decoration' }
    ],
    'Entertainment': [
      { id: 'dhol-tasha', label: 'Dhol Tasha', category: 'entertainment', unit: 'groups', placeholder: 'How many groups?' }
    ],
    'Catering': [
      { id: 'modak-service', label: 'Modak Service', category: 'catering', unit: 'pieces', placeholder: 'How many pieces?' }
    ]
  },

  'navratri-garba': {
    'Entertainment': [
      { id: 'garba-instructors', label: 'Garba Instructors', category: 'entertainment', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'dandiya-sticks', label: 'Dandiya Sticks', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'traditional-music', label: 'Traditional Music', category: 'music_dj' }
    ],
    'Services': [
      { id: 'costume-rental', label: 'Costume Rental', category: 'other', unit: 'costumes', placeholder: 'How many costumes?' }
    ]
  },

  'durga-puja': {
    'Decoration': [
      { id: 'pandal-design', label: 'Pandal Design', category: 'decoration' },
      { id: 'durga-idol', label: 'Durga Idol', category: 'decoration', unit: 'idols', placeholder: 'How many idols?' }
    ],
    'Entertainment': [
      { id: 'dhak-players', label: 'Dhak Players', category: 'entertainment', unit: 'players', placeholder: 'How many players?' }
    ]
  },

  'janmashtami': {
    'Entertainment': [
      { id: 'dahi-handi', label: 'Dahi Handi', category: 'entertainment' },
      { id: 'flute-players', label: 'Flute Players', category: 'entertainment', unit: 'players', placeholder: 'How many players?' }
    ],
    'Services': [
      { id: 'krishna-costumes', label: 'Krishna Costumes', category: 'other', unit: 'costumes', placeholder: 'How many costumes?' }
    ]
  },

  'onam': {
    'Decoration': [
      { id: 'pookalam-flowers', label: 'Pookalam Flowers', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' }
    ],
    'Entertainment': [
      { id: 'kathakali-performers', label: 'Kathakali Performers', category: 'entertainment', unit: 'performers', placeholder: 'How many performers?' }
    ],
    'Catering': [
      { id: 'sadhya-catering', label: 'Sadhya Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' }
    ]
  },

  'raksha-bandhan': {
    'Services': [
      { id: 'rakhi-supplies', label: 'Rakhi Supplies', category: 'other', unit: 'rakhis', placeholder: 'How many rakhis?' },
      { id: 'gift-coordination', label: 'Gift Coordination', category: 'coordination' }
    ],
    'Beauty': [
      { id: 'henna-artists', label: 'Henna Artists', category: 'beauty', unit: 'artists', placeholder: 'How many artists?' }
    ]
  },

  'baisakhi': {
    'Entertainment': [
      { id: 'bhangra-performers', label: 'Bhangra Performers', category: 'entertainment', unit: 'performers', placeholder: 'How many performers?' }
    ],
    'Services': [
      { id: 'turban-tying', label: 'Turban Tying', category: 'other' }
    ],
    'Catering': [
      { id: 'punjabi-food', label: 'Punjabi Food', category: 'catering', unit: 'dishes', placeholder: 'How many dishes?' }
    ]
  },

  'gurupurab': {
    'Entertainment': [
      { id: 'kirtan-singers', label: 'Kirtan Singers', category: 'entertainment', unit: 'singers', placeholder: 'How many singers?' }
    ],
    'Catering': [
      { id: 'langar-service', label: 'Langar Service', category: 'catering', unit: 'meals', placeholder: 'How many meals?' }
    ],
    'Coordination': [
      { id: 'nagar-kirtan', label: 'Nagar Kirtan', category: 'coordination' }
    ]
  },

  'makar-sankranti': {
    'Entertainment': [
      { id: 'kite-flying', label: 'Kite Flying', category: 'entertainment' },
      { id: 'kite-supplies', label: 'Kite Supplies', category: 'other', unit: 'kites', placeholder: 'How many kites?' }
    ],
    'Catering': [
      { id: 'til-gud', label: 'Til Gud', category: 'catering', unit: 'servings', placeholder: 'How many servings?' }
    ]
  },

  'easter-celebration': {
    'Entertainment': [
      { id: 'easter-egg-hunt', label: 'Easter Egg Hunt', category: 'entertainment' },
      { id: 'bunny-costume', label: 'Bunny Costume', category: 'entertainment' }
    ],
    'Decoration': [
      { id: 'church-decoration', label: 'Church Decoration', category: 'decoration' }
    ],
    'Catering': [
      { id: 'easter-cake', label: 'Easter Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' }
    ]
  },

  'new-years-party': {
    'Entertainment': [
      { id: 'countdown-coordination', label: 'Countdown Coordination', category: 'entertainment' },
      { id: 'fireworks-display', label: 'Fireworks Display', category: 'entertainment' },
      { id: 'party-music', label: 'Party Music', category: 'music_dj' }
    ],
    'Catering': [
      { id: 'champagne-service', label: 'Champagne Service', category: 'catering', unit: 'bottles', placeholder: 'How many bottles?' },
      { id: 'midnight-snacks', label: 'Midnight Snacks', category: 'catering', unit: 'platters', placeholder: 'How many platters?' }
    ]
  },

  // EDUCATIONAL EVENTS
  'workshop': {
    'Learning Materials': [
      { id: 'workshop-kits', label: 'Workshop Kits', category: 'other', unit: 'kits', placeholder: 'How many kits?' },
      { id: 'handout-materials', label: 'Handout Materials', category: 'other', unit: 'copies', placeholder: 'How many copies?' },
      { id: 'tools-equipment', label: 'Tools & Equipment', category: 'other', unit: 'sets', placeholder: 'How many tool sets?' },
      { id: 'reference-books', label: 'Reference Books', category: 'other', unit: 'books', placeholder: 'How many books?' },
      { id: 'practice-materials', label: 'Practice Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'software-licenses', label: 'Software Licenses', category: 'other', unit: 'licenses', placeholder: 'How many licenses?' },
      { id: 'safety-equipment', label: 'Safety Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'measurement-tools', label: 'Measurement Tools', category: 'other', unit: 'tools', placeholder: 'How many tools?' },
      { id: 'art-supplies', label: 'Art Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'stationery-items', label: 'Stationery Items', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'sample-products', label: 'Sample Products', category: 'other', unit: 'samples', placeholder: 'How many samples?' },
      { id: 'instruction-manuals', label: 'Instruction Manuals', category: 'other', unit: 'manuals', placeholder: 'How many manuals?' }
    ],
    'Technical Setup': [
      { id: 'projector-screen', label: 'Projector & Screen', category: 'other' },
      { id: 'audio-system', label: 'Audio System', category: 'music_dj' },
      { id: 'flipchart-boards', label: 'Flipchart Boards', category: 'other', unit: 'boards', placeholder: 'How many boards?' }
    ],
    'Facilitation': [
      { id: 'expert-facilitators', label: 'Expert Facilitators', category: 'other', unit: 'facilitators', placeholder: 'How many facilitators?' },
      { id: 'assistant-trainers', label: 'Assistant Trainers', category: 'other', unit: 'trainers', placeholder: 'How many trainers?' },
      { id: 'certificate-printing', label: 'Certificate Printing', category: 'other', unit: 'certificates', placeholder: 'How many certificates?' },
      { id: 'industry-experts', label: 'Industry Experts', category: 'other', unit: 'experts', placeholder: 'How many experts?' },
      { id: 'guest-speakers', label: 'Guest Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'skill-assessors', label: 'Skill Assessors', category: 'other', unit: 'assessors', placeholder: 'How many assessors?' },
      { id: 'mentorship-program', label: 'Mentorship Program', category: 'other' },
      { id: 'peer-learning-groups', label: 'Peer Learning Groups', category: 'other', unit: 'groups', placeholder: 'How many groups?' },
      { id: 'feedback-sessions', label: 'Feedback Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' }
    ],
    'Workshop Logistics': [
      { id: 'workspace-setup', label: 'Workspace Setup', category: 'other', unit: 'workspaces', placeholder: 'How many workspaces?' },
      { id: 'group-seating', label: 'Group Seating', category: 'other', unit: 'groups', placeholder: 'How many groups?' },
      { id: 'storage-solutions', label: 'Storage Solutions', category: 'other', unit: 'units', placeholder: 'How many units?' },
      { id: 'cleanup-services', label: 'Cleanup Services', category: 'other' },
      { id: 'material-distribution', label: 'Material Distribution', category: 'coordination' },
      { id: 'progress-tracking', label: 'Progress Tracking', category: 'other' }
    ]
  },

  'science-fair': {
    'Exhibition Setup': [
      { id: 'display-boards', label: 'Display Boards', category: 'other', unit: 'boards', placeholder: 'How many boards?' },
      { id: 'experiment-tables', label: 'Experiment Tables', category: 'other', unit: 'tables', placeholder: 'How many tables?' },
      { id: 'safety-equipment', label: 'Safety Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'power-supply', label: 'Power Supply', category: 'other' }
    ],
    'Judging & Awards': [
      { id: 'expert-judges', label: 'Expert Judges', category: 'other', unit: 'judges', placeholder: 'How many judges?' },
      { id: 'evaluation-sheets', label: 'Evaluation Sheets', category: 'other', unit: 'sheets', placeholder: 'How many sheets?' },
      { id: 'prizes-trophies', label: 'Prizes & Trophies', category: 'other', unit: 'prizes', placeholder: 'How many prizes?' }
    ],
    'Documentation': [
      { id: 'project-photography', label: 'Project Photography', category: 'photography' },
      { id: 'demonstration-recording', label: 'Demonstration Recording', category: 'videography' }
    ]
  },



  'yoga-festival': {
    'Yoga Equipment': [
      { id: 'yoga-mats', label: 'Yoga Mats', category: 'other', unit: 'mats', placeholder: 'How many mats?' },
      { id: 'meditation-cushions', label: 'Meditation Cushions', category: 'other', unit: 'cushions', placeholder: 'How many cushions?' },
      { id: 'yoga-blocks', label: 'Yoga Blocks', category: 'other', unit: 'blocks', placeholder: 'How many blocks?' },
      { id: 'sound-bowls', label: 'Sound Bowls', category: 'other', unit: 'bowls', placeholder: 'How many bowls?' }
    ],
    'Instruction & Guidance': [
      { id: 'yoga-instructors', label: 'Yoga Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'meditation-guides', label: 'Meditation Guides', category: 'other', unit: 'guides', placeholder: 'How many guides?' },
      { id: 'wellness-speakers', label: 'Wellness Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' }
    ],
    'Wellness Services': [
      { id: 'healthy-refreshments', label: 'Healthy Refreshments', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
      { id: 'aromatherapy', label: 'Aromatherapy', category: 'other' },
      { id: 'wellness-products', label: 'Wellness Products', category: 'other', unit: 'products', placeholder: 'How many products?' }
    ]
  },

  // RELIGIOUS EVENTS
  'puja-ceremony': {
    'Religious Services': [
      { id: 'priest-services', label: 'Priest Services', category: 'other' },
      { id: 'ritual-items', label: 'Ritual Items', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'sacred-fire-setup', label: 'Sacred Fire Setup', category: 'other' },
      { id: 'mantra-chanting', label: 'Mantra Chanting', category: 'entertainment' },
      { id: 'puja-materials', label: 'Puja Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'offerings-prasad', label: 'Offerings & Prasad', category: 'catering', unit: 'servings', placeholder: 'How many servings?' }
    ],
    'Decoration': [
      { id: 'altar-decoration', label: 'Altar Decoration', category: 'decoration' },
      { id: 'flower-garlands', label: 'Flower Garlands', category: 'flowers', unit: 'garlands', placeholder: 'How many garlands?' },
      { id: 'religious-banners', label: 'Religious Banners', category: 'decoration', unit: 'banners', placeholder: 'How many banners?' }
    ]
  },

  'kirtan': {
    'Musical Services': [
      { id: 'devotional-singers', label: 'Devotional Singers', category: 'entertainment', unit: 'singers', placeholder: 'How many singers?' },
      { id: 'traditional-instruments', label: 'Traditional Instruments', category: 'music_dj', unit: 'instruments', placeholder: 'How many instruments?' },
      { id: 'harmonium-tabla', label: 'Harmonium & Tabla', category: 'music_dj' },
      { id: 'sound-amplification', label: 'Sound Amplification', category: 'music_dj' }
    ],
    'Religious Setup': [
      { id: 'stage-setup', label: 'Stage Setup', category: 'decoration' },
      { id: 'seating-arrangement', label: 'Seating Arrangement', category: 'other' },
      { id: 'devotional-books', label: 'Devotional Books', category: 'other', unit: 'books', placeholder: 'How many books?' }
    ]
  },

  'meditation-session': {
    'Meditation Equipment': [
      { id: 'meditation-mats', label: 'Meditation Mats', category: 'other', unit: 'mats', placeholder: 'How many mats?' },
      { id: 'cushions-bolsters', label: 'Cushions & Bolsters', category: 'other', unit: 'pieces', placeholder: 'How many pieces?' },
      { id: 'incense-candles', label: 'Incense & Candles', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'sound-bowls', label: 'Sound Bowls', category: 'other', unit: 'bowls', placeholder: 'How many bowls?' },
      { id: 'meditation-music', label: 'Meditation Music', category: 'music_dj' }
    ],
    'Guidance Services': [
      { id: 'meditation-instructor', label: 'Meditation Instructor', category: 'other' },
      { id: 'breathing-techniques', label: 'Breathing Techniques', category: 'other' },
      { id: 'mindfulness-guide', label: 'Mindfulness Guide', category: 'other' }
    ]
  },

  // CULTURAL EVENTS
  'folk-dance-performance': {
    'Performance Setup': [
      { id: 'dance-stage', label: 'Dance Stage', category: 'decoration' },
      { id: 'traditional-costumes', label: 'Traditional Costumes', category: 'other', unit: 'costumes', placeholder: 'How many costumes?' },
      { id: 'folk-musicians', label: 'Folk Musicians', category: 'entertainment', unit: 'musicians', placeholder: 'How many musicians?' },
      { id: 'cultural-props', label: 'Cultural Props', category: 'decoration', unit: 'props', placeholder: 'How many props?' }
    ],
    'Technical Requirements': [
      { id: 'stage-lighting', label: 'Stage Lighting', category: 'decoration' },
      { id: 'sound-system', label: 'Sound System', category: 'music_dj' },
      { id: 'performance-recording', label: 'Performance Recording', category: 'videography' }
    ]
  },

  'classical-music-concert': {
    'Musical Setup': [
      { id: 'classical-instruments', label: 'Classical Instruments', category: 'music_dj', unit: 'instruments', placeholder: 'How many instruments?' },
      { id: 'acoustic-setup', label: 'Acoustic Setup', category: 'music_dj' },
      { id: 'concert-hall-setup', label: 'Concert Hall Setup', category: 'decoration' },
      { id: 'artist-coordination', label: 'Artist Coordination', category: 'coordination' }
    ],
    'Audience Services': [
      { id: 'program-booklets', label: 'Program Booklets', category: 'other', unit: 'booklets', placeholder: 'How many booklets?' },
      { id: 'reserved-seating', label: 'Reserved Seating', category: 'other', unit: 'seats', placeholder: 'How many seats?' },
      { id: 'intermission-refreshments', label: 'Intermission Refreshments', category: 'catering', unit: 'servings', placeholder: 'How many servings?' }
    ]
  },

  'traditional-craft-workshop': {
    'Craft Materials': [
      { id: 'traditional-tools', label: 'Traditional Tools', category: 'other', unit: 'sets', placeholder: 'How many tool sets?' },
      { id: 'raw-materials', label: 'Raw Materials', category: 'other', unit: 'kits', placeholder: 'How many material kits?' },
      { id: 'craft-supplies', label: 'Craft Supplies', category: 'other', unit: 'sets', placeholder: 'How many supply sets?' },
      { id: 'safety-equipment', label: 'Safety Equipment', category: 'other', unit: 'sets', placeholder: 'How many safety sets?' }
    ],
    'Instruction Services': [
      { id: 'master-craftsmen', label: 'Master Craftsmen', category: 'other', unit: 'craftsmen', placeholder: 'How many craftsmen?' },
      { id: 'skill-demonstration', label: 'Skill Demonstration', category: 'other' },
      { id: 'cultural-history', label: 'Cultural History', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' }
    ]
  },

  // ENTERTAINMENT EVENTS
  'dance-performance': {
    'Performance Setup': [
      { id: 'dance-floor', label: 'Dance Floor', category: 'decoration' },
      { id: 'choreography-setup', label: 'Choreography Setup', category: 'other' },
      { id: 'costume-coordination', label: 'Costume Coordination', category: 'other' },
      { id: 'makeup-services', label: 'Makeup Services', category: 'beauty', unit: 'artists', placeholder: 'How many artists?' }
    ],
    'Technical Requirements': [
      { id: 'stage-lighting', label: 'Stage Lighting', category: 'decoration' },
      { id: 'music-system', label: 'Music System', category: 'music_dj' },
      { id: 'performance-recording', label: 'Performance Recording', category: 'videography' }
    ]
  },

  'comedy-show': {
    'Performance Setup': [
      { id: 'comedy-stage', label: 'Comedy Stage', category: 'decoration' },
      { id: 'microphone-setup', label: 'Microphone Setup', category: 'music_dj', unit: 'microphones', placeholder: 'How many microphones?' },
      { id: 'audience-seating', label: 'Audience Seating', category: 'other', unit: 'seats', placeholder: 'How many seats?' },
      { id: 'comedian-coordination', label: 'Comedian Coordination', category: 'coordination' }
    ],
    'Audience Services': [
      { id: 'refreshment-service', label: 'Refreshment Service', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
      { id: 'ticket-management', label: 'Ticket Management', category: 'other' },
      { id: 'show-recording', label: 'Show Recording', category: 'videography' }
    ]
  },

  'magic-show': {
    'Performance Requirements': [
      { id: 'magic-props', label: 'Magic Props', category: 'other', unit: 'props', placeholder: 'How many props?' },
      { id: 'stage-setup', label: 'Stage Setup', category: 'decoration' },
      { id: 'audience-participation', label: 'Audience Participation', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'illusion-equipment', label: 'Illusion Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ],
    'Technical Setup': [
      { id: 'special-lighting', label: 'Special Lighting', category: 'decoration' },
      { id: 'sound-effects', label: 'Sound Effects', category: 'music_dj' },
      { id: 'backdrop-design', label: 'Backdrop Design', category: 'decoration', unit: 'backdrops', placeholder: 'How many backdrops?' }
    ]
  },

  // COMMUNITY EVENTS
  'neighborhood-gathering': {
    'Community Services': [
      { id: 'community-coordination', label: 'Community Coordination', category: 'coordination' },
      { id: 'local-entertainment', label: 'Local Entertainment', category: 'entertainment', unit: 'performers', placeholder: 'How many performers?' },
      { id: 'potluck-coordination', label: 'Potluck Coordination', category: 'catering' },
      { id: 'activity-planning', label: 'Activity Planning', category: 'other', unit: 'activities', placeholder: 'How many activities?' }
    ],
    'Logistics': [
      { id: 'venue-setup', label: 'Venue Setup', category: 'decoration' },
      { id: 'seating-arrangement', label: 'Seating Arrangement', category: 'other' },
      { id: 'cleanup-services', label: 'Cleanup Services', category: 'other' }
    ]
  },

  'community-cleanup': {
    'Cleanup Equipment': [
      { id: 'cleaning-supplies', label: 'Cleaning Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'waste-bags', label: 'Waste Bags', category: 'other', unit: 'bags', placeholder: 'How many bags?' },
      { id: 'safety-gear', label: 'Safety Gear', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'tools-equipment', label: 'Tools & Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ],
    'Coordination Services': [
      { id: 'volunteer-coordination', label: 'Volunteer Coordination', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' },
      { id: 'waste-disposal', label: 'Waste Disposal', category: 'other' },
      { id: 'area-mapping', label: 'Area Mapping', category: 'other' }
    ]
  },

  'fundraising-gala': {
    'Event Services': [
      { id: 'auction-coordination', label: 'Auction Coordination', category: 'other' },
      { id: 'donation-management', label: 'Donation Management', category: 'coordination' },
      { id: 'sponsor-recognition', label: 'Sponsor Recognition', category: 'decoration', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'entertainment-program', label: 'Entertainment Program', category: 'entertainment', unit: 'programs', placeholder: 'How many programs?' }
    ],
    'Formal Setup': [
      { id: 'elegant-decoration', label: 'Elegant Decoration', category: 'decoration' },
      { id: 'formal-catering', label: 'Formal Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'vip-services', label: 'VIP Services', category: 'other' }
    ]
  },

  // HEALTH EVENTS
  'blood-donation-drive': {
    'Medical Services': [
      { id: 'medical-team', label: 'Medical Team', category: 'other', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'blood-collection-equipment', label: 'Blood Collection Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'health-screening', label: 'Health Screening', category: 'other', unit: 'stations', placeholder: 'How many stations?' },
      { id: 'donor-registration', label: 'Donor Registration', category: 'coordination', unit: 'desks', placeholder: 'How many desks?' }
    ],
    'Support Services': [
      { id: 'refreshment-counter', label: 'Refreshment Counter', category: 'catering', unit: 'counters', placeholder: 'How many counters?' },
      { id: 'rest-area', label: 'Rest Area', category: 'other', unit: 'areas', placeholder: 'How many areas?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'mental-health-seminar': {
    'Professional Services': [
      { id: 'mental-health-experts', label: 'Mental Health Experts', category: 'other', unit: 'experts', placeholder: 'How many experts?' },
      { id: 'counseling-sessions', label: 'Counseling Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'support-groups', label: 'Support Groups', category: 'other', unit: 'groups', placeholder: 'How many groups?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ],
    'Educational Setup': [
      { id: 'presentation-materials', label: 'Presentation Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'interactive-sessions', label: 'Interactive Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'resource-distribution', label: 'Resource Distribution', category: 'other' }
    ]
  },

  // SPORTS EVENTS
  'cycling-event': {
    'Race Management': [
      { id: 'route-marking', label: 'Route Marking', category: 'other' },
      { id: 'safety-marshals', label: 'Safety Marshals', category: 'other', unit: 'marshals', placeholder: 'How many marshals?' },
      { id: 'timing-system', label: 'Timing System', category: 'other' },
      { id: 'bike-maintenance', label: 'Bike Maintenance', category: 'other', unit: 'stations', placeholder: 'How many stations?' }
    ],
    'Support Services': [
      { id: 'hydration-stations', label: 'Hydration Stations', category: 'catering', unit: 'stations', placeholder: 'How many stations?' },
      { id: 'medical-support', label: 'Medical Support', category: 'other', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'participant-kits', label: 'Participant Kits', category: 'other', unit: 'kits', placeholder: 'How many kits?' }
    ]
  },

  'obstacle-course-race': {
    'Course Setup': [
      { id: 'obstacle-equipment', label: 'Obstacle Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'safety-equipment', label: 'Safety Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'course-design', label: 'Course Design', category: 'other' },
      { id: 'timing-system', label: 'Timing System', category: 'other' }
    ],
    'Safety & Support': [
      { id: 'medical-team', label: 'Medical Team', category: 'other', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'safety-briefing', label: 'Safety Briefing', category: 'other' },
      { id: 'completion-certificates', label: 'Completion Certificates', category: 'other', unit: 'certificates', placeholder: 'How many certificates?' }
    ]
  },

  // POLITICAL EVENTS
  'political-rally': {
    'Event Management': [
      { id: 'crowd-management', label: 'Crowd Management', category: 'coordination', unit: 'personnel', placeholder: 'How many personnel?' },
      { id: 'security-coordination', label: 'Security Coordination', category: 'coordination' },
      { id: 'permit-management', label: 'Permit Management', category: 'coordination' },
      { id: 'volunteer-coordination', label: 'Volunteer Coordination', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' }
    ],
    'Technical Setup': [
      { id: 'public-address-system', label: 'Public Address System', category: 'music_dj' },
      { id: 'stage-setup', label: 'Stage Setup', category: 'decoration' },
      { id: 'microphone-system', label: 'Microphone System', category: 'music_dj', unit: 'microphones', placeholder: 'How many microphones?' },
      { id: 'sound-amplification', label: 'Sound Amplification', category: 'music_dj' },
      { id: 'led-screens', label: 'LED Screens', category: 'other', unit: 'screens', placeholder: 'How many screens?' },
      { id: 'live-streaming', label: 'Live Streaming', category: 'videography' }
    ],
    'Campaign Materials': [
      { id: 'banners-flags', label: 'Banners & Flags', category: 'decoration', unit: 'pieces', placeholder: 'How many pieces?' },
      { id: 'promotional-materials', label: 'Promotional Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'campaign-merchandise', label: 'Campaign Merchandise', category: 'other', unit: 'items', placeholder: 'How many items?' },
      { id: 'voter-registration', label: 'Voter Registration', category: 'coordination', unit: 'booths', placeholder: 'How many booths?' }
    ],
    'Documentation': [
      { id: 'event-photography', label: 'Event Photography', category: 'photography' },
      { id: 'rally-videography', label: 'Rally Videography', category: 'videography' },
      { id: 'media-coverage', label: 'Media Coverage', category: 'other' }
    ]
  },

  'election-campaign': {
    'Campaign Operations': [
      { id: 'campaign-management', label: 'Campaign Management', category: 'coordination' },
      { id: 'door-to-door-canvassing', label: 'Door-to-Door Canvassing', category: 'coordination', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'phone-banking', label: 'Phone Banking', category: 'coordination', unit: 'stations', placeholder: 'How many stations?' },
      { id: 'volunteer-recruitment', label: 'Volunteer Recruitment', category: 'coordination' }
    ],
    'Marketing & Outreach': [
      { id: 'campaign-advertising', label: 'Campaign Advertising', category: 'other' },
      { id: 'social-media-management', label: 'Social Media Management', category: 'other' },
      { id: 'print-materials', label: 'Print Materials', category: 'other', unit: 'copies', placeholder: 'How many copies?' },
      { id: 'billboard-advertising', label: 'Billboard Advertising', category: 'other', unit: 'billboards', placeholder: 'How many billboards?' }
    ],
    'Events & Rallies': [
      { id: 'town-hall-meetings', label: 'Town Hall Meetings', category: 'coordination', unit: 'meetings', placeholder: 'How many meetings?' },
      { id: 'campaign-rallies', label: 'Campaign Rallies', category: 'coordination', unit: 'rallies', placeholder: 'How many rallies?' },
      { id: 'debate-preparation', label: 'Debate Preparation', category: 'coordination' },
      { id: 'fundraising-events', label: 'Fundraising Events', category: 'coordination', unit: 'events', placeholder: 'How many events?' }
    ]
  },

  'political-conference': {
    'Conference Management': [
      { id: 'delegate-coordination', label: 'Delegate Coordination', category: 'coordination' },
      { id: 'speaker-management', label: 'Speaker Management', category: 'coordination', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'session-planning', label: 'Session Planning', category: 'coordination', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'protocol-management', label: 'Protocol Management', category: 'coordination' }
    ],
    'Technical Infrastructure': [
      { id: 'conference-av-setup', label: 'Conference AV Setup', category: 'other' },
      { id: 'simultaneous-translation', label: 'Simultaneous Translation', category: 'other', unit: 'booths', placeholder: 'How many booths?' },
      { id: 'voting-systems', label: 'Voting Systems', category: 'other', unit: 'devices', placeholder: 'How many devices?' },
      { id: 'live-broadcast', label: 'Live Broadcast', category: 'videography' }
    ],
    'Hospitality': [
      { id: 'vip-services', label: 'VIP Services', category: 'coordination' },
      { id: 'delegate-catering', label: 'Delegate Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'accommodation-coordination', label: 'Accommodation Coordination', category: 'coordination' }
    ]
  },





  // MISSING CORPORATE EVENTS
  'award-ceremony': {
    'Event Management': [
      { id: 'stage-design', label: 'Stage Design', category: 'decoration' },
      { id: 'award-engraving', label: 'Award Engraving', category: 'other', unit: 'awards', placeholder: 'How many awards?' },
      { id: 'red-carpet-setup', label: 'Red Carpet Setup', category: 'decoration' },
      { id: 'vip-coordination', label: 'VIP Coordination', category: 'coordination' }
    ],
    'Entertainment': [
      { id: 'award-show-host', label: 'Award Show Host', category: 'entertainment' },
      { id: 'live-performance', label: 'Live Performance', category: 'entertainment', unit: 'acts', placeholder: 'How many acts?' }
    ],
    'Documentation': [
      { id: 'ceremony-photography', label: 'Ceremony Photography', category: 'photography' },
      { id: 'award-videography', label: 'Award Videography', category: 'videography' }
    ]
  },

  'trade-show': {
    'Exhibition Setup': [
      { id: 'booth-design', label: 'Booth Design', category: 'decoration', unit: 'booths', placeholder: 'How many booths?' },
      { id: 'display-systems', label: 'Display Systems', category: 'other', unit: 'displays', placeholder: 'How many displays?' },
      { 
        id: 'promotional-materials', 
        label: 'Promotional Materials', 
        category: 'other', 
        unit: 'sets', 
        placeholder: 'How many sets?',
        questions: [
          { id: 'material-types', label: 'Types needed?', type: 'dropdown', options: ['Brochures only', 'Flyers only', 'Business cards only', 'Complete set (Brochures, Flyers, Business cards)', 'Custom materials'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 10000 },
          { id: 'design-service', label: 'Design service required?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Lead Generation': [
      { 
        id: 'lead-capture-system', 
        label: 'Lead Capture System', 
        category: 'other',
        questions: [
          { id: 'capture-method', label: 'Digital or manual?', type: 'dropdown', options: ['Digital only', 'Manual only', 'Both digital and manual'] },
          { id: 'crm-integration', label: 'Integration with CRM?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'device-count', label: 'Number of devices?', type: 'number', min: 1, max: 20 }
        ]
      },
      { 
        id: 'visitor-registration', 
        label: 'Visitor Registration', 
        category: 'coordination',
        questions: [
          { id: 'expected-visitors', label: 'Expected visitors?', type: 'dropdown', options: ['Under 100', '100-500', '500-1000', '1000-5000', '5000+'] },
          { id: 'badge-printing', label: 'Badge printing?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'data-collection', label: 'Data collection requirements?', type: 'dropdown', options: ['Basic info only', 'Detailed survey', 'Contact preferences', 'Complete profile'] }
        ]
      }
    ]
  },

  'networking-mixer': {
    'Networking Services': [
      { 
        id: 'icebreaker-activities', 
        label: 'Icebreaker Activities', 
        category: 'entertainment', 
        unit: 'activities', 
        placeholder: 'How many activities?',
        questions: [
          { id: 'group-size', label: 'Group size?', type: 'dropdown', options: ['Small (10-25)', 'Medium (25-75)', 'Large (75-150)', 'Extra Large (150+)'] },
          { id: 'activity-preference', label: 'Activity type preference?', type: 'dropdown', options: ['Conversation starters', 'Interactive games', 'Professional networking', 'Creative activities', 'Mixed activities'] },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['15 minutes', '30 minutes', '45 minutes', '1 hour'] }
        ]
      },
      { id: 'name-badge-printing', label: 'Name Badge Printing', category: 'other', unit: 'badges', placeholder: 'How many badges?' },
      { 
        id: 'networking-facilitation', 
        label: 'Networking Facilitation', 
        category: 'coordination',
        questions: [
          { id: 'format-type', label: 'Structured or open format?', type: 'dropdown', options: ['Structured networking', 'Open format', 'Mixed approach'] },
          { id: 'industry-specific', label: 'Industry-specific?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Catering': [
      { id: 'cocktail-reception', label: 'Cocktail Reception', category: 'catering' },
      { 
        id: 'appetizer-service', 
        label: 'Appetizer Service', 
        category: 'catering', 
        unit: 'platters', 
        placeholder: 'How many platters?',
        questions: [
          { id: 'guest-count', label: 'Number of guests?', type: 'number', min: 10, max: 500 },
          { id: 'cuisine-preference', label: 'Cuisine preference?', type: 'dropdown', options: ['International', 'Indian', 'Continental', 'Fusion', 'Healthy options'] },
          { id: 'dietary-restrictions', label: 'Dietary restrictions?', type: 'dropdown', options: ['None', 'Vegetarian options', 'Vegan options', 'Gluten-free', 'Multiple dietary needs'] }
        ]
      }
    ]
  },

  'leadership-summit': {
    'Speaker Management': [
      { 
        id: 'keynote-speakers', 
        label: 'Keynote Speakers', 
        category: 'other', 
        unit: 'speakers', 
        placeholder: 'How many speakers?',
        questions: [
          { id: 'speaker-count', label: 'Number of speakers?', type: 'number', min: 1, max: 20 },
          { id: 'topics', label: 'Topics?', type: 'dropdown', options: ['Leadership development', 'Business strategy', 'Innovation', 'Team management', 'Multiple topics'] },
          { id: 'technical-needs', label: 'Technical needs?', type: 'dropdown', options: ['Basic (mic + screen)', 'Standard AV setup', 'Advanced production', 'Custom requirements'] }
        ]
      },
      { 
        id: 'executive-coaching', 
        label: 'Executive Coaching', 
        category: 'other', 
        unit: 'sessions', 
        placeholder: 'How many sessions?',
        questions: [
          { id: 'participant-count', label: 'Number of participants?', type: 'number', min: 1, max: 100 },
          { id: 'session-duration', label: 'Session duration?', type: 'dropdown', options: ['1 hour', '2 hours', '3 hours', 'Half day', 'Full day'] },
          { id: 'focus-areas', label: 'Focus areas?', type: 'dropdown', options: ['Leadership skills', 'Communication', 'Strategic thinking', 'Team building', 'Custom focus'] }
        ]
      },
      { 
        id: 'panel-discussions', 
        label: 'Panel Discussions', 
        category: 'other', 
        unit: 'panels', 
        placeholder: 'How many panels?',
        questions: [
          { id: 'panel-count', label: 'Number of panels?', type: 'number', min: 1, max: 10 },
          { id: 'panelists-per-session', label: 'Panelists per session?', type: 'dropdown', options: ['2-3 panelists', '4-5 panelists', '6+ panelists'] },
          { id: 'moderator-needed', label: 'Moderator needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Documentation': [
      { 
        id: 'session-recording', 
        label: 'Session Recording', 
        category: 'videography',
        questions: [
          { id: 'recording-scope', label: 'All sessions or selected?', type: 'dropdown', options: ['All sessions', 'Keynotes only', 'Selected sessions', 'Main sessions only'] },
          { id: 'video-quality', label: 'Video quality?', type: 'dropdown', options: ['Standard (720p)', 'HD (1080p)', '4K', 'Professional broadcast'] },
          { id: 'live-streaming', label: 'Live streaming?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'note-taking-service', 
        label: 'Note-taking Service', 
        category: 'other',
        questions: [
          { id: 'transcription-needed', label: 'Transcription needed?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'format-preference', label: 'Format preference?', type: 'dropdown', options: ['Digital notes', 'Printed summary', 'Both digital and printed', 'Real-time sharing'] }
        ]
      }
    ]
  },



  'training-workshop': {
    'Training Materials': [
      { 
        id: 'training-manuals', 
        label: 'Training Manuals', 
        category: 'other', 
        unit: 'copies', 
        placeholder: 'How many copies?',
        questions: [
          { id: 'copy-count', label: 'Number of copies?', type: 'number', min: 1, max: 1000 },
          { id: 'page-count', label: 'Page count?', type: 'dropdown', options: ['Under 20 pages', '20-50 pages', '50-100 pages', '100+ pages'] },
          { id: 'binding-type', label: 'Binding type?', type: 'dropdown', options: ['Stapled', 'Spiral bound', 'Perfect bound', 'Ring binder'] },
          { id: 'digital-version', label: 'Digital version needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'interactive-tools', 
        label: 'Interactive Tools', 
        category: 'other', 
        unit: 'sets', 
        placeholder: 'How many sets?',
        questions: [
          { id: 'tool-type', label: 'Type of tools?', type: 'dropdown', options: ['Physical tools/equipment', 'Software tools', 'Educational games', 'Mixed tools', 'Custom tools'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 100 },
          { id: 'software-requirements', label: 'Software requirements?', type: 'dropdown', options: ['None', 'Basic software', 'Specialized software', 'Custom software'] }
        ]
      },
      { 
        id: 'assessment-materials', 
        label: 'Assessment Materials', 
        category: 'other', 
        unit: 'sets', 
        placeholder: 'How many sets?',
        questions: [
          { id: 'test-format', label: 'Test format?', type: 'dropdown', options: ['Written test', 'Practical assessment', 'Online test', 'Mixed assessment'] },
          { id: 'certificates-needed', label: 'Certificates needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Facilitation': [
      { 
        id: 'expert-trainers', 
        label: 'Expert Trainers', 
        category: 'other', 
        unit: 'trainers', 
        placeholder: 'How many trainers?',
        questions: [
          { id: 'expertise-required', label: 'Subject expertise required?', type: 'dropdown', options: ['Technical skills', 'Soft skills', 'Industry specific', 'Leadership training', 'Custom expertise'] },
          { id: 'trainer-count', label: 'Number of trainers?', type: 'number', min: 1, max: 20 },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['Half day', 'Full day', '2 days', '3+ days'] }
        ]
      },
      { 
        id: 'breakout-sessions', 
        label: 'Breakout Sessions', 
        category: 'other', 
        unit: 'sessions', 
        placeholder: 'How many sessions?',
        questions: [
          { id: 'room-count', label: 'Number of rooms needed?', type: 'number', min: 1, max: 20 },
          { id: 'capacity-per-room', label: 'Capacity per room?', type: 'dropdown', options: ['5-10 people', '10-20 people', '20-30 people', '30+ people'] },
          { id: 'equipment-per-room', label: 'Equipment per room?', type: 'dropdown', options: ['Basic (flipchart)', 'Standard (projector + screen)', 'Advanced (full AV)', 'Custom setup'] }
        ]
      }
    ]
  },

  'hackathon': {
    'Technical Infrastructure': [
      { 
        id: 'development-environment', 
        label: 'Development Environment', 
        category: 'other',
        questions: [
          { id: 'preferred-ide', label: 'Preferred IDE/tools?', type: 'dropdown', options: ['VS Code', 'IntelliJ', 'Eclipse', 'Multiple IDEs', 'Participant choice'] },
          { id: 'operating-system', label: 'Operating system?', type: 'dropdown', options: ['Windows', 'macOS', 'Linux', 'Multiple OS support'] },
          { id: 'pre-installed-software', label: 'Pre-installed software?', type: 'dropdown', options: ['Basic development tools', 'Full development stack', 'Custom software list', 'Participant installs'] }
        ]
      },
      { 
        id: 'api-access', 
        label: 'API Access', 
        category: 'other', 
        unit: 'apis', 
        placeholder: 'How many APIs?',
        questions: [
          { id: 'apis-needed', label: 'Which APIs needed?', type: 'dropdown', options: ['Social media APIs', 'Payment APIs', 'Cloud services', 'Custom APIs', 'Multiple API types'] },
          { id: 'access-level', label: 'Access level?', type: 'dropdown', options: ['Read only', 'Read/Write', 'Full access', 'Custom permissions'] },
          { id: 'documentation-provided', label: 'Documentation provided?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'cloud-resources', 
        label: 'Cloud Resources', 
        category: 'other',
        questions: [
          { id: 'cloud-platform', label: 'Cloud platform?', type: 'dropdown', options: ['AWS', 'Azure', 'Google Cloud Platform', 'Multiple platforms', 'No preference'] },
          { id: 'computing-requirements', label: 'Computing requirements?', type: 'dropdown', options: ['Basic compute', 'High performance', 'GPU access', 'Custom requirements'] },
          { id: 'storage-needs', label: 'Storage needs?', type: 'dropdown', options: ['Basic storage', 'High capacity', 'Database access', 'Custom storage'] }
        ]
      }
    ],
    'Mentorship': [
      { 
        id: 'technical-mentors', 
        label: 'Technical Mentors', 
        category: 'other', 
        unit: 'mentors', 
        placeholder: 'How many mentors?',
        questions: [
          { id: 'expertise-areas', label: 'Expertise areas?', type: 'dropdown', options: ['Frontend development', 'Backend development', 'Mobile development', 'AI/ML', 'Multiple areas'] },
          { id: 'mentor-count', label: 'Number of mentors?', type: 'number', min: 1, max: 50 },
          { id: 'availability-schedule', label: 'Availability schedule?', type: 'dropdown', options: ['Full time', 'Part time', 'On-demand', 'Scheduled sessions'] }
        ]
      },
      { 
        id: 'industry-judges', 
        label: 'Industry Judges', 
        category: 'other', 
        unit: 'judges', 
        placeholder: 'How many judges?',
        questions: [
          { id: 'judge-count', label: 'Number of judges?', type: 'number', min: 1, max: 20 },
          { id: 'industry-background', label: 'Industry background?', type: 'dropdown', options: ['Tech industry', 'Startup ecosystem', 'Corporate', 'Academic', 'Mixed backgrounds'] },
          { id: 'judging-criteria', label: 'Judging criteria?', type: 'dropdown', options: ['Innovation', 'Technical excellence', 'Business viability', 'User experience', 'Comprehensive evaluation'] }
        ]
      }
    ],
    'Prizes & Recognition': [
      { 
        id: 'prize-distribution', 
        label: 'Prize Distribution', 
        category: 'other',
        questions: [
          { id: 'prize-count', label: 'Number of prizes?', type: 'dropdown', options: ['Winner only', 'Top 3', 'Top 5', 'Multiple categories', 'Participation prizes'] },
          { id: 'prize-categories', label: 'Prize categories?', type: 'dropdown', options: ['Overall winner', 'Best innovation', 'Best design', 'People\'s choice', 'Multiple categories'] },
          { id: 'ceremony-format', label: 'Award ceremony format?', type: 'dropdown', options: ['Simple announcement', 'Formal ceremony', 'Presentation + demo', 'Full event'] }
        ]
      },
      { id: 'winner-showcase', label: 'Winner Showcase', category: 'other' }
    ]
  },



  'investor-meetup': {
    'Pitch Preparation': [
      { 
        id: 'pitch-deck-design', 
        label: 'Pitch Deck Design', 
        category: 'other', 
        unit: 'decks', 
        placeholder: 'How many decks?',
        questions: [
          { id: 'slide-count', label: 'Number of slides?', type: 'dropdown', options: ['10-15 slides', '15-20 slides', '20-25 slides', '25+ slides'] },
          { id: 'content-creation', label: 'Content provided or created?', type: 'dropdown', options: ['Content provided', 'Content creation needed', 'Partial content provided', 'Complete creation'] },
          { id: 'design-style', label: 'Design style preference?', type: 'dropdown', options: ['Professional/Corporate', 'Modern/Creative', 'Minimalist', 'Industry-specific', 'Custom style'] }
        ]
      },
      { 
        id: 'presentation-coaching', 
        label: 'Presentation Coaching', 
        category: 'other', 
        unit: 'sessions', 
        placeholder: 'How many sessions?',
        questions: [
          { id: 'session-count', label: 'Number of sessions?', type: 'number', min: 1, max: 20 },
          { id: 'presenter-count', label: 'Number of presenters?', type: 'number', min: 1, max: 10 },
          { id: 'focus-areas', label: 'Focus areas?', type: 'dropdown', options: ['Presentation skills', 'Q&A handling', 'Pitch content', 'Confidence building', 'Complete coaching'] }
        ]
      }
    ],
    'Investor Relations': [
      { 
        id: 'investor-coordination', 
        label: 'Investor Coordination', 
        category: 'coordination',
        questions: [
          { id: 'investor-count', label: 'Number of investors?', type: 'number', min: 1, max: 100 },
          { id: 'meeting-format', label: 'Meeting format?', type: 'dropdown', options: ['1-on-1 meetings', 'Group presentations', 'Panel format', 'Mixed format'] },
          { id: 'schedule-preferences', label: 'Schedule preferences?', type: 'dropdown', options: ['Flexible timing', 'Structured schedule', 'Back-to-back meetings', 'Networking breaks'] }
        ]
      },
      { 
        id: 'due-diligence-support', 
        label: 'Due Diligence Support', 
        category: 'other',
        questions: [
          { id: 'document-preparation', label: 'Document preparation?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'data-room-setup', label: 'Data room setup?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ]
  },

  'career-expo': {
    'Recruitment Services': [
      { 
        id: 'recruiter-coordination', 
        label: 'Recruiter Coordination', 
        category: 'coordination',
        questions: [
          { id: 'company-count', label: 'Number of companies?', type: 'number', min: 1, max: 200 },
          { id: 'booth-allocation', label: 'Booth allocation?', type: 'dropdown', options: ['Standard booths', 'Premium booths', 'Mixed booth sizes', 'Custom allocation'] },
          { id: 'equipment-per-booth', label: 'Equipment per booth?', type: 'dropdown', options: ['Basic (table + chairs)', 'Standard (table, chairs, power)', 'Premium (full setup)', 'Custom requirements'] }
        ]
      },
      { 
        id: 'resume-review-stations', 
        label: 'Resume Review Stations', 
        category: 'other', 
        unit: 'stations', 
        placeholder: 'How many stations?',
        questions: [
          { id: 'station-count', label: 'Number of stations?', type: 'number', min: 1, max: 20 },
          { id: 'reviewers-needed', label: 'Reviewers needed?', type: 'number', min: 1, max: 50 },
          { id: 'appointment-system', label: 'Appointment system?', type: 'dropdown', options: ['Walk-in only', 'Appointment only', 'Both walk-in and appointment'] }
        ]
      },
      { 
        id: 'interview-booths', 
        label: 'Interview Booths', 
        category: 'other', 
        unit: 'booths', 
        placeholder: 'How many booths?',
        questions: [
          { id: 'booth-count', label: 'Number of booths?', type: 'number', min: 1, max: 50 },
          { id: 'privacy-requirements', label: 'Privacy requirements?', type: 'dropdown', options: ['Open area', 'Semi-private', 'Fully private', 'Soundproof'] },
          { id: 'recording-equipment', label: 'Recording equipment?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Career Services': [
      { 
        id: 'career-counseling', 
        label: 'Career Counseling', 
        category: 'other', 
        unit: 'counselors', 
        placeholder: 'How many counselors?',
        questions: [
          { id: 'counselor-count', label: 'Number of counselors?', type: 'number', min: 1, max: 20 },
          { id: 'specializations', label: 'Specializations?', type: 'dropdown', options: ['General career guidance', 'Industry-specific', 'Entry-level focus', 'Executive coaching', 'Multiple specializations'] },
          { id: 'session-duration', label: 'Session duration?', type: 'dropdown', options: ['15 minutes', '30 minutes', '45 minutes', '1 hour'] }
        ]
      },
      { 
        id: 'skill-assessment', 
        label: 'Skill Assessment', 
        category: 'other', 
        unit: 'assessments', 
        placeholder: 'How many assessments?',
        questions: [
          { id: 'assessment-type', label: 'Assessment type?', type: 'dropdown', options: ['Technical skills', 'Soft skills', 'Aptitude test', 'Personality assessment', 'Comprehensive assessment'] },
          { id: 'computer-stations', label: 'Computer stations needed?', type: 'number', min: 1, max: 100 },
          { id: 'participant-count', label: 'Number of participants?', type: 'dropdown', options: ['Under 50', '50-100', '100-300', '300-500', '500+'] }
        ]
      }
    ]
  },

  'business-networking-event': {
    'Networking Activities': [
      { 
        id: 'speed-networking', 
        label: 'Speed Networking', 
        category: 'entertainment', 
        unit: 'rounds', 
        placeholder: 'How many rounds?',
        questions: [
          { id: 'participant-count', label: 'Number of participants?', type: 'dropdown', options: ['20-40', '40-80', '80-120', '120+'] },
          { id: 'interaction-time', label: 'Time per interaction?', type: 'dropdown', options: ['2 minutes', '3 minutes', '5 minutes', '10 minutes'] },
          { id: 'matching-system', label: 'Matching system?', type: 'dropdown', options: ['Random matching', 'Industry-based', 'Interest-based', 'AI-powered matching'] }
        ]
      },
      { 
        id: 'business-card-exchange', 
        label: 'Business Card Exchange', 
        category: 'coordination',
        questions: [
          { id: 'exchange-method', label: 'Digital or physical?', type: 'dropdown', options: ['Physical cards only', 'Digital only', 'Both physical and digital'] },
          { id: 'scanning-app', label: 'Scanning app needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'industry-mixers', 
        label: 'Industry Mixers', 
        category: 'entertainment', 
        unit: 'mixers', 
        placeholder: 'How many mixers?',
        questions: [
          { id: 'industry-focus', label: 'Industry focus?', type: 'dropdown', options: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Mixed industries'] },
          { id: 'format-preference', label: 'Format preference?', type: 'dropdown', options: ['Structured sessions', 'Open networking', 'Panel + networking', 'Workshop + networking'] }
        ]
      }
    ]
  },



  'industry-roundtable': {
    'Discussion Management': [
      { 
        id: 'topic-moderation', 
        label: 'Topic Moderation', 
        category: 'coordination',
        questions: [
          { id: 'discussion-topics', label: 'Discussion topics?', type: 'dropdown', options: ['Industry trends', 'Market challenges', 'Innovation', 'Regulatory changes', 'Multiple topics'] },
          { id: 'moderator-expertise', label: 'Moderator expertise?', type: 'dropdown', options: ['Industry expert', 'Professional moderator', 'Media personality', 'Academic expert'] },
          { id: 'duration-per-topic', label: 'Duration per topic?', type: 'dropdown', options: ['30 minutes', '45 minutes', '1 hour', '90 minutes'] }
        ]
      },
      { 
        id: 'expert-panelists', 
        label: 'Expert Panelists', 
        category: 'other', 
        unit: 'panelists', 
        placeholder: 'How many panelists?',
        questions: [
          { id: 'panelist-count', label: 'Number of experts?', type: 'number', min: 2, max: 15 },
          { id: 'subject-areas', label: 'Subject areas?', type: 'dropdown', options: ['Technical expertise', 'Business leadership', 'Academic research', 'Policy/Regulatory', 'Mixed expertise'] },
          { id: 'panel-format', label: 'Panel format?', type: 'dropdown', options: ['Single panel', 'Multiple panels', 'Rotating panels', 'Breakout discussions'] }
        ]
      },
      { 
        id: 'discussion-recording', 
        label: 'Discussion Recording', 
        category: 'videography',
        questions: [
          { id: 'recording-format', label: 'Audio or video?', type: 'dropdown', options: ['Audio only', 'Video', 'Both audio and video'] },
          { id: 'transcription-needed', label: 'Transcription needed?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ]
  },

  'press-conference': {
    'Media Management': [
      { 
        id: 'media-coordination', 
        label: 'Media Coordination', 
        category: 'coordination',
        questions: [
          { id: 'media-outlet-count', label: 'Number of media outlets?', type: 'dropdown', options: ['Under 10', '10-25', '25-50', '50+'] },
          { id: 'media-list-provided', label: 'Media list provided?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'rsvp-tracking', label: 'RSVP tracking?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'press-kit-preparation', 
        label: 'Press Kit Preparation', 
        category: 'other', 
        unit: 'kits', 
        placeholder: 'How many kits?',
        questions: [
          { id: 'kit-format', label: 'Digital or physical?', type: 'dropdown', options: ['Digital only', 'Physical only', 'Both digital and physical'] },
          { id: 'content-items', label: 'Content items?', type: 'dropdown', options: ['Press release only', 'Press release + Photos', 'Complete kit (Release, Photos, Backgrounder)', 'Custom content'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 1, max: 200 }
        ]
      },
      { 
        id: 'live-broadcast-setup', 
        label: 'Live Broadcast Setup', 
        category: 'videography',
        questions: [
          { id: 'broadcast-platforms', label: 'Which platforms?', type: 'dropdown', options: ['TV broadcast', 'Online streaming', 'Social media live', 'Multiple platforms'] },
          { id: 'camera-setup', label: 'Camera setup?', type: 'dropdown', options: ['Single camera', 'Multi-camera', 'Professional broadcast setup'] },
          { id: 'streaming-quality', label: 'Streaming quality?', type: 'dropdown', options: ['Standard (720p)', 'HD (1080p)', 'Broadcast quality', 'Professional grade'] }
        ]
      }
    ]
  },



  // MISSING SOCIAL EVENTS
  'anniversary': {
    'Celebration Services': [
      { id: 'anniversary-photography', label: 'Anniversary Photography', category: 'photography' },
      { id: 'memory-slideshow', label: 'Memory Slideshow', category: 'videography' },
      { id: 'anniversary-cake', label: 'Anniversary Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' }
    ],
    'Entertainment': [
      { id: 'live-music', label: 'Live Music', category: 'entertainment' },
      { id: 'dance-performance', label: 'Dance Performance', category: 'entertainment', unit: 'performances', placeholder: 'How many performances?' }
    ]
  },

  'baby-shower': {
    'Baby Shower Services': [
      { id: 'baby-shower-games', label: 'Baby Shower Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'gift-registry-coordination', label: 'Gift Registry Coordination', category: 'coordination' },
      { id: 'baby-themed-decoration', label: 'Baby Themed Decoration', category: 'decoration' }
    ],
    'Catering': [
      { id: 'baby-shower-cake', label: 'Baby Shower Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' },
      { id: 'themed-refreshments', label: 'Themed Refreshments', category: 'catering', unit: 'platters', placeholder: 'How many platters?' }
    ]
  },

  'housewarming': {
    'Home Celebration': [
      { id: 'home-blessing-ceremony', label: 'Home Blessing Ceremony', category: 'other' },
      { id: 'house-tour-coordination', label: 'House Tour Coordination', category: 'coordination' },
      { id: 'housewarming-gifts', label: 'Housewarming Gifts', category: 'other', unit: 'gifts', placeholder: 'How many gifts?' }
    ]
  },

  'bachelor-party': {
    'Party Activities': [
      { id: 'party-games', label: 'Party Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'transportation-service', label: 'Transportation Service', category: 'transportation' },
      { id: 'party-favors', label: 'Party Favors', category: 'other', unit: 'favors', placeholder: 'How many favors?' }
    ]
  },

  'retirement': {
    'Retirement Celebration': [
      { id: 'career-tribute-video', label: 'Career Tribute Video', category: 'videography' },
      { id: 'retirement-speech', label: 'Retirement Speech', category: 'other' },
      { id: 'retirement-gifts', label: 'Retirement Gifts', category: 'other', unit: 'gifts', placeholder: 'How many gifts?' }
    ]
  },

  'farewell': {
    'Farewell Services': [
      { id: 'farewell-speech', label: 'Farewell Speech', category: 'other' },
      { id: 'memory-book', label: 'Memory Book', category: 'other', unit: 'books', placeholder: 'How many books?' },
      { id: 'farewell-gifts', label: 'Farewell Gifts', category: 'other', unit: 'gifts', placeholder: 'How many gifts?' }
    ]
  },

  'graduation-party': {
    'Graduation Celebration': [
      { id: 'graduation-photography', label: 'Graduation Photography', category: 'photography' },
      { id: 'graduation-cake', label: 'Graduation Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' },
      { id: 'achievement-display', label: 'Achievement Display', category: 'decoration' }
    ]
  },

  'reunion-party': {
    'Reunion Services': [
      { id: 'reunion-coordination', label: 'Reunion Coordination', category: 'coordination' },
      { id: 'memory-lane-display', label: 'Memory Lane Display', category: 'decoration' },
      { id: 'reunion-photography', label: 'Reunion Photography', category: 'photography' }
    ]
  },

  'kitty-party': {
    'Party Games': [
      { id: 'kitty-games', label: 'Kitty Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'prize-coordination', label: 'Prize Coordination', category: 'coordination' },
      { id: 'theme-decoration', label: 'Theme Decoration', category: 'decoration' }
    ]
  },

  'pre-wedding-shoot': {
    'Pre-Wedding Services': [
      { id: 'pre-wedding-photography', label: 'Pre-Wedding Photography', category: 'photography' },
      { id: 'couple-games', label: 'Couple Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'pre-wedding-decoration', label: 'Pre-Wedding Decoration', category: 'decoration' }
    ]
  },

  'bridal-shower': {
    'Bridal Services': [
      { id: 'bridal-games', label: 'Bridal Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'bridal-gift-coordination', label: 'Bridal Gift Coordination', category: 'coordination' },
      { id: 'bridal-decoration', label: 'Bridal Decoration', category: 'decoration' }
    ]
  },

  'gender-reveal-party': {
    'Reveal Services': [
      { id: 'gender-reveal-setup', label: 'Gender Reveal Setup', category: 'entertainment' },
      { id: 'smoke-effects', label: 'Smoke Effects', category: 'entertainment' },
      { id: 'reveal-photography', label: 'Reveal Photography', category: 'photography' }
    ]
  },

  'milestone-birthday': {
    'Milestone Celebration': [
      { id: 'milestone-photography', label: 'Milestone Photography', category: 'photography' },
      { id: 'milestone-cake', label: 'Milestone Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' },
      { id: 'milestone-decoration', label: 'Milestone Decoration', category: 'decoration' }
    ]
  },

  'family-reunion': {
    'Family Services': [
      { id: 'family-photography', label: 'Family Photography', category: 'photography' },
      { id: 'family-tree-display', label: 'Family Tree Display', category: 'decoration' },
      { id: 'reunion-activities', label: 'Reunion Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' }
    ]
  },

  'friendship-day-event': {
    'Friendship Activities': [
      { id: 'friendship-games', label: 'Friendship Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'friendship-photography', label: 'Friendship Photography', category: 'photography' },
      { id: 'friendship-gifts', label: 'Friendship Gifts', category: 'other', unit: 'gifts', placeholder: 'How many gifts?' }
    ]
  },

  'valentines-day-celebration': {
    'Romantic Services': [
      { id: 'romantic-decoration', label: 'Romantic Decoration', category: 'decoration' },
      { id: 'romantic-music', label: 'Romantic Music', category: 'entertainment' },
      { id: 'couples-photography', label: 'Couples Photography', category: 'photography' }
    ]
  },

  'adoption-celebration': {
    'Adoption Services': [
      { id: 'adoption-ceremony', label: 'Adoption Ceremony', category: 'other' },
      { id: 'family-photography', label: 'Family Photography', category: 'photography' },
      { id: 'celebration-cake', label: 'Celebration Cake', category: 'catering', unit: 'cakes', placeholder: 'How many cakes?' }
    ]
  },

  // MISSING CULTURAL EVENTS
  'cultural-fair': {
    'Cultural Exhibits': [
      { id: 'cultural-displays', label: 'Cultural Displays', category: 'decoration', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'artisan-booths', label: 'Artisan Booths', category: 'other', unit: 'booths', placeholder: 'How many booths?' },
      { id: 'cultural-performances', label: 'Cultural Performances', category: 'entertainment', unit: 'performances', placeholder: 'How many performances?' }
    ]
  },

  'naming-ceremony': {
    'Ceremony Services': [
      { id: 'naming-ritual', label: 'Naming Ritual', category: 'other' },
      { id: 'ceremony-photography', label: 'Ceremony Photography', category: 'photography' },
      { id: 'blessing-coordination', label: 'Blessing Coordination', category: 'coordination' }
    ]
  },

  'art-exhibition': {
    'Exhibition Setup': [
      { id: 'artwork-display', label: 'Artwork Display', category: 'decoration', unit: 'pieces', placeholder: 'How many pieces?' },
      { id: 'gallery-lighting', label: 'Gallery Lighting', category: 'decoration' },
      { id: 'artist-coordination', label: 'Artist Coordination', category: 'coordination' }
    ]
  },

  'music-concert': {
    'Concert Services': [
      { id: 'sound-engineering', label: 'Sound Engineering', category: 'music_dj' },
      { id: 'stage-lighting', label: 'Stage Lighting', category: 'decoration' },
      { id: 'ticket-management', label: 'Ticket Management', category: 'coordination' }
    ]
  },

  'book-launch': {
    'Launch Services': [
      { id: 'author-coordination', label: 'Author Coordination', category: 'coordination' },
      { id: 'book-display', label: 'Book Display', category: 'decoration' },
      { id: 'reading-session', label: 'Reading Session', category: 'entertainment' }
    ]
  },

  'heritage-walk': {
    'Tour Services': [
      { id: 'heritage-guide', label: 'Heritage Guide', category: 'other' },
      { id: 'historical-documentation', label: 'Historical Documentation', category: 'photography' },
      { id: 'route-planning', label: 'Route Planning', category: 'coordination' }
    ]
  },

  'food-festival': {
    'Food Services': [
      { id: 'food-stalls', label: 'Food Stalls', category: 'catering', unit: 'stalls', placeholder: 'How many stalls?' },
      { id: 'chef-demonstrations', label: 'Chef Demonstrations', category: 'entertainment', unit: 'demos', placeholder: 'How many demos?' },
      { id: 'food-tasting', label: 'Food Tasting', category: 'catering', unit: 'tastings', placeholder: 'How many tastings?' }
    ]
  },

  // MISSING FESTIVAL EVENTS
  'eid-al-fitr': {
    'Religious Services': [
      { id: 'eid-prayers', label: 'Eid Prayers', category: 'other' },
      { id: 'imam-services', label: 'Imam Services', category: 'other' }
    ],
    'Decoration': [
      { id: 'islamic-decoration', label: 'Islamic Decoration', category: 'decoration' },
      { id: 'crescent-moon-setup', label: 'Crescent Moon Setup', category: 'decoration', unit: 'setups', placeholder: 'How many setups?' }
    ],
    'Catering': [
      { id: 'eid-feast', label: 'Eid Feast', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'traditional-sweets', label: 'Traditional Sweets', category: 'catering', unit: 'varieties', placeholder: 'How many varieties?' }
    ]
  },

  'eid-al-adha': {
    'Religious Services': [
      { id: 'eid-prayers', label: 'Eid Prayers', category: 'other' },
      { id: 'imam-services', label: 'Imam Services', category: 'other' }
    ],
    'Catering': [
      { id: 'halal-meat-service', label: 'Halal Meat Service', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
      { id: 'community-feast', label: 'Community Feast', category: 'catering', unit: 'meals', placeholder: 'How many meals?' }
    ]
  },

  // MISSING RELIGIOUS EVENTS
  'mass-gathering': {
    'Religious Services': [
      { id: 'religious-coordination', label: 'Religious Coordination', category: 'coordination' },
      { id: 'crowd-management', label: 'Crowd Management', category: 'coordination', unit: 'personnel', placeholder: 'How many personnel?' }
    ]
  },

  'meditation-retreat': {
    'Retreat Services': [
      { id: 'meditation-instructors', label: 'Meditation Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'retreat-coordination', label: 'Retreat Coordination', category: 'coordination' }
    ]
  },

  'interfaith-gathering': {
    'Interfaith Services': [
      { id: 'religious-speakers', label: 'Religious Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'interfaith-coordination', label: 'Interfaith Coordination', category: 'coordination' }
    ]
  },

  'religious-seminar': {
    'Seminar Services': [
      { id: 'religious-speakers', label: 'Religious Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'seminar-materials', label: 'Seminar Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'satsang': {
    'Spiritual Services': [
      { id: 'spiritual-speakers', label: 'Spiritual Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'satsang-coordination', label: 'Satsang Coordination', category: 'coordination' }
    ]
  },

  'religious-discourse': {
    'Discourse Services': [
      { id: 'religious-scholars', label: 'Religious Scholars', category: 'other', unit: 'scholars', placeholder: 'How many scholars?' },
      { id: 'discourse-coordination', label: 'Discourse Coordination', category: 'coordination' }
    ]
  },

  'temple-inauguration': {
    'Inauguration Services': [
      { id: 'religious-authorities', label: 'Religious Authorities', category: 'other', unit: 'authorities', placeholder: 'How many authorities?' },
      { id: 'inauguration-coordination', label: 'Inauguration Coordination', category: 'coordination' }
    ]
  },

  'spiritual-retreat': {
    'Spiritual Services': [
      { id: 'spiritual-guides', label: 'Spiritual Guides', category: 'other', unit: 'guides', placeholder: 'How many guides?' },
      { id: 'accommodation-services', label: 'Accommodation Services', category: 'other' }
    ]
  },

  'yoga-workshop': {
    'Yoga Services': [
      { id: 'yoga-instructors', label: 'Yoga Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'yoga-equipment', label: 'Yoga Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'religious-procession': {
    'Procession Services': [
      { id: 'procession-coordination', label: 'Procession Coordination', category: 'coordination' },
      { id: 'traditional-musicians', label: 'Traditional Musicians', category: 'entertainment', unit: 'musicians', placeholder: 'How many musicians?' }
    ]
  },

  'prayer-meeting': {
    'Prayer Services': [
      { id: 'religious-leaders', label: 'Religious Leaders', category: 'other', unit: 'leaders', placeholder: 'How many leaders?' },
      { id: 'prayer-coordination', label: 'Prayer Coordination', category: 'coordination' }
    ]
  },

  'community-service': {
    'Service Coordination': [
      { id: 'volunteer-coordination', label: 'Volunteer Coordination', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' },
      { id: 'service-supplies', label: 'Service Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'religious-festival': {
    'Festival Services': [
      { id: 'religious-coordination', label: 'Religious Coordination', category: 'coordination' },
      { id: 'festival-decoration', label: 'Festival Decoration', category: 'decoration' }
    ]
  },

  'pilgrimage-tour': {
    'Tour Services': [
      { id: 'tour-guides', label: 'Tour Guides', category: 'other', unit: 'guides', placeholder: 'How many guides?' },
      { id: 'transportation-services', label: 'Transportation Services', category: 'transportation' }
    ]
  },

  'blessing-ceremony': {
    'Blessing Services': [
      { id: 'religious-officiants', label: 'Religious Officiants', category: 'other', unit: 'officiants', placeholder: 'How many officiants?' },
      { id: 'ceremony-coordination', label: 'Ceremony Coordination', category: 'coordination' }
    ]
  },

  'sacred-thread-ceremony': {
    'Ceremony Services': [
      { id: 'priests', label: 'Priests', category: 'other', unit: 'priests', placeholder: 'How many priests?' },
      { id: 'ritual-supplies', label: 'Ritual Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  // MISSING POLITICAL EVENTS
  'charity-event': {
    'Charity Services': [
      { id: 'charity-coordination', label: 'Charity Coordination', category: 'coordination' },
      { id: 'auction-coordination', label: 'Auction Coordination', category: 'coordination' }
    ]
  },

  'party-convention': {
    'Convention Services': [
      { id: 'convention-coordination', label: 'Convention Coordination', category: 'coordination' },
      { id: 'delegate-management', label: 'Delegate Management', category: 'coordination', unit: 'delegates', placeholder: 'How many delegates?' }
    ]
  },

  'swearing-in-ceremony': {
    'Ceremony Services': [
      { id: 'ceremony-officiants', label: 'Ceremony Officiants', category: 'other', unit: 'officiants', placeholder: 'How many officiants?' },
      { id: 'protocol-coordination', label: 'Protocol Coordination', category: 'coordination' }
    ]
  },

  'political-summit': {
    'Summit Services': [
      { id: 'summit-speakers', label: 'Summit Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'interpreters', label: 'Interpreters', category: 'other', unit: 'interpreters', placeholder: 'How many interpreters?' }
    ]
  },

  'independence-day-rally': {
    'Rally Services': [
      { id: 'patriotic-coordination', label: 'Patriotic Coordination', category: 'coordination' },
      { id: 'flag-ceremony', label: 'Flag Ceremony', category: 'other' }
    ]
  },

  'republic-day-parade': {
    'Parade Services': [
      { id: 'parade-management', label: 'Parade Management', category: 'coordination' },
      { id: 'ceremonial-coordination', label: 'Ceremonial Coordination', category: 'coordination' }
    ]
  },

  'community-town-hall': {
    'Town Hall Services': [
      { id: 'discussion-moderators', label: 'Discussion Moderators', category: 'other', unit: 'moderators', placeholder: 'How many moderators?' },
      { id: 'community-coordination', label: 'Community Coordination', category: 'coordination' }
    ]
  },

  'labor-day-rally': {
    'Labor Rally Services': [
      { id: 'labor-speakers', label: 'Labor Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'rally-coordination', label: 'Rally Coordination', category: 'coordination' }
    ]
  },

  // MISSING SPORTS EVENTS
  'adventure-camp': {
    'Adventure Services': [
      { id: 'adventure-instructors', label: 'Adventure Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'gear-rental', label: 'Gear Rental', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'sports-day': {
    'Sports Services': [
      { id: 'sports-equipment', label: 'Sports Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'sports-coordinators', label: 'Sports Coordinators', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' }
    ]
  },

  'e-sports-tournament': {
    'E-Sports Services': [
      { id: 'gaming-equipment', label: 'Gaming Equipment', category: 'other', unit: 'setups', placeholder: 'How many setups?' },
      { id: 'tournament-coordination', label: 'Tournament Coordination', category: 'coordination' }
    ]
  },

  // MISSING EDUCATIONAL EVENTS
  'lecture-series': {
    'Lecture Services': [
      { id: 'guest-speakers', label: 'Guest Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'lecture-coordination', label: 'Lecture Coordination', category: 'coordination' }
    ]
  },

  'school-annual-day': {
    'School Event Services': [
      { id: 'student-performers', label: 'Student Performers', category: 'entertainment', unit: 'performers', placeholder: 'How many performers?' },
      { id: 'school-coordination', label: 'School Coordination', category: 'coordination' }
    ]
  },

  'academic-symposium': {
    'Academic Services': [
      { id: 'academic-speakers', label: 'Academic Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'research-coordination', label: 'Research Coordination', category: 'coordination' }
    ]
  },

  'research-conference': {
    'Research Services': [
      { id: 'research-speakers', label: 'Research Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'poster-sessions', label: 'Poster Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' }
    ]
  },

  'debate-competition': {
    'Debate Services': [
      { id: 'debate-moderators', label: 'Debate Moderators', category: 'other', unit: 'moderators', placeholder: 'How many moderators?' },
      { id: 'judging-panel', label: 'Judging Panel', category: 'other', unit: 'judges', placeholder: 'How many judges?' }
    ]
  },

  'quiz-contest': {
    'Quiz Services': [
      { id: 'quiz-hosts', label: 'Quiz Hosts', category: 'other', unit: 'hosts', placeholder: 'How many hosts?' },
      { id: 'quiz-coordination', label: 'Quiz Coordination', category: 'coordination' }
    ]
  },

  'literary-festival': {
    'Literary Services': [
      { id: 'authors', label: 'Authors', category: 'other', unit: 'authors', placeholder: 'How many authors?' },
      { id: 'literary-coordination', label: 'Literary Coordination', category: 'coordination' }
    ]
  },

  // MISSING VIRTUAL EVENTS
  'live-stream-party': {
    'Streaming Services': [
      { id: 'streaming-platform', label: 'Streaming Platform', category: 'other' },
      { id: 'virtual-entertainers', label: 'Virtual Entertainers', category: 'entertainment', unit: 'entertainers', placeholder: 'How many entertainers?' }
    ]
  },

  'virtual-team-building-event': {
    'Virtual Team Building': [
      { id: 'activity-facilitators', label: 'Activity Facilitators', category: 'other', unit: 'facilitators', placeholder: 'How many facilitators?' },
      { id: 'virtual-tools', label: 'Virtual Tools', category: 'other' }
    ]
  },

  'online-product-launch': {
    'Digital Launch Services': [
      { id: 'digital-marketing', label: 'Digital Marketing', category: 'other' },
      { id: 'virtual-demo', label: 'Virtual Demo', category: 'other' }
    ]
  },

  'virtual-charity-auction': {
    'Virtual Auction Services': [
      { id: 'auction-software', label: 'Auction Software', category: 'other' },
      { id: 'virtual-auctioneers', label: 'Virtual Auctioneers', category: 'other', unit: 'auctioneers', placeholder: 'How many auctioneers?' }
    ]
  },

  'hybrid-festival-celebration': {
    'Hybrid Services': [
      { id: 'hybrid-platform', label: 'Hybrid Platform', category: 'other' },
      { id: 'av-teams', label: 'AV Teams', category: 'other', unit: 'teams', placeholder: 'How many teams?' }
    ]
  },

  // MISSING ENTERTAINMENT EVENTS
  'theater-play': {
    'Theater Services': [
      { id: 'actors', label: 'Actors', category: 'entertainment', unit: 'actors', placeholder: 'How many actors?' },
      { id: 'stage-design', label: 'Stage Design', category: 'decoration' }
    ]
  },

  'fashion-show': {
    'Fashion Services': [
      { id: 'fashion-models', label: 'Fashion Models', category: 'entertainment', unit: 'models', placeholder: 'How many models?' },
      { id: 'runway-setup', label: 'Runway Setup', category: 'decoration' }
    ]
  },

  'puppet-show': {
    'Puppet Services': [
      { id: 'puppeteers', label: 'Puppeteers', category: 'entertainment', unit: 'puppeteers', placeholder: 'How many puppeteers?' },
      { id: 'puppet-supplies', label: 'Puppet Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'storytelling-session': {
    'Storytelling Services': [
      { id: 'storytellers', label: 'Storytellers', category: 'entertainment', unit: 'storytellers', placeholder: 'How many storytellers?' },
      { id: 'story-coordination', label: 'Story Coordination', category: 'coordination' }
    ]
  },

  'karaoke-night': {
    'Karaoke Services': [
      { id: 'karaoke-equipment', label: 'Karaoke Equipment', category: 'music_dj' },
      { id: 'karaoke-host', label: 'Karaoke Host', category: 'entertainment' }
    ]
  },

  'open-mic-night': {
    'Open Mic Services': [
      { id: 'sound-equipment', label: 'Sound Equipment', category: 'music_dj' },
      { id: 'mic-hosts', label: 'Mic Hosts', category: 'entertainment', unit: 'hosts', placeholder: 'How many hosts?' }
    ]
  },

  'film-screening': {
    'Screening Services': [
      { id: 'projection-equipment', label: 'Projection Equipment', category: 'other' },
      { id: 'film-coordination', label: 'Film Coordination', category: 'coordination' }
    ]
  },

  'poetry-reading': {
    'Poetry Services': [
      { id: 'poets', label: 'Poets', category: 'entertainment', unit: 'poets', placeholder: 'How many poets?' },
      { id: 'reading-coordination', label: 'Reading Coordination', category: 'coordination' }
    ]
  },

  'art-workshop': {
    'Art Services': [
      { id: 'art-instructors', label: 'Art Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'art-supplies', label: 'Art Supplies', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'dance-workshop': {
    'Dance Services': [
      { id: 'dance-instructors', label: 'Dance Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'dance-coordination', label: 'Dance Coordination', category: 'coordination' }
    ]
  },

  'music-workshop': {
    'Music Services': [
      { id: 'music-instructors', label: 'Music Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'instrument-supplies', label: 'Instrument Supplies', category: 'other', unit: 'instruments', placeholder: 'How many instruments?' }
    ]
  },

  'celebrity-meet-greet': {
    'Celebrity Services': [
      { id: 'celebrity-management', label: 'Celebrity Management', category: 'coordination' },
      { id: 'meet-greet-coordination', label: 'Meet & Greet Coordination', category: 'coordination' }
    ]
  },

  // MISSING COMMUNITY EVENTS
  'tree-plantation-drive': {
    'Plantation Services': [
      { id: 'tree-saplings', label: 'Tree Saplings', category: 'other', unit: 'saplings', placeholder: 'How many saplings?' },
      { id: 'gardening-tools', label: 'Gardening Tools', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'awareness-rally': {
    'Rally Services': [
      { id: 'rally-coordination', label: 'Rally Coordination', category: 'coordination' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'volunteer-appreciation': {
    'Appreciation Services': [
      { id: 'appreciation-coordination', label: 'Appreciation Coordination', category: 'coordination' },
      { id: 'award-supplies', label: 'Award Supplies', category: 'other', unit: 'awards', placeholder: 'How many awards?' }
    ]
  },

  'social-cause-event': {
    'Social Cause Services': [
      { id: 'cause-representatives', label: 'Cause Representatives', category: 'other', unit: 'representatives', placeholder: 'How many representatives?' },
      { id: 'cause-coordination', label: 'Cause Coordination', category: 'coordination' }
    ]
  },

  'community-festival': {
    'Community Services': [
      { id: 'community-coordination', label: 'Community Coordination', category: 'coordination' },
      { id: 'local-performers', label: 'Local Performers', category: 'entertainment', unit: 'performers', placeholder: 'How many performers?' }
    ]
  },

  'senior-citizen-program': {
    'Senior Services': [
      { id: 'activity-coordinators', label: 'Activity Coordinators', category: 'coordination', unit: 'coordinators', placeholder: 'How many coordinators?' },
      { id: 'healthcare-support', label: 'Healthcare Support', category: 'other' }
    ]
  },

  'youth-development-program': {
    'Youth Services': [
      { id: 'youth-mentors', label: 'Youth Mentors', category: 'other', unit: 'mentors', placeholder: 'How many mentors?' },
      { id: 'development-activities', label: 'Development Activities', category: 'other', unit: 'activities', placeholder: 'How many activities?' }
    ]
  },


};



// MISSING EVENTS - REMAINING CATEGORIES
const additionalRequirements = {
  'webinar': {
    'Virtual Platform': [
      { id: 'webinar-platform', label: 'Webinar Platform', category: 'other' },
      { id: 'virtual-moderators', label: 'Virtual Moderators', category: 'other', unit: 'moderators', placeholder: 'How many moderators?' },
      { id: 'tech-support', label: 'Tech Support', category: 'other', unit: 'technicians', placeholder: 'How many technicians?' }
    ]
  },

  'wellness-seminar': {
    'Wellness Services': [
      { id: 'wellness-speakers', label: 'Wellness Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'wellness-materials', label: 'Wellness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'wellness-coordination', label: 'Wellness Coordination', category: 'coordination' }
    ]
  },

  'mental-health-awareness-event': {
    'Awareness Services': [
      { id: 'mental-health-speakers', label: 'Mental Health Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'support-coordination', label: 'Support Coordination', category: 'coordination' }
    ]
  },

  'fitness-bootcamp': {
    'Fitness Services': [
      { id: 'fitness-trainers', label: 'Fitness Trainers', category: 'other', unit: 'trainers', placeholder: 'How many trainers?' },
      { id: 'fitness-equipment', label: 'Fitness Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'medical-support', label: 'Medical Support', category: 'other', unit: 'staff', placeholder: 'How many staff?' }
    ]
  },

  'nutrition-workshop': {
    'Nutrition Services': [
      { id: 'nutritionists', label: 'Nutritionists', category: 'other', unit: 'nutritionists', placeholder: 'How many nutritionists?' },
      { id: 'nutrition-materials', label: 'Nutrition Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'healthy-samples', label: 'Healthy Samples', category: 'catering', unit: 'samples', placeholder: 'How many samples?' }
    ]
  },

  'mindfulness-retreat': {
    'Mindfulness Services': [
      { id: 'mindfulness-instructors', label: 'Mindfulness Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'retreat-coordination', label: 'Retreat Coordination', category: 'coordination' },
      { id: 'mindful-meals', label: 'Mindful Meals', category: 'catering', unit: 'meals', placeholder: 'How many meals?' }
    ]
  },

  'health-fair': {
    'Health Services': [
      { id: 'health-vendors', label: 'Health Vendors', category: 'other', unit: 'vendors', placeholder: 'How many vendors?' },
      { id: 'health-exhibitors', label: 'Health Exhibitors', category: 'other', unit: 'exhibitors', placeholder: 'How many exhibitors?' },
      { id: 'health-screenings', label: 'Health Screenings', category: 'other', unit: 'screenings', placeholder: 'How many screenings?' }
    ]
  },

  'wellness-workshop': {
    'Workshop Services': [
      { id: 'wellness-experts', label: 'Wellness Experts', category: 'other', unit: 'experts', placeholder: 'How many experts?' },
      { id: 'workshop-materials', label: 'Workshop Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'wellness-activities', label: 'Wellness Activities', category: 'other', unit: 'activities', placeholder: 'How many activities?' }
    ]
  },

  'nutrition-awareness-program': {
    'Nutrition Education': [
      { id: 'nutrition-educators', label: 'Nutrition Educators', category: 'other', unit: 'educators', placeholder: 'How many educators?' },
      { id: 'educational-materials', label: 'Educational Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'nutrition-demonstrations', label: 'Nutrition Demonstrations', category: 'other', unit: 'demos', placeholder: 'How many demos?' }
    ]
  },

  'health-screening': {
    'Screening Services': [
      { id: 'medical-equipment', label: 'Medical Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'healthcare-professionals', label: 'Healthcare Professionals', category: 'other', unit: 'professionals', placeholder: 'How many professionals?' },
      { id: 'screening-coordination', label: 'Screening Coordination', category: 'coordination' }
    ]
  },

  'medical-conference': {
    'Medical Services': [
      { id: 'medical-speakers', label: 'Medical Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'medical-presentations', label: 'Medical Presentations', category: 'other', unit: 'presentations', placeholder: 'How many presentations?' },
      { id: 'medical-coordination', label: 'Medical Coordination', category: 'coordination' }
    ]
  },

  'vaccination-drive': {
    'Vaccination Services': [
      { id: 'medical-teams', label: 'Medical Teams', category: 'other', unit: 'teams', placeholder: 'How many teams?' },
      { id: 'vaccine-supplies', label: 'Vaccine Supplies', category: 'other', unit: 'doses', placeholder: 'How many doses?' },
      { id: 'vaccination-coordination', label: 'Vaccination Coordination', category: 'coordination' }
    ]
  },

  'health-awareness-campaign': {
    'Campaign Services': [
      { id: 'health-educators', label: 'Health Educators', category: 'other', unit: 'educators', placeholder: 'How many educators?' },
      { id: 'campaign-materials', label: 'Campaign Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'awareness-coordination', label: 'Awareness Coordination', category: 'coordination' }
    ]
  },

  'sustainability-workshop': {
    'Sustainability Services': [
      { id: 'sustainability-speakers', label: 'Sustainability Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'eco-materials', label: 'Eco Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'green-coordination', label: 'Green Coordination', category: 'coordination' }
    ]
  },

  'clean-up-drive': {
    'Cleanup Services': [
      { id: 'waste-management', label: 'Waste Management', category: 'other' },
      { id: 'cleanup-tools', label: 'Cleanup Tools', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'volunteer-coordination', label: 'Volunteer Coordination', category: 'coordination' }
    ]
  },

  'environmental-awareness-campaign': {
    'Environmental Services': [
      { id: 'environmental-educators', label: 'Environmental Educators', category: 'other', unit: 'educators', placeholder: 'How many educators?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'campaign-coordination', label: 'Campaign Coordination', category: 'coordination' }
    ]
  },

  'green-living-expo': {
    'Expo Services': [
      { id: 'green-exhibitors', label: 'Green Exhibitors', category: 'other', unit: 'exhibitors', placeholder: 'How many exhibitors?' },
      { id: 'sustainable-vendors', label: 'Sustainable Vendors', category: 'other', unit: 'vendors', placeholder: 'How many vendors?' },
      { id: 'eco-demonstrations', label: 'Eco Demonstrations', category: 'other', unit: 'demos', placeholder: 'How many demos?' }
    ]
  },

  // COMPREHENSIVE COVERAGE - ALL REMAINING EVENTS FROM DATABASE
  
  // Additional Corporate Events
  'team-building-event': {
    'Team Activities': [
      { 
        id: 'team-facilitators', 
        label: 'Team Facilitators', 
        category: 'coordination', 
        unit: 'facilitators', 
        placeholder: 'How many facilitators?',
        questions: [
          { id: 'team-count', label: 'Number of teams?', type: 'number', min: 2, max: 20 },
          { id: 'activities-planned', label: 'Activities planned?', type: 'dropdown', options: ['Problem-solving', 'Physical challenges', 'Creative tasks', 'Communication exercises', 'Mixed activities'] },
          { id: 'duration', label: 'Duration?', type: 'dropdown', options: ['2 hours', '4 hours', 'Half day', 'Full day', '2 days'] }
        ]
      },
      { 
        id: 'team-activities', 
        label: 'Team Activities', 
        category: 'entertainment', 
        unit: 'activities', 
        placeholder: 'How many activities?',
        questions: [
          { id: 'activity-type', label: 'Activity type?', type: 'dropdown', options: ['Indoor only', 'Outdoor only', 'Virtual', 'Mixed (Indoor/Outdoor)'] },
          { id: 'difficulty-level', label: 'Difficulty level?', type: 'dropdown', options: ['Easy', 'Moderate', 'Challenging', 'Mixed levels'] },
          { id: 'objectives', label: 'Objectives?', type: 'dropdown', options: ['Communication', 'Leadership', 'Problem-solving', 'Trust-building', 'All objectives'] }
        ]
      },
      { 
        id: 'team-challenges', 
        label: 'Team Challenges', 
        category: 'entertainment', 
        unit: 'challenges', 
        placeholder: 'How many challenges?',
        questions: [
          { id: 'challenge-format', label: 'Competitive or collaborative?', type: 'dropdown', options: ['Competitive', 'Collaborative', 'Mixed format'] },
          { id: 'prize-for-winners', label: 'Prize for winners?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'outdoor-equipment', 
        label: 'Outdoor Equipment', 
        category: 'other', 
        unit: 'sets', 
        placeholder: 'How many sets?',
        questions: [
          { id: 'equipment-type', label: 'Activity-specific equipment?', type: 'dropdown', options: ['Sports equipment', 'Adventure gear', 'Team challenge props', 'Mixed equipment'] },
          { id: 'safety-gear', label: 'Safety gear needed?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'weather-backup', label: 'Weather backup plan?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      }
    ],
    'Catering': [
      { 
        id: 'team-lunch', 
        label: 'Team Lunch', 
        category: 'catering', 
        unit: 'meals', 
        placeholder: 'How many meals?',
        questions: [
          { id: 'people-count', label: 'Number of people?', type: 'number', min: 5, max: 500 },
          { id: 'meal-preference', label: 'Meal preference?', type: 'dropdown', options: ['Casual lunch', 'Formal dining', 'BBQ/Outdoor', 'Packed meals'] },
          { id: 'location', label: 'Location?', type: 'dropdown', options: ['Indoor dining', 'Outdoor setup', 'Venue restaurant', 'Off-site restaurant'] }
        ]
      },
      { 
        id: 'energy-snacks', 
        label: 'Energy Snacks', 
        category: 'catering', 
        unit: 'packs', 
        placeholder: 'How many packs?',
        questions: [
          { id: 'snack-type', label: 'Type of snacks?', type: 'dropdown', options: ['Healthy snacks', 'Energy bars', 'Mixed snacks', 'Custom selection'] },
          { id: 'quantity', label: 'Quantity?', type: 'number', min: 5, max: 500 },
          { id: 'distribution-timing', label: 'Distribution timing?', type: 'dropdown', options: ['Start of event', 'Mid-event break', 'Throughout event', 'End of event'] }
        ]
      }
    ]
  },

  'board-meeting': {
    'Meeting Services': [
      { 
        id: 'meeting-coordination', 
        label: 'Meeting Coordination', 
        category: 'coordination',
        questions: [
          { id: 'attendee-count', label: 'Number of attendees?', type: 'number', min: 3, max: 50 },
          { id: 'meeting-duration', label: 'Meeting duration?', type: 'dropdown', options: ['2 hours', '4 hours', 'Half day', 'Full day', '2 days'] },
          { id: 'room-setup', label: 'Room setup style?', type: 'dropdown', options: ['Boardroom style', 'U-shape', 'Conference style', 'Theater style'] }
        ]
      },
      { 
        id: 'presentation-setup', 
        label: 'Presentation Setup', 
        category: 'other',
        questions: [
          { id: 'equipment-needed', label: 'Equipment needed?', type: 'dropdown', options: ['Basic (projector + screen)', 'Standard AV setup', 'Advanced (multiple screens)', 'Video conferencing'] },
          { id: 'presenter-count', label: 'Number of presenters?', type: 'number', min: 1, max: 20 }
        ]
      },
      { 
        id: 'meeting-materials', 
        label: 'Meeting Materials', 
        category: 'other', 
        unit: 'sets', 
        placeholder: 'How many sets?',
        questions: [
          { id: 'document-preparation', label: 'Document preparation?', type: 'dropdown', options: ['Yes', 'No'] },
          { id: 'printing-quantity', label: 'Printing quantity?', type: 'number', min: 1, max: 100 },
          { id: 'confidential-handling', label: 'Confidential handling?', type: 'dropdown', options: ['Yes', 'No'] }
        ]
      },
      { 
        id: 'executive-catering', 
        label: 'Executive Catering', 
        category: 'catering', 
        unit: 'meals', 
        placeholder: 'How many meals?',
        questions: [
          { id: 'meal-type', label: 'Meal type?', type: 'dropdown', options: ['Light refreshments', 'Business lunch', 'Full course meal', 'Coffee & pastries'] },
          { id: 'service-style', label: 'Service style?', type: 'dropdown', options: ['Buffet', 'Plated service', 'Continental setup', 'In-room service'] },
          { id: 'dietary-preferences', label: 'Dietary preferences?', type: 'dropdown', options: ['Standard', 'Vegetarian options', 'Vegan options', 'Multiple dietary needs'] }
        ]
      }
    ]
  },

  'company-picnic': {
    'Outdoor Activities': [
      { id: 'outdoor-games', label: 'Outdoor Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' },
      { id: 'picnic-setup', label: 'Picnic Setup', category: 'decoration' },
      { id: 'outdoor-catering', label: 'Outdoor Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'entertainment-activities', label: 'Entertainment Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' }
    ]
  },

  'employee-recognition': {
    'Recognition Services': [
      { id: 'award-ceremony', label: 'Award Ceremony', category: 'coordination' },
      { id: 'recognition-awards', label: 'Recognition Awards', category: 'other', unit: 'awards', placeholder: 'How many awards?' },
      { id: 'celebration-catering', label: 'Celebration Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'achievement-display', label: 'Achievement Display', category: 'decoration' }
    ]
  },

  'client-appreciation': {
    'Client Services': [
      { id: 'client-coordination', label: 'Client Coordination', category: 'coordination' },
      { id: 'appreciation-gifts', label: 'Appreciation Gifts', category: 'other', unit: 'gifts', placeholder: 'How many gifts?' },
      { id: 'premium-catering', label: 'Premium Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'client-entertainment', label: 'Client Entertainment', category: 'entertainment' }
    ]
  },

  'startup-pitch': {
    'Pitch Services': [
      { id: 'pitch-coaching', label: 'Pitch Coaching', category: 'other' },
      { id: 'investor-coordination', label: 'Investor Coordination', category: 'coordination' },
      { id: 'demo-setup', label: 'Demo Setup', category: 'other' },
      { id: 'networking-session', label: 'Networking Session', category: 'coordination' }
    ]
  },

  'business-launch': {
    'Launch Services': [
      { id: 'launch-coordination', label: 'Launch Coordination', category: 'coordination' },
      { id: 'media-management', label: 'Media Management', category: 'other' },
      { id: 'launch-catering', label: 'Launch Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'promotional-materials', label: 'Promotional Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' }
    ]
  },

  'corporate-retreat': {
    'Retreat Services': [
      { id: 'retreat-coordination', label: 'Retreat Coordination', category: 'coordination' },
      { id: 'accommodation-management', label: 'Accommodation Management', category: 'other' },
      { id: 'retreat-activities', label: 'Retreat Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'wellness-sessions', label: 'Wellness Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' }
    ]
  },

  'sales-conference': {
    'Sales Services': [
      { id: 'sales-speakers', label: 'Sales Speakers', category: 'other', unit: 'speakers', placeholder: 'How many speakers?' },
      { id: 'sales-materials', label: 'Sales Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'performance-awards', label: 'Performance Awards', category: 'other', unit: 'awards', placeholder: 'How many awards?' },
      { id: 'motivational-sessions', label: 'Motivational Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' }
    ]
  },

  'merger-announcement': {
    'Announcement Services': [
      { id: 'announcement-coordination', label: 'Announcement Coordination', category: 'coordination' },
      { id: 'stakeholder-management', label: 'Stakeholder Management', category: 'coordination' },
      { id: 'press-coordination', label: 'Press Coordination', category: 'other' },
      { id: 'celebration-event', label: 'Celebration Event', category: 'coordination' }
    ]
  },

  // Additional Social Events
  'house-party': {
    'Party Services': [
      { id: 'party-coordination', label: 'Party Coordination', category: 'coordination' },
      { id: 'home-decoration', label: 'Home Decoration', category: 'decoration' },
      { id: 'party-catering', label: 'Party Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'party-entertainment', label: 'Party Entertainment', category: 'entertainment' }
    ]
  },

  'surprise-party': {
    'Surprise Services': [
      { id: 'surprise-coordination', label: 'Surprise Coordination', category: 'coordination' },
      { id: 'secret-planning', label: 'Secret Planning', category: 'coordination' },
      { id: 'surprise-decoration', label: 'Surprise Decoration', category: 'decoration' },
      { id: 'surprise-entertainment', label: 'Surprise Entertainment', category: 'entertainment' }
    ]
  },

  'cocktail-party': {
    'Cocktail Services': [
      { id: 'bartender-service', label: 'Bartender Service', category: 'catering', unit: 'bartenders', placeholder: 'How many bartenders?' },
      { id: 'cocktail-menu', label: 'Cocktail Menu', category: 'catering' },
      { id: 'bar-setup', label: 'Bar Setup', category: 'decoration' },
      { id: 'cocktail-entertainment', label: 'Cocktail Entertainment', category: 'entertainment' }
    ]
  },

  'dinner-party': {
    'Dinner Services': [
      { id: 'fine-dining-catering', label: 'Fine Dining Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'table-setting', label: 'Table Setting', category: 'decoration' },
      { id: 'dinner-entertainment', label: 'Dinner Entertainment', category: 'entertainment' },
      { id: 'wine-service', label: 'Wine Service', category: 'catering' }
    ]
  },

  'theme-party': {
    'Theme Services': [
      { id: 'theme-coordination', label: 'Theme Coordination', category: 'coordination' },
      { id: 'costume-coordination', label: 'Costume Coordination', category: 'other' },
      { id: 'themed-decoration', label: 'Themed Decoration', category: 'decoration' },
      { id: 'themed-entertainment', label: 'Themed Entertainment', category: 'entertainment' }
    ]
  },

  'pool-party': {
    'Pool Services': [
      { id: 'pool-safety', label: 'Pool Safety', category: 'other' },
      { id: 'poolside-catering', label: 'Poolside Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'water-activities', label: 'Water Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'poolside-decoration', label: 'Poolside Decoration', category: 'decoration' }
    ]
  },

  'garden-party': {
    'Garden Services': [
      { id: 'garden-setup', label: 'Garden Setup', category: 'decoration' },
      { id: 'outdoor-catering', label: 'Outdoor Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'garden-entertainment', label: 'Garden Entertainment', category: 'entertainment' },
      { id: 'weather-protection', label: 'Weather Protection', category: 'other' }
    ]
  },

  'rooftop-party': {
    'Rooftop Services': [
      { id: 'rooftop-setup', label: 'Rooftop Setup', category: 'decoration' },
      { id: 'safety-measures', label: 'Safety Measures', category: 'other' },
      { id: 'rooftop-catering', label: 'Rooftop Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'city-view-setup', label: 'City View Setup', category: 'decoration' }
    ]
  },

  'beach-party': {
    'Beach Services': [
      { id: 'beach-setup', label: 'Beach Setup', category: 'decoration' },
      { id: 'beach-activities', label: 'Beach Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'beach-catering', label: 'Beach Catering', category: 'catering', unit: 'meals', placeholder: 'How many meals?' },
      { id: 'sun-protection', label: 'Sun Protection', category: 'other' }
    ]
  },

  'picnic-party': {
    'Picnic Services': [
      { id: 'picnic-coordination', label: 'Picnic Coordination', category: 'coordination' },
      { id: 'outdoor-setup', label: 'Outdoor Setup', category: 'decoration' },
      { id: 'picnic-food', label: 'Picnic Food', category: 'catering', unit: 'baskets', placeholder: 'How many baskets?' },
      { id: 'outdoor-games', label: 'Outdoor Games', category: 'entertainment', unit: 'games', placeholder: 'How many games?' }
    ]
  },

  // Additional Festival Events
  'kite-festival': {
    'Kite Services': [
      { id: 'kite-supplies', label: 'Kite Supplies', category: 'other', unit: 'kites', placeholder: 'How many kites?' },
      { id: 'kite-instructors', label: 'Kite Instructors', category: 'other', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'festival-coordination', label: 'Festival Coordination', category: 'coordination' },
      { id: 'safety-measures', label: 'Safety Measures', category: 'other' }
    ]
  },

  'harvest-festival': {
    'Harvest Services': [
      { id: 'harvest-displays', label: 'Harvest Displays', category: 'decoration', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'traditional-food', label: 'Traditional Food', category: 'catering', unit: 'dishes', placeholder: 'How many dishes?' },
      { id: 'folk-performances', label: 'Folk Performances', category: 'entertainment', unit: 'performances', placeholder: 'How many performances?' },
      { id: 'agricultural-exhibits', label: 'Agricultural Exhibits', category: 'other', unit: 'exhibits', placeholder: 'How many exhibits?' }
    ]
  },

  'spring-festival': {
    'Spring Services': [
      { id: 'spring-decoration', label: 'Spring Decoration', category: 'decoration' },
      { id: 'flower-arrangements', label: 'Flower Arrangements', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' },
      { id: 'spring-activities', label: 'Spring Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'seasonal-food', label: 'Seasonal Food', category: 'catering', unit: 'dishes', placeholder: 'How many dishes?' }
    ]
  },

  'winter-festival': {
    'Winter Services': [
      { id: 'winter-decoration', label: 'Winter Decoration', category: 'decoration' },
      { id: 'warm-beverages', label: 'Warm Beverages', category: 'catering', unit: 'servings', placeholder: 'How many servings?' },
      { id: 'winter-activities', label: 'Winter Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'heating-arrangements', label: 'Heating Arrangements', category: 'other' }
    ]
  },

  'monsoon-festival': {
    'Monsoon Services': [
      { id: 'rain-protection', label: 'Rain Protection', category: 'other' },
      { id: 'monsoon-decoration', label: 'Monsoon Decoration', category: 'decoration' },
      { id: 'indoor-activities', label: 'Indoor Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' },
      { id: 'monsoon-food', label: 'Monsoon Food', category: 'catering', unit: 'dishes', placeholder: 'How many dishes?' }
    ]
  },

  'light-festival': {
    'Light Services': [
      { id: 'lighting-displays', label: 'Lighting Displays', category: 'decoration', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'lantern-making', label: 'Lantern Making', category: 'entertainment', unit: 'workshops', placeholder: 'How many workshops?' },
      { id: 'light-coordination', label: 'Light Coordination', category: 'coordination' },
      { id: 'electrical-safety', label: 'Electrical Safety', category: 'other' }
    ]
  },

  'flower-festival': {
    'Flower Services': [
      { id: 'flower-displays', label: 'Flower Displays', category: 'flowers', unit: 'displays', placeholder: 'How many displays?' },
      { id: 'flower-arrangements', label: 'Flower Arrangements', category: 'flowers', unit: 'arrangements', placeholder: 'How many arrangements?' },
      { id: 'gardening-workshops', label: 'Gardening Workshops', category: 'other', unit: 'workshops', placeholder: 'How many workshops?' },
      { id: 'floral-competitions', label: 'Floral Competitions', category: 'entertainment', unit: 'competitions', placeholder: 'How many competitions?' }
    ]
  },

  'music-festival': {
    'Music Services': [
      { id: 'stage-setup', label: 'Stage Setup', category: 'decoration', unit: 'stages', placeholder: 'How many stages?' },
      { id: 'sound-systems', label: 'Sound Systems', category: 'music_dj', unit: 'systems', placeholder: 'How many systems?' },
      { id: 'artist-coordination', label: 'Artist Coordination', category: 'coordination' },
      { id: 'crowd-management', label: 'Crowd Management', category: 'coordination', unit: 'personnel', placeholder: 'How many personnel?' }
    ]
  },

  'dance-festival': {
    'Dance Services': [
      { id: 'dance-stages', label: 'Dance Stages', category: 'decoration', unit: 'stages', placeholder: 'How many stages?' },
      { id: 'dance-instructors', label: 'Dance Instructors', category: 'entertainment', unit: 'instructors', placeholder: 'How many instructors?' },
      { id: 'costume-coordination', label: 'Costume Coordination', category: 'other' },
      { id: 'dance-competitions', label: 'Dance Competitions', category: 'entertainment', unit: 'competitions', placeholder: 'How many competitions?' }
    ]
  },

  'art-festival': {
    'Art Services': [
      { id: 'art-exhibitions', label: 'Art Exhibitions', category: 'decoration', unit: 'exhibitions', placeholder: 'How many exhibitions?' },
      { id: 'artist-coordination', label: 'Artist Coordination', category: 'coordination' },
      { id: 'art-workshops', label: 'Art Workshops', category: 'other', unit: 'workshops', placeholder: 'How many workshops?' },
      { id: 'art-competitions', label: 'Art Competitions', category: 'entertainment', unit: 'competitions', placeholder: 'How many competitions?' }
    ]
  },

  // Additional Health Events
  'dental-camp': {
    'Dental Services': [
      { id: 'dental-checkups', label: 'Dental Checkups', category: 'other', unit: 'checkups', placeholder: 'How many checkups?' },
      { id: 'dental-equipment', label: 'Dental Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'dental-professionals', label: 'Dental Professionals', category: 'other', unit: 'dentists', placeholder: 'How many dentists?' },
      { id: 'oral-hygiene-education', label: 'Oral Hygiene Education', category: 'other' }
    ]
  },

  'eye-camp': {
    'Eye Care Services': [
      { id: 'eye-examinations', label: 'Eye Examinations', category: 'other', unit: 'exams', placeholder: 'How many exams?' },
      { id: 'eye-equipment', label: 'Eye Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'eye-specialists', label: 'Eye Specialists', category: 'other', unit: 'specialists', placeholder: 'How many specialists?' },
      { id: 'vision-screening', label: 'Vision Screening', category: 'other' }
    ]
  },

  'cardiac-screening': {
    'Cardiac Services': [
      { id: 'ecg-tests', label: 'ECG Tests', category: 'other', unit: 'tests', placeholder: 'How many tests?' },
      { id: 'cardiac-equipment', label: 'Cardiac Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'cardiologists', label: 'Cardiologists', category: 'other', unit: 'doctors', placeholder: 'How many doctors?' },
      { id: 'heart-health-education', label: 'Heart Health Education', category: 'other' }
    ]
  },

  'diabetes-screening': {
    'Diabetes Services': [
      { id: 'blood-sugar-tests', label: 'Blood Sugar Tests', category: 'other', unit: 'tests', placeholder: 'How many tests?' },
      { id: 'diabetes-equipment', label: 'Diabetes Equipment', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'diabetes-educators', label: 'Diabetes Educators', category: 'other', unit: 'educators', placeholder: 'How many educators?' },
      { id: 'nutrition-counseling', label: 'Nutrition Counseling', category: 'other' }
    ]
  },

  'cancer-awareness': {
    'Cancer Awareness Services': [
      { id: 'awareness-sessions', label: 'Awareness Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'screening-tests', label: 'Screening Tests', category: 'other', unit: 'tests', placeholder: 'How many tests?' },
      { id: 'oncology-experts', label: 'Oncology Experts', category: 'other', unit: 'experts', placeholder: 'How many experts?' },
      { id: 'support-groups', label: 'Support Groups', category: 'other', unit: 'groups', placeholder: 'How many groups?' }
    ]
  },

  'women-health-camp': {
    'Women Health Services': [
      { id: 'gynecological-checkups', label: 'Gynecological Checkups', category: 'other', unit: 'checkups', placeholder: 'How many checkups?' },
      { id: 'women-health-specialists', label: 'Women Health Specialists', category: 'other', unit: 'specialists', placeholder: 'How many specialists?' },
      { id: 'health-education', label: 'Health Education', category: 'other' },
      { id: 'prenatal-care', label: 'Prenatal Care', category: 'other' }
    ]
  },

  'child-health-camp': {
    'Child Health Services': [
      { id: 'pediatric-checkups', label: 'Pediatric Checkups', category: 'other', unit: 'checkups', placeholder: 'How many checkups?' },
      { id: 'pediatricians', label: 'Pediatricians', category: 'other', unit: 'doctors', placeholder: 'How many doctors?' },
      { id: 'immunization-services', label: 'Immunization Services', category: 'other' },
      { id: 'growth-monitoring', label: 'Growth Monitoring', category: 'other' }
    ]
  },

  'elderly-care-program': {
    'Elderly Care Services': [
      { id: 'geriatric-specialists', label: 'Geriatric Specialists', category: 'other', unit: 'specialists', placeholder: 'How many specialists?' },
      { id: 'mobility-assistance', label: 'Mobility Assistance', category: 'other' },
      { id: 'medication-management', label: 'Medication Management', category: 'other' },
      { id: 'social-activities', label: 'Social Activities', category: 'entertainment', unit: 'activities', placeholder: 'How many activities?' }
    ]
  },

  'addiction-awareness': {
    'Addiction Services': [
      { id: 'counseling-sessions', label: 'Counseling Sessions', category: 'other', unit: 'sessions', placeholder: 'How many sessions?' },
      { id: 'addiction-specialists', label: 'Addiction Specialists', category: 'other', unit: 'specialists', placeholder: 'How many specialists?' },
      { id: 'support-groups', label: 'Support Groups', category: 'other', unit: 'groups', placeholder: 'How many groups?' },
      { id: 'rehabilitation-info', label: 'Rehabilitation Info', category: 'other' }
    ]
  },

  'organ-donation-drive': {
    'Organ Donation Services': [
      { id: 'donation-coordination', label: 'Donation Coordination', category: 'coordination' },
      { id: 'medical-consultations', label: 'Medical Consultations', category: 'other', unit: 'consultations', placeholder: 'How many consultations?' },
      { id: 'awareness-materials', label: 'Awareness Materials', category: 'other', unit: 'sets', placeholder: 'How many sets?' },
      { id: 'registration-services', label: 'Registration Services', category: 'coordination' }
    ]
  },

};

// Merge additional requirements
Object.assign(eventSpecificRequirements, additionalRequirements);



// Enhanced event mappings for comprehensive coverage
const eventMappings: Record<string, string> = {
  // Tree planting variations
  'tree-planting-drive': 'tree-planting-drive',
  'tree-plantation-drive': 'tree-planting-drive',
  'plantation-drive': 'tree-planting-drive',
  'environmental-drive': 'tree-planting-drive',
  'eco-drive': 'tree-planting-drive',
  'green-drive': 'tree-planting-drive',
  
  // Corporate variations
  'seminar': 'seminar',
  'workshop': 'workshop',
  'training': 'seminar',
  'corporate-party': 'corporate-party',
  'company-party': 'corporate-party',
  'office-party': 'corporate-party',
  'award-ceremony': 'award-ceremony',
  'trade-show': 'trade-show',
  'networking-mixer': 'networking-mixer',
  'webinar': 'online-webinar',
  'leadership-summit': 'leadership-summit',
  'training-workshop': 'training-workshop',
  'hackathon': 'hackathon',
  'investor-meetup': 'investor-meetup',
  'career-expo': 'career-expo',
  'business-networking-event': 'business-networking-event',
  'industry-roundtable': 'industry-roundtable',
  'press-conference': 'press-conference',
  
  // Social variations
  'anniversary': 'anniversary',
  'baby-shower': 'baby-shower',
  'housewarming': 'housewarming',
  'bachelor-party': 'bachelor-party',
  'retirement': 'retirement',
  'farewell': 'farewell',
  'graduation-party': 'graduation-party',
  'reunion-party': 'reunion-party',
  'kitty-party': 'kitty-party',
  'pre-wedding-shoot': 'pre-wedding-shoot',
  'bridal-shower': 'bridal-shower',
  'gender-reveal-party': 'gender-reveal-party',
  'milestone-birthday': 'milestone-birthday',
  'family-reunion': 'family-reunion',
  'friendship-day-event': 'friendship-day-event',
  'valentines-day-celebration': 'valentines-day-celebration',
  'adoption-celebration': 'adoption-celebration',
  
  // Festival variations
  'eid-al-fitr': 'eid-al-fitr',
  'eid-al-adha': 'eid-al-adha',
  'christmas-celebration': 'christmas-celebration',
  'new-years-party': 'new-years-party',
  'navratri-garba': 'navratri-garba',
  'ganesh-chaturthi': 'ganesh-chaturthi',
  'raksha-bandhan': 'raksha-bandhan',
  'janmashtami': 'janmashtami',
  'onam': 'onam',
  'durga-puja': 'durga-puja',
  'baisakhi': 'baisakhi',
  'gurupurab': 'gurupurab',
  'makar-sankranti': 'makar-sankranti',
  'easter-celebration': 'easter-celebration',
  
  // Religious variations
  'puja-ceremony': 'puja-ceremony',
  'kirtan': 'kirtan',
  'meditation-session': 'meditation-session',
  'satsang': 'meditation-session',
  'religious-discourse': 'seminar',
  'temple-inauguration': 'conference',
  'spiritual-retreat': 'yoga-festival',
  'yoga-workshop': 'yoga-festival',
  'religious-procession': 'diwali-celebration',
  'prayer-meeting': 'puja-ceremony',
  'community-service': 'community-cleanup',
  'religious-festival': 'diwali-celebration',
  'pilgrimage-tour': 'workshop',
  'blessing-ceremony': 'puja-ceremony',
  'sacred-thread-ceremony': 'puja-ceremony',
  
  // Cultural variations
  'folk-dance-performance': 'folk-dance-performance',
  'classical-music-concert': 'classical-music-concert',
  'cultural-exchange': 'conference',
  'traditional-craft-workshop': 'traditional-craft-workshop',
  'language-festival': 'conference',
  'handicraft-exhibition': 'conference',
  'cultural-parade': 'diwali-celebration',
  'ethnic-wear-show': 'dance-performance',
  'regional-cuisine-fest': 'food-festival',
  'tribal-art-exhibition': 'conference',
  'folk-music-festival': 'classical-music-concert',
  'cultural-documentary-screening': 'conference',
  'traditional-games-tournament': 'sports-tournament',
  'cultural-storytelling-session': 'workshop',
  
  // Entertainment variations
  'dance-performance': 'dance-performance',
  'comedy-show': 'comedy-show',
  'theater-play': 'theater-play',
  'fashion-show': 'fashion-show',
  'magic-show': 'magic-show',
  'puppet-show': 'puppet-show',
  'storytelling-session': 'storytelling-session',
  'karaoke-night': 'karaoke-night',
  'open-mic-night': 'open-mic-night',
  'film-screening': 'film-screening',
  'poetry-reading': 'poetry-reading',
  'art-workshop': 'art-workshop',
  'dance-workshop': 'dance-workshop',
  'music-workshop': 'music-workshop',
  'celebrity-meet-greet': 'celebrity-meet-greet',
  
  // Community variations
  'neighborhood-gathering': 'neighborhood-gathering',
  'community-cleanup': 'community-cleanup',
  'awareness-rally': 'awareness-rally',
  'volunteer-appreciation': 'volunteer-appreciation',
  'fundraising-gala': 'fundraising-gala',
  'social-cause-event': 'social-cause-event',
  'community-festival': 'community-festival',
  'senior-citizen-program': 'senior-citizen-program',
  'youth-development-program': 'youth-development-program',
  
  // Health variations
  'blood-donation-drive': 'blood-donation-drive',
  'wellness-workshop': 'wellness-workshop',
  'mental-health-seminar': 'mental-health-seminar',
  'nutrition-awareness-program': 'nutrition-awareness-program',
  'health-screening': 'health-camp',
  'medical-conference': 'medical-conference',
  'vaccination-drive': 'vaccination-drive',
  'health-awareness-campaign': 'health-awareness-campaign',
  
  // Sports variations
  'cycling-event': 'cycling-event',
  'obstacle-course-race': 'obstacle-course-race',
  'adventure-camp': 'adventure-camp',
  'sports-day': 'sports-day',
  'e-sports-tournament': 'e-sports-tournament',
  
  // Political variations
  'political-rally': 'political-rally',
  'election-campaign': 'election-campaign',
  'political-conference': 'political-conference',
  'party-convention': 'party-convention',
  'swearing-in-ceremony': 'swearing-in-ceremony',
  'political-summit': 'political-summit',
  'independence-day-rally': 'independence-day-rally',
  'republic-day-parade': 'republic-day-parade',
  'community-town-hall': 'community-town-hall',
  'labor-day-rally': 'labor-day-rally',
  
  // Educational variations
  'lecture-series': 'lecture-series',
  'school-annual-day': 'school-annual-day',
  'academic-symposium': 'academic-symposium',
  'research-conference': 'research-conference',
  'debate-competition': 'debate-competition',
  'quiz-contest': 'quiz-contest',
  'literary-festival': 'literary-festival',
  
  // Virtual variations
  'virtual-conference': 'virtual-conference',
  'live-stream-party': 'live-stream-party',
  'virtual-team-building-event': 'virtual-team-building-event',
  'online-product-launch': 'online-product-launch',
  'virtual-charity-auction': 'virtual-charity-auction',
  'hybrid-festival-celebration': 'hybrid-festival-celebration'
};

// Optimized function with better error handling and fallback logic
export const getRequirementsForEvent = (eventType: string, subsectionId: string): any => {
  try {
    // Normalize the subsection ID
    const normalizedId = subsectionId.toLowerCase().replace(/[\s-]+/g, '-');
    
    // First try exact subsection match
    if (eventSpecificRequirements[subsectionId]) {
      return eventSpecificRequirements[subsectionId];
    }
    
    // Try normalized ID
    if (eventSpecificRequirements[normalizedId]) {
      return eventSpecificRequirements[normalizedId];
    }
    
    // Check event mappings
    if (eventMappings[normalizedId] && eventSpecificRequirements[eventMappings[normalizedId]]) {
      return eventSpecificRequirements[eventMappings[normalizedId]];
    }
    
    // Check for partial matches
    const partialMatch = Object.keys(eventSpecificRequirements).find(key => 
      normalizedId.includes(key) || key.includes(normalizedId)
    );
    
    if (partialMatch) {
      return eventSpecificRequirements[partialMatch];
    }
    
    // Keyword-based matching
    const keywords = {
      'tree-planting-drive': ['tree', 'plant', 'plantation', 'environmental', 'eco', 'green'],
      'wedding': ['wedding', 'marriage', 'bridal', 'engagement'],
      'birthday': ['birthday', 'party', 'celebration'],
      'conference': ['conference', 'meeting', 'summit'],
      'seminar': ['seminar', 'workshop', 'training'],
      'sports-tournament': ['sports', 'tournament', 'competition'],
      'health-camp': ['health', 'medical', 'wellness'],
      'online-webinar': ['webinar', 'online', 'virtual']
    };
    
    for (const [eventKey, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => normalizedId.includes(keyword))) {
        return eventSpecificRequirements[eventKey] || getDefaultRequirements();
      }
    }
    
    // Return default requirements
    return getDefaultRequirements();
  } catch (error) {
    console.warn('Error getting requirements for event:', error);
    return getDefaultRequirements();
  }
};

// Centralized default requirements function
const getDefaultRequirements = () => ({
  'Essential Services': [
    ...commonRequirements.photography.slice(0, 1),
    ...commonRequirements.coordination.slice(0, 1),
    ...commonRequirements.decoration.slice(0, 1)
  ],
  'Catering Services': commonRequirements.catering,
  'Technical Support': commonRequirements.technical,
  'Support Services': [
    { id: 'security-services', label: 'Security Services', category: 'other', unit: 'guards', placeholder: 'How many security guards?' },
    { id: 'transportation', label: 'Transportation', category: 'transportation', unit: 'vehicles', placeholder: 'How many vehicles?' },
    { id: 'cleanup-services', label: 'Cleanup Services', category: 'other' }
  ]
});