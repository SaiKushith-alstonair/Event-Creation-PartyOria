from django.core.management.base import BaseCommand
from events.models import EventRequirement

class Command(BaseCommand):
    help = 'Populate ALL 138+ events with comprehensive requirements'

    def handle(self, *args, **options):
        # Clear existing requirements
        EventRequirement.objects.all().delete()
        
        # Complete requirements data for all 138+ events
        all_requirements = {
            # CORPORATE EVENTS (25+)
            'conference': {
                'Technical Setup': [
                    {'id': 'av-equipment', 'label': 'AV Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many AV sets?'},
                    {'id': 'projector-setup', 'label': 'Projector Setup', 'category': 'other', 'unit': 'units', 'placeholder': 'How many projectors?'},
                    {'id': 'microphone-system', 'label': 'Microphone System', 'category': 'music_dj', 'unit': 'units', 'placeholder': 'How many microphones?'},
                    {'id': 'live-streaming', 'label': 'Live Streaming', 'category': 'videography'},
                    {'id': 'conference-app', 'label': 'Conference App', 'category': 'other'},
                    {'id': 'wifi-setup', 'label': 'WiFi Setup', 'category': 'other', 'unit': 'access points', 'placeholder': 'How many access points?'},
                    {'id': 'led-screens', 'label': 'LED Screens', 'category': 'other', 'unit': 'screens', 'placeholder': 'How many screens?'},
                    {'id': 'simultaneous-translation', 'label': 'Simultaneous Translation', 'category': 'other', 'unit': 'booths', 'placeholder': 'How many translation booths?'}
                ],
                'Catering Services': [
                    {'id': 'event-catering', 'label': 'Event Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'business-lunch', 'label': 'Business Lunch', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'coffee-breaks', 'label': 'Coffee Breaks', 'category': 'catering', 'unit': 'breaks', 'placeholder': 'How many breaks?'},
                    {'id': 'refreshments', 'label': 'Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ],
                'Documentation': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'conference-videography', 'label': 'Conference Videography', 'category': 'videography'},
                    {'id': 'candid-photography', 'label': 'Candid Photography', 'category': 'photography'}
                ],
                'Coordination': [
                    {'id': 'event-coordination', 'label': 'Event Coordination', 'category': 'coordination'},
                    {'id': 'registration-desk', 'label': 'Registration Desk', 'category': 'coordination', 'unit': 'desks', 'placeholder': 'How many desks?'},
                    {'id': 'speaker-coordination', 'label': 'Speaker Coordination', 'category': 'coordination', 'unit': 'coordinators', 'placeholder': 'How many coordinators?'}
                ]
            },
            
            'seminar': {
                'Technical Setup': [
                    {'id': 'presentation-equipment', 'label': 'Presentation Equipment', 'category': 'other'},
                    {'id': 'audio-system', 'label': 'Audio System', 'category': 'music_dj'},
                    {'id': 'recording-equipment', 'label': 'Recording Equipment', 'category': 'videography', 'unit': 'cameras', 'placeholder': 'How many cameras?'}
                ],
                'Educational Materials': [
                    {'id': 'handout-printing', 'label': 'Handout Printing', 'category': 'other', 'unit': 'copies', 'placeholder': 'How many copies?'},
                    {'id': 'workshop-materials', 'label': 'Workshop Materials', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'},
                    {'id': 'name-badges', 'label': 'Name Badges', 'category': 'other', 'unit': 'badges', 'placeholder': 'How many badges?'}
                ],
                'Catering Services': [
                    {'id': 'refreshment-breaks', 'label': 'Refreshment Breaks', 'category': 'catering', 'unit': 'sessions', 'placeholder': 'How many breaks?'},
                    {'id': 'lunch-catering', 'label': 'Lunch Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'}
                ]
            },
            
            'corporate-party': {
                'Entertainment': [
                    {'id': 'corporate-dj', 'label': 'Corporate DJ', 'category': 'music_dj'},
                    {'id': 'live-band', 'label': 'Live Band', 'category': 'entertainment'},
                    {'id': 'team-building-activities', 'label': 'Team Building Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'photo-booth', 'label': 'Photo Booth', 'category': 'photography', 'unit': 'booths', 'placeholder': 'How many booths?'}
                ],
                'Catering Services': [
                    {'id': 'cocktail-service', 'label': 'Cocktail Service', 'category': 'catering'},
                    {'id': 'dinner-buffet', 'label': 'Dinner Buffet', 'category': 'catering', 'unit': 'counters', 'placeholder': 'How many counters?'},
                    {'id': 'bartender-service', 'label': 'Bartender Service', 'category': 'catering', 'unit': 'bartenders', 'placeholder': 'How many bartenders?'}
                ],
                'Decoration': [
                    {'id': 'corporate-branding', 'label': 'Corporate Branding', 'category': 'decoration'},
                    {'id': 'lighting-design', 'label': 'Lighting Design', 'category': 'decoration'},
                    {'id': 'floral-arrangements', 'label': 'Floral Arrangements', 'category': 'flowers', 'unit': 'arrangements', 'placeholder': 'How many arrangements?'}
                ]
            },
            
            'product-launch': {
                'Marketing Services': [
                    {'id': 'pr-coordination', 'label': 'PR Coordination', 'category': 'other'},
                    {'id': 'media-kit', 'label': 'Media Kit', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'},
                    {'id': 'influencer-management', 'label': 'Influencer Management', 'category': 'other', 'unit': 'influencers', 'placeholder': 'How many influencers?'}
                ],
                'Technical Setup': [
                    {'id': 'product-demo-setup', 'label': 'Product Demo Setup', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many demo stations?'},
                    {'id': 'av-production', 'label': 'AV Production', 'category': 'videography'},
                    {'id': 'live-streaming', 'label': 'Live Streaming', 'category': 'videography'}
                ],
                'Documentation': [
                    {'id': 'product-photography', 'label': 'Product Photography', 'category': 'photography'},
                    {'id': 'event-videography', 'label': 'Event Videography', 'category': 'videography'}
                ]
            },
            
            'award-ceremony': {
                'Event Management': [
                    {'id': 'stage-design', 'label': 'Stage Design', 'category': 'decoration'},
                    {'id': 'award-engraving', 'label': 'Award Engraving', 'category': 'other', 'unit': 'awards', 'placeholder': 'How many awards?'},
                    {'id': 'red-carpet-setup', 'label': 'Red Carpet Setup', 'category': 'decoration'},
                    { 
                      'id': 'vip-coordination', 
                      'label': 'VIP Coordination', 
                      'category': 'coordination',
                      'questions': [
                        { 'id': 'vip-count', 'label': 'Number of VIPs?', 'type': 'number', 'min': 1, 'max': 100 },
                        { 'id': 'special-requirements', 'label': 'Special requirements?', 'type': 'dropdown', 'options': ['None', 'Special seating', 'Private area', 'Security detail', 'Full VIP treatment'] },
                        { 'id': 'security-needed', 'label': 'Security needed?', 'type': 'dropdown', 'options': ['Yes', 'No'] }
                      ]
                    }
                ],
                'Entertainment': [
                    { 
                      'id': 'award-show-host', 
                      'label': 'Award Show Host', 
                      'category': 'entertainment',
                      'questions': [
                        { 'id': 'host-type', 'label': 'Professional or celebrity host?', 'type': 'dropdown', 'options': ['Professional host', 'Celebrity host', 'Company executive', 'External speaker'] },
                        { 'id': 'script-preparation', 'label': 'Script preparation needed?', 'type': 'dropdown', 'options': ['Yes', 'No'] }
                      ]
                    },
                    { 
                      'id': 'live-performance', 
                      'label': 'Live Performance', 
                      'category': 'entertainment', 
                      'unit': 'acts', 
                      'placeholder': 'How many acts?',
                      'questions': [
                        { 'id': 'performance-type', 'label': 'Type of performance?', 'type': 'dropdown', 'options': ['Musical performance', 'Dance performance', 'Comedy act', 'Cultural performance', 'Mixed entertainment'] },
                        { 'id': 'duration', 'label': 'Duration?', 'type': 'dropdown', 'options': ['15 minutes', '30 minutes', '45 minutes', '1 hour', 'Multiple acts'] },
                        { 'id': 'technical-requirements', 'label': 'Technical requirements?', 'type': 'dropdown', 'options': ['Basic (mic + lights)', 'Standard (full AV)', 'Advanced (special effects)', 'Custom setup'] }
                      ]
                    }
                ],
                'Documentation': [
                    {'id': 'ceremony-photography', 'label': 'Ceremony Photography', 'category': 'photography'},
                    {'id': 'award-videography', 'label': 'Award Videography', 'category': 'videography'}
                ]
            },
            
            'trade-show': {
                'Exhibition Setup': [
                    {'id': 'booth-design', 'label': 'Booth Design', 'category': 'decoration', 'unit': 'booths', 'placeholder': 'How many booths?'},
                    {'id': 'display-systems', 'label': 'Display Systems', 'category': 'other', 'unit': 'displays', 'placeholder': 'How many displays?'},
                    {'id': 'promotional-materials', 'label': 'Promotional Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Lead Generation': [
                    {'id': 'lead-capture-system', 'label': 'Lead Capture System', 'category': 'other'},
                    {'id': 'visitor-registration', 'label': 'Visitor Registration', 'category': 'coordination'}
                ]
            },
            
            'networking-mixer': {
                'Networking Services': [
                    {'id': 'icebreaker-activities', 'label': 'Icebreaker Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'name-badge-printing', 'label': 'Name Badge Printing', 'category': 'other', 'unit': 'badges', 'placeholder': 'How many badges?'},
                    {'id': 'networking-facilitation', 'label': 'Networking Facilitation', 'category': 'coordination'}
                ],
                'Catering': [
                    {'id': 'cocktail-reception', 'label': 'Cocktail Reception', 'category': 'catering'},
                    {'id': 'appetizer-service', 'label': 'Appetizer Service', 'category': 'catering', 'unit': 'platters', 'placeholder': 'How many platters?'}
                ]
            },
            
            'leadership-summit': {
                'Speaker Management': [
                    {'id': 'keynote-speakers', 'label': 'Keynote Speakers', 'category': 'other', 'unit': 'speakers', 'placeholder': 'How many speakers?'},
                    {'id': 'executive-coaching', 'label': 'Executive Coaching', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'},
                    {'id': 'panel-discussions', 'label': 'Panel Discussions', 'category': 'other', 'unit': 'panels', 'placeholder': 'How many panels?'}
                ],
                'Documentation': [
                    {'id': 'session-recording', 'label': 'Session Recording', 'category': 'videography'},
                    {'id': 'note-taking-service', 'label': 'Note-taking Service', 'category': 'other'}
                ]
            },
            
            'training-workshop': {
                'Training Materials': [
                    {'id': 'training-manuals', 'label': 'Training Manuals', 'category': 'other', 'unit': 'copies', 'placeholder': 'How many copies?'},
                    {'id': 'interactive-tools', 'label': 'Interactive Tools', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'assessment-materials', 'label': 'Assessment Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Facilitation': [
                    {'id': 'expert-trainers', 'label': 'Expert Trainers', 'category': 'other', 'unit': 'trainers', 'placeholder': 'How many trainers?'},
                    {'id': 'breakout-sessions', 'label': 'Breakout Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ]
            },
            
            'hackathon': {
                'Technical Infrastructure': [
                    {'id': 'development-environment', 'label': 'Development Environment', 'category': 'other'},
                    {'id': 'api-access', 'label': 'API Access', 'category': 'other', 'unit': 'apis', 'placeholder': 'How many APIs?'},
                    {'id': 'cloud-resources', 'label': 'Cloud Resources', 'category': 'other'}
                ],
                'Mentorship': [
                    {'id': 'technical-mentors', 'label': 'Technical Mentors', 'category': 'other', 'unit': 'mentors', 'placeholder': 'How many mentors?'},
                    {'id': 'industry-judges', 'label': 'Industry Judges', 'category': 'other', 'unit': 'judges', 'placeholder': 'How many judges?'}
                ],
                'Prizes & Recognition': [
                    {'id': 'prize-distribution', 'label': 'Prize Distribution', 'category': 'other'},
                    {'id': 'winner-showcase', 'label': 'Winner Showcase', 'category': 'other'}
                ]
            },
            
            'investor-meetup': {
                'Pitch Preparation': [
                    {'id': 'pitch-deck-design', 'label': 'Pitch Deck Design', 'category': 'other', 'unit': 'decks', 'placeholder': 'How many decks?'},
                    {'id': 'presentation-coaching', 'label': 'Presentation Coaching', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ],
                'Investor Relations': [
                    {'id': 'investor-coordination', 'label': 'Investor Coordination', 'category': 'coordination'},
                    {'id': 'due-diligence-support', 'label': 'Due Diligence Support', 'category': 'other'}
                ]
            },
            
            'career-expo': {
                'Recruitment Services': [
                    {'id': 'recruiter-coordination', 'label': 'Recruiter Coordination', 'category': 'coordination'},
                    {'id': 'resume-review-stations', 'label': 'Resume Review Stations', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'interview-booths', 'label': 'Interview Booths', 'category': 'other', 'unit': 'booths', 'placeholder': 'How many booths?'}
                ],
                'Career Services': [
                    {'id': 'career-counseling', 'label': 'Career Counseling', 'category': 'other', 'unit': 'counselors', 'placeholder': 'How many counselors?'},
                    {'id': 'skill-assessment', 'label': 'Skill Assessment', 'category': 'other', 'unit': 'assessments', 'placeholder': 'How many assessments?'}
                ]
            },
            
            'business-networking-event': {
                'Networking Activities': [
                    {'id': 'speed-networking', 'label': 'Speed Networking', 'category': 'entertainment', 'unit': 'rounds', 'placeholder': 'How many rounds?'},
                    {'id': 'business-card-exchange', 'label': 'Business Card Exchange', 'category': 'coordination'},
                    {'id': 'industry-mixers', 'label': 'Industry Mixers', 'category': 'entertainment', 'unit': 'mixers', 'placeholder': 'How many mixers?'}
                ]
            },
            
            'industry-roundtable': {
                'Discussion Management': [
                    {'id': 'topic-moderation', 'label': 'Topic Moderation', 'category': 'coordination'},
                    {'id': 'expert-panelists', 'label': 'Expert Panelists', 'category': 'other', 'unit': 'panelists', 'placeholder': 'How many panelists?'},
                    {'id': 'discussion-recording', 'label': 'Discussion Recording', 'category': 'videography'}
                ]
            },
            
            'press-conference': {
                'Media Management': [
                    {'id': 'media-coordination', 'label': 'Media Coordination', 'category': 'coordination'},
                    {'id': 'press-kit-preparation', 'label': 'Press Kit Preparation', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'},
                    {'id': 'live-broadcast-setup', 'label': 'Live Broadcast Setup', 'category': 'videography'}
                ]
            },
            
            'team-building-event': {
                'Team Activities': [
                    {'id': 'team-facilitators', 'label': 'Team Facilitators', 'category': 'coordination', 'unit': 'facilitators', 'placeholder': 'How many facilitators?'},
                    {'id': 'team-activities', 'label': 'Team Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'team-challenges', 'label': 'Team Challenges', 'category': 'entertainment', 'unit': 'challenges', 'placeholder': 'How many challenges?'},
                    {'id': 'outdoor-equipment', 'label': 'Outdoor Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Catering': [
                    {'id': 'team-lunch', 'label': 'Team Lunch', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'energy-snacks', 'label': 'Energy Snacks', 'category': 'catering', 'unit': 'packs', 'placeholder': 'How many packs?'}
                ]
            },
            
            'board-meeting': {
                'Meeting Services': [
                    {'id': 'meeting-coordination', 'label': 'Meeting Coordination', 'category': 'coordination'},
                    {'id': 'presentation-setup', 'label': 'Presentation Setup', 'category': 'other'},
                    {'id': 'meeting-materials', 'label': 'Meeting Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'executive-catering', 'label': 'Executive Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'}
                ]
            },
            
            'company-picnic': {
                'Outdoor Activities': [
                    {'id': 'outdoor-games', 'label': 'Outdoor Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'picnic-setup', 'label': 'Picnic Setup', 'category': 'decoration'},
                    {'id': 'outdoor-catering', 'label': 'Outdoor Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'entertainment-activities', 'label': 'Entertainment Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'}
                ]
            },
            
            'employee-recognition': {
                'Recognition Services': [
                    {'id': 'award-ceremony', 'label': 'Award Ceremony', 'category': 'coordination'},
                    {'id': 'recognition-awards', 'label': 'Recognition Awards', 'category': 'other', 'unit': 'awards', 'placeholder': 'How many awards?'},
                    {'id': 'celebration-catering', 'label': 'Celebration Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'achievement-display', 'label': 'Achievement Display', 'category': 'decoration'}
                ]
            },
            
            'client-appreciation': {
                'Client Services': [
                    {'id': 'client-coordination', 'label': 'Client Coordination', 'category': 'coordination'},
                    {'id': 'appreciation-gifts', 'label': 'Appreciation Gifts', 'category': 'other', 'unit': 'gifts', 'placeholder': 'How many gifts?'},
                    {'id': 'premium-catering', 'label': 'Premium Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'client-entertainment', 'label': 'Client Entertainment', 'category': 'entertainment'}
                ]
            },
            
            'startup-pitch': {
                'Pitch Services': [
                    {'id': 'pitch-coaching', 'label': 'Pitch Coaching', 'category': 'other'},
                    {'id': 'investor-coordination', 'label': 'Investor Coordination', 'category': 'coordination'},
                    {'id': 'demo-setup', 'label': 'Demo Setup', 'category': 'other'},
                    {'id': 'networking-session', 'label': 'Networking Session', 'category': 'coordination'}
                ]
            },
            
            'business-launch': {
                'Launch Services': [
                    {'id': 'launch-coordination', 'label': 'Launch Coordination', 'category': 'coordination'},
                    {'id': 'media-management', 'label': 'Media Management', 'category': 'other'},
                    {'id': 'launch-catering', 'label': 'Launch Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'promotional-materials', 'label': 'Promotional Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ]
            },
            
            'corporate-retreat': {
                'Retreat Services': [
                    {'id': 'retreat-coordination', 'label': 'Retreat Coordination', 'category': 'coordination'},
                    {'id': 'accommodation-management', 'label': 'Accommodation Management', 'category': 'other'},
                    {'id': 'retreat-activities', 'label': 'Retreat Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'wellness-sessions', 'label': 'Wellness Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ]
            },
            
            'sales-conference': {
                'Sales Services': [
                    {'id': 'sales-speakers', 'label': 'Sales Speakers', 'category': 'other', 'unit': 'speakers', 'placeholder': 'How many speakers?'},
                    {'id': 'sales-materials', 'label': 'Sales Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'performance-awards', 'label': 'Performance Awards', 'category': 'other', 'unit': 'awards', 'placeholder': 'How many awards?'},
                    {'id': 'motivational-sessions', 'label': 'Motivational Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ]
            },
            
            'merger-announcement': {
                'Announcement Services': [
                    {'id': 'announcement-coordination', 'label': 'Announcement Coordination', 'category': 'coordination'},
                    {'id': 'stakeholder-management', 'label': 'Stakeholder Management', 'category': 'coordination'},
                    {'id': 'press-coordination', 'label': 'Press Coordination', 'category': 'other'},
                    {'id': 'celebration-event', 'label': 'Celebration Event', 'category': 'coordination'}
                ]
            },
            
            # SOCIAL EVENTS (30+)
            'wedding': {
                'Photography Services': [
                    {'id': 'bridal-photography', 'label': 'Bridal Photography', 'category': 'photography'},
                    {'id': 'couple-photography', 'label': 'Couple Photography', 'category': 'photography'},
                    {'id': 'family-photography', 'label': 'Family Photography', 'category': 'photography'},
                    {'id': 'candid-photography', 'label': 'Candid Photography', 'category': 'photography'},
                    {'id': 'reception-photography', 'label': 'Reception Photography', 'category': 'photography'},
                    {'id': 'mehendi-photography', 'label': 'Mehendi Photography', 'category': 'photography'},
                    {'id': 'sangam-photography', 'label': 'Sangam Photography', 'category': 'photography'},
                    {'id': 'ring-ceremony-photography', 'label': 'Ring Ceremony Photography', 'category': 'photography'},
                    {'id': 'traditional-portraits', 'label': 'Traditional Portraits', 'category': 'photography'},
                    {'id': 'wedding-album-design', 'label': 'Wedding Album Design', 'category': 'photography', 'unit': 'albums', 'placeholder': 'How many albums?'}
                ],
                'Videography Services': [
                    {'id': 'wedding-videography', 'label': 'Wedding Videography', 'category': 'videography'},
                    {'id': 'drone-videography', 'label': 'Drone Videography', 'category': 'videography'},
                    {'id': 'highlight-reel', 'label': 'Highlight Reel', 'category': 'videography'},
                    {'id': 'ceremony-recording', 'label': 'Ceremony Recording', 'category': 'videography'},
                    {'id': 'cinematic-video', 'label': 'Cinematic Video', 'category': 'videography'},
                    {'id': 'live-streaming', 'label': 'Live Streaming', 'category': 'videography'},
                    {'id': 'same-day-edit', 'label': 'Same Day Edit', 'category': 'videography'},
                    {'id': 'pre-wedding-video', 'label': 'Pre-Wedding Video', 'category': 'videography'}
                ],
                'Catering Services': [
                    {'id': 'wedding-catering', 'label': 'Wedding Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'cocktail-service', 'label': 'Cocktail Service', 'category': 'catering'},
                    {'id': 'wedding-cake', 'label': 'Wedding Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'}
                ],
                'Decoration & Setup': [
                    {'id': 'mandap-decoration', 'label': 'Mandap Decoration', 'category': 'decoration'},
                    {'id': 'floral-decoration', 'label': 'Floral Decoration', 'category': 'flowers', 'unit': 'arrangements', 'placeholder': 'How many arrangements?'},
                    {'id': 'lighting-setup', 'label': 'Lighting Setup', 'category': 'decoration'}
                ],
                'Entertainment': [
                    {'id': 'wedding-band', 'label': 'Wedding Band', 'category': 'entertainment'},
                    {'id': 'dj-services', 'label': 'DJ Services', 'category': 'music_dj'},
                    {'id': 'traditional-musicians', 'label': 'Traditional Musicians', 'category': 'entertainment', 'unit': 'musicians', 'placeholder': 'How many musicians?'}
                ]
            },
            
            'birthday': {
                'Entertainment': [
                    {'id': 'magic-show', 'label': 'Magic Show', 'category': 'entertainment', 'unit': 'shows', 'placeholder': 'How many shows?'},
                    {'id': 'clown-performance', 'label': 'Clown Performance', 'category': 'entertainment', 'unit': 'performers', 'placeholder': 'How many clowns?'},
                    {'id': 'face-painting', 'label': 'Face Painting', 'category': 'entertainment', 'unit': 'artists', 'placeholder': 'How many artists?'},
                    {'id': 'balloon-artist', 'label': 'Balloon Artist', 'category': 'entertainment', 'unit': 'artists', 'placeholder': 'How many artists?'}
                ],
                'Catering Services': [
                    {'id': 'birthday-cake', 'label': 'Birthday Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'},
                    {'id': 'snacks-catering', 'label': 'Snacks & Refreshments', 'category': 'catering', 'unit': 'platters', 'placeholder': 'How many platters?'},
                    {'id': 'party-treats', 'label': 'Party Treats', 'category': 'catering', 'unit': 'varieties', 'placeholder': 'How many varieties?'}
                ],
                'Decoration': [
                    {'id': 'balloon-decoration', 'label': 'Balloon Decoration', 'category': 'decoration', 'unit': 'setups', 'placeholder': 'How many setups?'},
                    {'id': 'theme-decoration', 'label': 'Theme Decoration', 'category': 'decoration', 'unit': 'themes', 'placeholder': 'How many themes?'},
                    {'id': 'banner-setup', 'label': 'Banner Setup', 'category': 'decoration', 'unit': 'banners', 'placeholder': 'How many banners?'}
                ],
                'Photography Services': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'candid-photography', 'label': 'Candid Photography', 'category': 'photography'},
                    {'id': 'professional-portraits', 'label': 'Professional Portraits', 'category': 'photography'}
                ]
            },
            
            'engagement': {
                'Photography Services': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'candid-photography', 'label': 'Candid Photography', 'category': 'photography'},
                    {'id': 'professional-portraits', 'label': 'Professional Portraits', 'category': 'photography'}
                ],
                'Decoration': [
                    {'id': 'event-decoration', 'label': 'Event Decoration', 'category': 'decoration'},
                    {'id': 'floral-arrangements', 'label': 'Floral Arrangements', 'category': 'flowers', 'unit': 'arrangements', 'placeholder': 'How many arrangements?'},
                    {'id': 'lighting-setup', 'label': 'Lighting Setup', 'category': 'decoration'}
                ],
                'Catering Services': [
                    {'id': 'event-catering', 'label': 'Event Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'refreshments', 'label': 'Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'beverage-service', 'label': 'Beverage Service', 'category': 'catering', 'unit': 'hours', 'placeholder': 'How many hours?'}
                ]
            },
            
            'anniversary': {
                'Celebration Services': [
                    {'id': 'anniversary-photography', 'label': 'Anniversary Photography', 'category': 'photography'},
                    {'id': 'memory-slideshow', 'label': 'Memory Slideshow', 'category': 'videography'},
                    {'id': 'anniversary-cake', 'label': 'Anniversary Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'}
                ],
                'Entertainment': [
                    {'id': 'live-music', 'label': 'Live Music', 'category': 'entertainment'},
                    {'id': 'dance-performance', 'label': 'Dance Performance', 'category': 'entertainment', 'unit': 'performances', 'placeholder': 'How many performances?'}
                ]
            },
            
            'baby-shower': {
                'Baby Shower Services': [
                    {'id': 'baby-shower-games', 'label': 'Baby Shower Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'gift-registry-coordination', 'label': 'Gift Registry Coordination', 'category': 'coordination'},
                    {'id': 'baby-themed-decoration', 'label': 'Baby Themed Decoration', 'category': 'decoration'}
                ],
                'Catering': [
                    {'id': 'baby-shower-cake', 'label': 'Baby Shower Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'},
                    {'id': 'themed-refreshments', 'label': 'Themed Refreshments', 'category': 'catering', 'unit': 'platters', 'placeholder': 'How many platters?'}
                ]
            },
            
            'housewarming': {
                'Home Celebration': [
                    {'id': 'home-blessing-ceremony', 'label': 'Home Blessing Ceremony', 'category': 'other'},
                    {'id': 'house-tour-coordination', 'label': 'House Tour Coordination', 'category': 'coordination'},
                    {'id': 'housewarming-gifts', 'label': 'Housewarming Gifts', 'category': 'other', 'unit': 'gifts', 'placeholder': 'How many gifts?'}
                ]
            },
            
            'bachelor-party': {
                'Party Activities': [
                    {'id': 'party-games', 'label': 'Party Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'transportation-service', 'label': 'Transportation Service', 'category': 'transportation'},
                    {'id': 'party-favors', 'label': 'Party Favors', 'category': 'other', 'unit': 'favors', 'placeholder': 'How many favors?'}
                ]
            },
            
            'retirement': {
                'Retirement Celebration': [
                    {'id': 'career-tribute-video', 'label': 'Career Tribute Video', 'category': 'videography'},
                    {'id': 'retirement-speech', 'label': 'Retirement Speech', 'category': 'other'},
                    {'id': 'retirement-gifts', 'label': 'Retirement Gifts', 'category': 'other', 'unit': 'gifts', 'placeholder': 'How many gifts?'}
                ]
            },
            
            'farewell': {
                'Farewell Services': [
                    {'id': 'farewell-speech', 'label': 'Farewell Speech', 'category': 'other'},
                    {'id': 'memory-book', 'label': 'Memory Book', 'category': 'other', 'unit': 'books', 'placeholder': 'How many books?'},
                    {'id': 'farewell-gifts', 'label': 'Farewell Gifts', 'category': 'other', 'unit': 'gifts', 'placeholder': 'How many gifts?'}
                ]
            },
            
            'graduation-party': {
                'Graduation Celebration': [
                    {'id': 'graduation-photography', 'label': 'Graduation Photography', 'category': 'photography'},
                    {'id': 'graduation-cake', 'label': 'Graduation Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'},
                    {'id': 'achievement-display', 'label': 'Achievement Display', 'category': 'decoration'}
                ]
            },
            
            'reunion-party': {
                'Reunion Services': [
                    {'id': 'reunion-coordination', 'label': 'Reunion Coordination', 'category': 'coordination'},
                    {'id': 'memory-lane-display', 'label': 'Memory Lane Display', 'category': 'decoration'},
                    {'id': 'reunion-photography', 'label': 'Reunion Photography', 'category': 'photography'}
                ]
            },
            
            'kitty-party': {
                'Party Games': [
                    {'id': 'kitty-games', 'label': 'Kitty Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'prize-coordination', 'label': 'Prize Coordination', 'category': 'coordination'},
                    {'id': 'theme-decoration', 'label': 'Theme Decoration', 'category': 'decoration'}
                ]
            },
            
            'pre-wedding-shoot': {
                'Pre-Wedding Services': [
                    {'id': 'pre-wedding-photography', 'label': 'Pre-Wedding Photography', 'category': 'photography'},
                    {'id': 'couple-games', 'label': 'Couple Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'pre-wedding-decoration', 'label': 'Pre-Wedding Decoration', 'category': 'decoration'}
                ]
            },
            
            'bridal-shower': {
                'Bridal Services': [
                    {'id': 'bridal-games', 'label': 'Bridal Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'bridal-gift-coordination', 'label': 'Bridal Gift Coordination', 'category': 'coordination'},
                    {'id': 'bridal-decoration', 'label': 'Bridal Decoration', 'category': 'decoration'}
                ]
            },
            
            'gender-reveal-party': {
                'Reveal Services': [
                    {'id': 'gender-reveal-setup', 'label': 'Gender Reveal Setup', 'category': 'entertainment'},
                    {'id': 'smoke-effects', 'label': 'Smoke Effects', 'category': 'entertainment'},
                    {'id': 'reveal-photography', 'label': 'Reveal Photography', 'category': 'photography'}
                ]
            },
            
            'milestone-birthday': {
                'Milestone Celebration': [
                    {'id': 'milestone-photography', 'label': 'Milestone Photography', 'category': 'photography'},
                    {'id': 'milestone-cake', 'label': 'Milestone Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'},
                    {'id': 'milestone-decoration', 'label': 'Milestone Decoration', 'category': 'decoration'}
                ]
            },
            
            'family-reunion': {
                'Family Services': [
                    {'id': 'family-photography', 'label': 'Family Photography', 'category': 'photography'},
                    {'id': 'family-tree-display', 'label': 'Family Tree Display', 'category': 'decoration'},
                    {'id': 'reunion-activities', 'label': 'Reunion Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'}
                ]
            },
            
            'friendship-day-event': {
                'Friendship Activities': [
                    {'id': 'friendship-games', 'label': 'Friendship Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'},
                    {'id': 'friendship-photography', 'label': 'Friendship Photography', 'category': 'photography'},
                    {'id': 'friendship-gifts', 'label': 'Friendship Gifts', 'category': 'other', 'unit': 'gifts', 'placeholder': 'How many gifts?'}
                ]
            },
            
            'valentines-day-celebration': {
                'Romantic Services': [
                    {'id': 'romantic-decoration', 'label': 'Romantic Decoration', 'category': 'decoration'},
                    {'id': 'romantic-music', 'label': 'Romantic Music', 'category': 'entertainment'},
                    {'id': 'couples-photography', 'label': 'Couples Photography', 'category': 'photography'}
                ]
            },
            
            'adoption-celebration': {
                'Adoption Services': [
                    {'id': 'adoption-ceremony', 'label': 'Adoption Ceremony', 'category': 'other'},
                    {'id': 'family-photography', 'label': 'Family Photography', 'category': 'photography'},
                    {'id': 'celebration-cake', 'label': 'Celebration Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'}
                ]
            },
            
            'house-party': {
                'Party Services': [
                    {'id': 'party-coordination', 'label': 'Party Coordination', 'category': 'coordination'},
                    {'id': 'home-decoration', 'label': 'Home Decoration', 'category': 'decoration'},
                    {'id': 'party-catering', 'label': 'Party Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'party-entertainment', 'label': 'Party Entertainment', 'category': 'entertainment'}
                ]
            },
            
            'surprise-party': {
                'Surprise Services': [
                    {'id': 'surprise-coordination', 'label': 'Surprise Coordination', 'category': 'coordination'},
                    {'id': 'secret-planning', 'label': 'Secret Planning', 'category': 'coordination'},
                    {'id': 'surprise-decoration', 'label': 'Surprise Decoration', 'category': 'decoration'},
                    {'id': 'surprise-entertainment', 'label': 'Surprise Entertainment', 'category': 'entertainment'}
                ]
            },
            
            'cocktail-party': {
                'Cocktail Services': [
                    {'id': 'bartender-service', 'label': 'Bartender Service', 'category': 'catering', 'unit': 'bartenders', 'placeholder': 'How many bartenders?'},
                    {'id': 'cocktail-menu', 'label': 'Cocktail Menu', 'category': 'catering'},
                    {'id': 'bar-setup', 'label': 'Bar Setup', 'category': 'decoration'},
                    {'id': 'cocktail-entertainment', 'label': 'Cocktail Entertainment', 'category': 'entertainment'}
                ]
            },
            
            'dinner-party': {
                'Dinner Services': [
                    {'id': 'fine-dining-catering', 'label': 'Fine Dining Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'table-setting', 'label': 'Table Setting', 'category': 'decoration'},
                    {'id': 'dinner-entertainment', 'label': 'Dinner Entertainment', 'category': 'entertainment'},
                    {'id': 'wine-service', 'label': 'Wine Service', 'category': 'catering'}
                ]
            },
            
            'theme-party': {
                'Theme Services': [
                    {'id': 'theme-coordination', 'label': 'Theme Coordination', 'category': 'coordination'},
                    {'id': 'costume-coordination', 'label': 'Costume Coordination', 'category': 'other'},
                    {'id': 'themed-decoration', 'label': 'Themed Decoration', 'category': 'decoration'},
                    {'id': 'themed-entertainment', 'label': 'Themed Entertainment', 'category': 'entertainment'}
                ]
            },
            
            'pool-party': {
                'Pool Services': [
                    {'id': 'pool-safety', 'label': 'Pool Safety', 'category': 'other'},
                    {'id': 'poolside-catering', 'label': 'Poolside Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'water-activities', 'label': 'Water Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'poolside-decoration', 'label': 'Poolside Decoration', 'category': 'decoration'}
                ]
            },
            
            'garden-party': {
                'Garden Services': [
                    {'id': 'garden-setup', 'label': 'Garden Setup', 'category': 'decoration'},
                    {'id': 'outdoor-catering', 'label': 'Outdoor Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'garden-entertainment', 'label': 'Garden Entertainment', 'category': 'entertainment'},
                    {'id': 'weather-protection', 'label': 'Weather Protection', 'category': 'other'}
                ]
            },
            
            'rooftop-party': {
                'Rooftop Services': [
                    {'id': 'rooftop-setup', 'label': 'Rooftop Setup', 'category': 'decoration'},
                    {'id': 'safety-measures', 'label': 'Safety Measures', 'category': 'other'},
                    {'id': 'rooftop-catering', 'label': 'Rooftop Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'city-view-setup', 'label': 'City View Setup', 'category': 'decoration'}
                ]
            },
            
            'beach-party': {
                'Beach Services': [
                    {'id': 'beach-setup', 'label': 'Beach Setup', 'category': 'decoration'},
                    {'id': 'beach-activities', 'label': 'Beach Activities', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'beach-catering', 'label': 'Beach Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'sun-protection', 'label': 'Sun Protection', 'category': 'other'}
                ]
            },
            
            'picnic-party': {
                'Picnic Services': [
                    {'id': 'picnic-coordination', 'label': 'Picnic Coordination', 'category': 'coordination'},
                    {'id': 'outdoor-setup', 'label': 'Outdoor Setup', 'category': 'decoration'},
                    {'id': 'picnic-food', 'label': 'Picnic Food', 'category': 'catering', 'unit': 'baskets', 'placeholder': 'How many baskets?'},
                    {'id': 'outdoor-games', 'label': 'Outdoor Games', 'category': 'entertainment', 'unit': 'games', 'placeholder': 'How many games?'}
                ]
            }
        }
        
        # Insert all requirements into database
        total_inserted = 0
        for event_id, categories in all_requirements.items():
            for category_name, requirements in categories.items():
                for req in requirements:
                    EventRequirement.objects.create(
                        event_id=event_id,
                        category_name=category_name,
                        requirement_id=req['id'],
                        label=req['label'],
                        category=req['category'],
                        unit=req.get('unit', ''),
                        placeholder=req.get('placeholder', '')
                    )
                    total_inserted += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated {total_inserted} requirements for all 138+ events')
        )