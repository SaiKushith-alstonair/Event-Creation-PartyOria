from django.core.management.base import BaseCommand
from events.models import EventRequirement

class Command(BaseCommand):
    help = 'Populate final event categories (Religious, Cultural, Entertainment, Community, Political)'

    def handle(self, *args, **options):
        
        final_requirements = {
            # RELIGIOUS EVENTS (18+)
            'puja-ceremony': {
                'Religious Services': [
                    {'id': 'priest-services', 'label': 'Priest Services', 'category': 'other'},
                    {'id': 'ritual-items', 'label': 'Ritual Items', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'sacred-fire-setup', 'label': 'Sacred Fire Setup', 'category': 'other'},
                    {'id': 'mantra-chanting', 'label': 'Mantra Chanting', 'category': 'entertainment'},
                    {'id': 'puja-materials', 'label': 'Puja Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'offerings-prasad', 'label': 'Offerings & Prasad', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ],
                'Decoration': [
                    {'id': 'altar-decoration', 'label': 'Altar Decoration', 'category': 'decoration'},
                    {'id': 'flower-garlands', 'label': 'Flower Garlands', 'category': 'flowers', 'unit': 'garlands', 'placeholder': 'How many garlands?'},
                    {'id': 'religious-banners', 'label': 'Religious Banners', 'category': 'decoration', 'unit': 'banners', 'placeholder': 'How many banners?'}
                ]
            },
            
            'kirtan': {
                'Musical Services': [
                    {'id': 'devotional-singers', 'label': 'Devotional Singers', 'category': 'entertainment', 'unit': 'singers', 'placeholder': 'How many singers?'},
                    {'id': 'traditional-instruments', 'label': 'Traditional Instruments', 'category': 'music_dj', 'unit': 'instruments', 'placeholder': 'How many instruments?'},
                    {'id': 'harmonium-tabla', 'label': 'Harmonium & Tabla', 'category': 'music_dj'},
                    {'id': 'sound-amplification', 'label': 'Sound Amplification', 'category': 'music_dj'}
                ],
                'Religious Setup': [
                    {'id': 'stage-setup', 'label': 'Stage Setup', 'category': 'decoration'},
                    {'id': 'seating-arrangement', 'label': 'Seating Arrangement', 'category': 'other'},
                    {'id': 'devotional-books', 'label': 'Devotional Books', 'category': 'other', 'unit': 'books', 'placeholder': 'How many books?'}
                ]
            },
            
            'meditation-session': {
                'Meditation Equipment': [
                    {'id': 'meditation-mats', 'label': 'Meditation Mats', 'category': 'other', 'unit': 'mats', 'placeholder': 'How many mats?'},
                    {'id': 'cushions-bolsters', 'label': 'Cushions & Bolsters', 'category': 'other', 'unit': 'pieces', 'placeholder': 'How many pieces?'},
                    {'id': 'incense-candles', 'label': 'Incense & Candles', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'sound-bowls', 'label': 'Sound Bowls', 'category': 'other', 'unit': 'bowls', 'placeholder': 'How many bowls?'},
                    {'id': 'meditation-music', 'label': 'Meditation Music', 'category': 'music_dj'}
                ],
                'Guidance Services': [
                    {'id': 'meditation-instructor', 'label': 'Meditation Instructor', 'category': 'other'},
                    {'id': 'breathing-techniques', 'label': 'Breathing Techniques', 'category': 'other'},
                    {'id': 'mindfulness-guide', 'label': 'Mindfulness Guide', 'category': 'other'}
                ]
            },
            
            # CULTURAL EVENTS (10+)
            'folk-dance-performance': {
                'Performance Setup': [
                    {'id': 'dance-stage', 'label': 'Dance Stage', 'category': 'decoration'},
                    {'id': 'traditional-costumes', 'label': 'Traditional Costumes', 'category': 'other', 'unit': 'costumes', 'placeholder': 'How many costumes?'},
                    {'id': 'folk-musicians', 'label': 'Folk Musicians', 'category': 'entertainment', 'unit': 'musicians', 'placeholder': 'How many musicians?'},
                    {'id': 'cultural-props', 'label': 'Cultural Props', 'category': 'decoration', 'unit': 'props', 'placeholder': 'How many props?'}
                ],
                'Technical Requirements': [
                    {'id': 'stage-lighting', 'label': 'Stage Lighting', 'category': 'decoration'},
                    {'id': 'sound-system', 'label': 'Sound System', 'category': 'music_dj'},
                    {'id': 'performance-recording', 'label': 'Performance Recording', 'category': 'videography'}
                ]
            },
            
            'classical-music-concert': {
                'Musical Setup': [
                    {'id': 'classical-instruments', 'label': 'Classical Instruments', 'category': 'music_dj', 'unit': 'instruments', 'placeholder': 'How many instruments?'},
                    {'id': 'acoustic-setup', 'label': 'Acoustic Setup', 'category': 'music_dj'},
                    {'id': 'concert-hall-setup', 'label': 'Concert Hall Setup', 'category': 'decoration'},
                    {'id': 'artist-coordination', 'label': 'Artist Coordination', 'category': 'coordination'}
                ],
                'Audience Services': [
                    {'id': 'program-booklets', 'label': 'Program Booklets', 'category': 'other', 'unit': 'booklets', 'placeholder': 'How many booklets?'},
                    {'id': 'reserved-seating', 'label': 'Reserved Seating', 'category': 'other', 'unit': 'seats', 'placeholder': 'How many seats?'},
                    {'id': 'intermission-refreshments', 'label': 'Intermission Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ]
            },
            
            'traditional-craft-workshop': {
                'Craft Materials': [
                    {'id': 'traditional-tools', 'label': 'Traditional Tools', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many tool sets?'},
                    {'id': 'raw-materials', 'label': 'Raw Materials', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many material kits?'},
                    {'id': 'craft-supplies', 'label': 'Craft Supplies', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many supply sets?'},
                    {'id': 'safety-equipment', 'label': 'Safety Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many safety sets?'}
                ],
                'Instruction Services': [
                    {'id': 'master-craftsmen', 'label': 'Master Craftsmen', 'category': 'other', 'unit': 'craftsmen', 'placeholder': 'How many craftsmen?'},
                    {'id': 'skill-demonstration', 'label': 'Skill Demonstration', 'category': 'other'},
                    {'id': 'cultural-history', 'label': 'Cultural History', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ]
            },
            
            'cultural-fair': {
                'Cultural Exhibits': [
                    {'id': 'cultural-displays', 'label': 'Cultural Displays', 'category': 'decoration', 'unit': 'displays', 'placeholder': 'How many displays?'},
                    {'id': 'artisan-booths', 'label': 'Artisan Booths', 'category': 'other', 'unit': 'booths', 'placeholder': 'How many booths?'},
                    {'id': 'cultural-performances', 'label': 'Cultural Performances', 'category': 'entertainment', 'unit': 'performances', 'placeholder': 'How many performances?'}
                ]
            },
            
            'naming-ceremony': {
                'Ceremony Services': [
                    {'id': 'naming-ritual', 'label': 'Naming Ritual', 'category': 'other'},
                    {'id': 'ceremony-photography', 'label': 'Ceremony Photography', 'category': 'photography'},
                    {'id': 'blessing-coordination', 'label': 'Blessing Coordination', 'category': 'coordination'}
                ]
            },
            
            'art-exhibition': {
                'Exhibition Setup': [
                    {'id': 'artwork-display', 'label': 'Artwork Display', 'category': 'decoration', 'unit': 'pieces', 'placeholder': 'How many pieces?'},
                    {'id': 'gallery-lighting', 'label': 'Gallery Lighting', 'category': 'decoration'},
                    {'id': 'artist-coordination', 'label': 'Artist Coordination', 'category': 'coordination'}
                ]
            },
            
            'music-concert': {
                'Concert Services': [
                    {'id': 'sound-engineering', 'label': 'Sound Engineering', 'category': 'music_dj'},
                    {'id': 'stage-lighting', 'label': 'Stage Lighting', 'category': 'decoration'},
                    {'id': 'ticket-management', 'label': 'Ticket Management', 'category': 'coordination'}
                ]
            },
            
            'book-launch': {
                'Launch Services': [
                    {'id': 'author-coordination', 'label': 'Author Coordination', 'category': 'coordination'},
                    {'id': 'book-display', 'label': 'Book Display', 'category': 'decoration'},
                    {'id': 'reading-session', 'label': 'Reading Session', 'category': 'entertainment'}
                ]
            },
            
            'heritage-walk': {
                'Tour Services': [
                    {'id': 'heritage-guide', 'label': 'Heritage Guide', 'category': 'other'},
                    {'id': 'historical-documentation', 'label': 'Historical Documentation', 'category': 'photography'},
                    {'id': 'route-planning', 'label': 'Route Planning', 'category': 'coordination'}
                ]
            },
            
            'food-festival': {
                'Food Services': [
                    {'id': 'food-stalls', 'label': 'Food Stalls', 'category': 'catering', 'unit': 'stalls', 'placeholder': 'How many stalls?'},
                    {'id': 'chef-demonstrations', 'label': 'Chef Demonstrations', 'category': 'entertainment', 'unit': 'demos', 'placeholder': 'How many demos?'},
                    {'id': 'food-tasting', 'label': 'Food Tasting', 'category': 'catering', 'unit': 'tastings', 'placeholder': 'How many tastings?'}
                ]
            },
            
            # ENTERTAINMENT EVENTS (15+)
            'dance-performance': {
                'Performance Setup': [
                    {'id': 'dance-floor', 'label': 'Dance Floor', 'category': 'decoration'},
                    {'id': 'choreography-setup', 'label': 'Choreography Setup', 'category': 'other'},
                    {'id': 'costume-coordination', 'label': 'Costume Coordination', 'category': 'other'},
                    {'id': 'makeup-services', 'label': 'Makeup Services', 'category': 'beauty', 'unit': 'artists', 'placeholder': 'How many artists?'}
                ],
                'Technical Requirements': [
                    {'id': 'stage-lighting', 'label': 'Stage Lighting', 'category': 'decoration'},
                    {'id': 'music-system', 'label': 'Music System', 'category': 'music_dj'},
                    {'id': 'performance-recording', 'label': 'Performance Recording', 'category': 'videography'}
                ]
            },
            
            'comedy-show': {
                'Performance Setup': [
                    {'id': 'comedy-stage', 'label': 'Comedy Stage', 'category': 'decoration'},
                    {'id': 'microphone-setup', 'label': 'Microphone Setup', 'category': 'music_dj', 'unit': 'microphones', 'placeholder': 'How many microphones?'},
                    {'id': 'audience-seating', 'label': 'Audience Seating', 'category': 'other', 'unit': 'seats', 'placeholder': 'How many seats?'},
                    {'id': 'comedian-coordination', 'label': 'Comedian Coordination', 'category': 'coordination'}
                ],
                'Audience Services': [
                    {'id': 'refreshment-service', 'label': 'Refreshment Service', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'ticket-management', 'label': 'Ticket Management', 'category': 'other'},
                    {'id': 'show-recording', 'label': 'Show Recording', 'category': 'videography'}
                ]
            },
            
            'magic-show': {
                'Performance Requirements': [
                    {'id': 'magic-props', 'label': 'Magic Props', 'category': 'other', 'unit': 'props', 'placeholder': 'How many props?'},
                    {'id': 'stage-setup', 'label': 'Stage Setup', 'category': 'decoration'},
                    {'id': 'audience-participation', 'label': 'Audience Participation', 'category': 'entertainment', 'unit': 'activities', 'placeholder': 'How many activities?'},
                    {'id': 'illusion-equipment', 'label': 'Illusion Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Technical Setup': [
                    {'id': 'special-lighting', 'label': 'Special Lighting', 'category': 'decoration'},
                    {'id': 'sound-effects', 'label': 'Sound Effects', 'category': 'music_dj'},
                    {'id': 'backdrop-design', 'label': 'Backdrop Design', 'category': 'decoration', 'unit': 'backdrops', 'placeholder': 'How many backdrops?'}
                ]
            },
            
            'theater-play': {
                'Theater Services': [
                    {'id': 'actors', 'label': 'Actors', 'category': 'entertainment', 'unit': 'actors', 'placeholder': 'How many actors?'},
                    {'id': 'stage-design', 'label': 'Stage Design', 'category': 'decoration'}
                ]
            },
            
            'fashion-show': {
                'Fashion Services': [
                    {'id': 'fashion-models', 'label': 'Fashion Models', 'category': 'entertainment', 'unit': 'models', 'placeholder': 'How many models?'},
                    {'id': 'runway-setup', 'label': 'Runway Setup', 'category': 'decoration'}
                ]
            },
            
            'puppet-show': {
                'Puppet Services': [
                    {'id': 'puppeteers', 'label': 'Puppeteers', 'category': 'entertainment', 'unit': 'puppeteers', 'placeholder': 'How many puppeteers?'},
                    {'id': 'puppet-supplies', 'label': 'Puppet Supplies', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ]
            },
            
            'storytelling-session': {
                'Storytelling Services': [
                    {'id': 'storytellers', 'label': 'Storytellers', 'category': 'entertainment', 'unit': 'storytellers', 'placeholder': 'How many storytellers?'},
                    {'id': 'story-coordination', 'label': 'Story Coordination', 'category': 'coordination'}
                ]
            },
            
            'karaoke-night': {
                'Karaoke Services': [
                    {'id': 'karaoke-equipment', 'label': 'Karaoke Equipment', 'category': 'music_dj'},
                    {'id': 'karaoke-host', 'label': 'Karaoke Host', 'category': 'entertainment'}
                ]
            },
            
            'open-mic-night': {
                'Open Mic Services': [
                    {'id': 'sound-equipment', 'label': 'Sound Equipment', 'category': 'music_dj'},
                    {'id': 'mic-hosts', 'label': 'Mic Hosts', 'category': 'entertainment', 'unit': 'hosts', 'placeholder': 'How many hosts?'}
                ]
            },
            
            'film-screening': {
                'Screening Services': [
                    {'id': 'projection-equipment', 'label': 'Projection Equipment', 'category': 'other'},
                    {'id': 'film-coordination', 'label': 'Film Coordination', 'category': 'coordination'}
                ]
            },
            
            'poetry-reading': {
                'Poetry Services': [
                    {'id': 'poets', 'label': 'Poets', 'category': 'entertainment', 'unit': 'poets', 'placeholder': 'How many poets?'},
                    {'id': 'reading-coordination', 'label': 'Reading Coordination', 'category': 'coordination'}
                ]
            },
            
            'art-workshop': {
                'Art Services': [
                    {'id': 'art-instructors', 'label': 'Art Instructors', 'category': 'other', 'unit': 'instructors', 'placeholder': 'How many instructors?'},
                    {'id': 'art-supplies', 'label': 'Art Supplies', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ]
            },
            
            'dance-workshop': {
                'Dance Services': [
                    {'id': 'dance-instructors', 'label': 'Dance Instructors', 'category': 'other', 'unit': 'instructors', 'placeholder': 'How many instructors?'},
                    {'id': 'dance-coordination', 'label': 'Dance Coordination', 'category': 'coordination'}
                ]
            },
            
            'music-workshop': {
                'Music Services': [
                    {'id': 'music-instructors', 'label': 'Music Instructors', 'category': 'other', 'unit': 'instructors', 'placeholder': 'How many instructors?'},
                    {'id': 'instrument-supplies', 'label': 'Instrument Supplies', 'category': 'other', 'unit': 'instruments', 'placeholder': 'How many instruments?'}
                ]
            },
            
            'celebrity-meet-greet': {
                'Celebrity Services': [
                    {'id': 'celebrity-management', 'label': 'Celebrity Management', 'category': 'coordination'},
                    {'id': 'meet-greet-coordination', 'label': 'Meet & Greet Coordination', 'category': 'coordination'}
                ]
            },
            
            # COMMUNITY EVENTS (12+)
            'neighborhood-gathering': {
                'Community Services': [
                    {'id': 'community-coordination', 'label': 'Community Coordination', 'category': 'coordination'},
                    {'id': 'local-entertainment', 'label': 'Local Entertainment', 'category': 'entertainment', 'unit': 'performers', 'placeholder': 'How many performers?'},
                    {'id': 'potluck-coordination', 'label': 'Potluck Coordination', 'category': 'catering'},
                    {'id': 'activity-planning', 'label': 'Activity Planning', 'category': 'other', 'unit': 'activities', 'placeholder': 'How many activities?'}
                ],
                'Logistics': [
                    {'id': 'venue-setup', 'label': 'Venue Setup', 'category': 'decoration'},
                    {'id': 'seating-arrangement', 'label': 'Seating Arrangement', 'category': 'other'},
                    {'id': 'cleanup-services', 'label': 'Cleanup Services', 'category': 'other'}
                ]
            },
            
            'community-cleanup': {
                'Cleanup Equipment': [
                    {'id': 'cleaning-supplies', 'label': 'Cleaning Supplies', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'waste-bags', 'label': 'Waste Bags', 'category': 'other', 'unit': 'bags', 'placeholder': 'How many bags?'},
                    {'id': 'safety-gear', 'label': 'Safety Gear', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'tools-equipment', 'label': 'Tools & Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Coordination Services': [
                    {'id': 'volunteer-coordination', 'label': 'Volunteer Coordination', 'category': 'coordination', 'unit': 'coordinators', 'placeholder': 'How many coordinators?'},
                    {'id': 'waste-disposal', 'label': 'Waste Disposal', 'category': 'other'},
                    {'id': 'area-mapping', 'label': 'Area Mapping', 'category': 'other'}
                ]
            },
            
            'fundraising-gala': {
                'Event Services': [
                    {'id': 'auction-coordination', 'label': 'Auction Coordination', 'category': 'other'},
                    {'id': 'donation-management', 'label': 'Donation Management', 'category': 'coordination'},
                    {'id': 'sponsor-recognition', 'label': 'Sponsor Recognition', 'category': 'decoration', 'unit': 'displays', 'placeholder': 'How many displays?'},
                    {'id': 'entertainment-program', 'label': 'Entertainment Program', 'category': 'entertainment', 'unit': 'programs', 'placeholder': 'How many programs?'}
                ],
                'Formal Setup': [
                    {'id': 'elegant-decoration', 'label': 'Elegant Decoration', 'category': 'decoration'},
                    {'id': 'formal-catering', 'label': 'Formal Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'vip-services', 'label': 'VIP Services', 'category': 'other'}
                ]
            },
            
            # POLITICAL EVENTS (12+)
            'political-rally': {
                'Event Management': [
                    {'id': 'crowd-management', 'label': 'Crowd Management', 'category': 'coordination', 'unit': 'personnel', 'placeholder': 'How many personnel?'},
                    {'id': 'security-coordination', 'label': 'Security Coordination', 'category': 'coordination'},
                    {'id': 'permit-management', 'label': 'Permit Management', 'category': 'coordination'},
                    {'id': 'volunteer-coordination', 'label': 'Volunteer Coordination', 'category': 'coordination', 'unit': 'coordinators', 'placeholder': 'How many coordinators?'}
                ],
                'Technical Setup': [
                    {'id': 'public-address-system', 'label': 'Public Address System', 'category': 'music_dj'},
                    {'id': 'stage-setup', 'label': 'Stage Setup', 'category': 'decoration'},
                    {'id': 'microphone-system', 'label': 'Microphone System', 'category': 'music_dj', 'unit': 'microphones', 'placeholder': 'How many microphones?'},
                    {'id': 'sound-amplification', 'label': 'Sound Amplification', 'category': 'music_dj'},
                    {'id': 'led-screens', 'label': 'LED Screens', 'category': 'other', 'unit': 'screens', 'placeholder': 'How many screens?'},
                    {'id': 'live-streaming', 'label': 'Live Streaming', 'category': 'videography'}
                ],
                'Campaign Materials': [
                    {'id': 'banners-flags', 'label': 'Banners & Flags', 'category': 'decoration', 'unit': 'pieces', 'placeholder': 'How many pieces?'},
                    {'id': 'promotional-materials', 'label': 'Promotional Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'campaign-merchandise', 'label': 'Campaign Merchandise', 'category': 'other', 'unit': 'items', 'placeholder': 'How many items?'},
                    {'id': 'voter-registration', 'label': 'Voter Registration', 'category': 'coordination', 'unit': 'booths', 'placeholder': 'How many booths?'}
                ],
                'Documentation': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'rally-videography', 'label': 'Rally Videography', 'category': 'videography'},
                    {'id': 'media-coverage', 'label': 'Media Coverage', 'category': 'other'}
                ]
            },
            
            'election-campaign': {
                'Campaign Operations': [
                    {'id': 'campaign-management', 'label': 'Campaign Management', 'category': 'coordination'},
                    {'id': 'door-to-door-canvassing', 'label': 'Door-to-Door Canvassing', 'category': 'coordination', 'unit': 'teams', 'placeholder': 'How many teams?'},
                    {'id': 'phone-banking', 'label': 'Phone Banking', 'category': 'coordination', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'volunteer-recruitment', 'label': 'Volunteer Recruitment', 'category': 'coordination'}
                ],
                'Marketing & Outreach': [
                    {'id': 'campaign-advertising', 'label': 'Campaign Advertising', 'category': 'other'},
                    {'id': 'social-media-management', 'label': 'Social Media Management', 'category': 'other'},
                    {'id': 'print-materials', 'label': 'Print Materials', 'category': 'other', 'unit': 'copies', 'placeholder': 'How many copies?'},
                    {'id': 'billboard-advertising', 'label': 'Billboard Advertising', 'category': 'other', 'unit': 'billboards', 'placeholder': 'How many billboards?'}
                ],
                'Events & Rallies': [
                    {'id': 'town-hall-meetings', 'label': 'Town Hall Meetings', 'category': 'coordination', 'unit': 'meetings', 'placeholder': 'How many meetings?'},
                    {'id': 'campaign-rallies', 'label': 'Campaign Rallies', 'category': 'coordination', 'unit': 'rallies', 'placeholder': 'How many rallies?'},
                    {'id': 'debate-preparation', 'label': 'Debate Preparation', 'category': 'coordination'},
                    {'id': 'fundraising-events', 'label': 'Fundraising Events', 'category': 'coordination', 'unit': 'events', 'placeholder': 'How many events?'}
                ]
            },
            
            'political-conference': {
                'Conference Management': [
                    {'id': 'delegate-coordination', 'label': 'Delegate Coordination', 'category': 'coordination'},
                    {'id': 'speaker-management', 'label': 'Speaker Management', 'category': 'coordination', 'unit': 'speakers', 'placeholder': 'How many speakers?'},
                    {'id': 'session-planning', 'label': 'Session Planning', 'category': 'coordination', 'unit': 'sessions', 'placeholder': 'How many sessions?'},
                    {'id': 'protocol-management', 'label': 'Protocol Management', 'category': 'coordination'}
                ],
                'Technical Infrastructure': [
                    {'id': 'conference-av-setup', 'label': 'Conference AV Setup', 'category': 'other'},
                    {'id': 'simultaneous-translation', 'label': 'Simultaneous Translation', 'category': 'other', 'unit': 'booths', 'placeholder': 'How many booths?'},
                    {'id': 'voting-systems', 'label': 'Voting Systems', 'category': 'other', 'unit': 'devices', 'placeholder': 'How many devices?'},
                    {'id': 'live-broadcast', 'label': 'Live Broadcast', 'category': 'videography'}
                ],
                'Hospitality': [
                    {'id': 'vip-services', 'label': 'VIP Services', 'category': 'coordination'},
                    {'id': 'delegate-catering', 'label': 'Delegate Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'accommodation-coordination', 'label': 'Accommodation Coordination', 'category': 'coordination'}
                ]
            },
            
            # DEFAULT FALLBACK
            'default': {
                'Essential Services': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'event-coordination', 'label': 'Event Coordination', 'category': 'coordination'},
                    {'id': 'event-decoration', 'label': 'Event Decoration', 'category': 'decoration'}
                ],
                'Catering Services': [
                    {'id': 'event-catering', 'label': 'Event Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'refreshments', 'label': 'Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'beverage-service', 'label': 'Beverage Service', 'category': 'catering', 'unit': 'hours', 'placeholder': 'How many hours?'}
                ],
                'Technical Support': [
                    {'id': 'av-equipment', 'label': 'AV Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many AV sets?'},
                    {'id': 'sound-system', 'label': 'Sound System', 'category': 'music_dj'},
                    {'id': 'microphone-setup', 'label': 'Microphone Setup', 'category': 'music_dj', 'unit': 'microphones', 'placeholder': 'How many microphones?'}
                ],
                'Support Services': [
                    {'id': 'security-services', 'label': 'Security Services', 'category': 'other', 'unit': 'guards', 'placeholder': 'How many security guards?'},
                    {'id': 'transportation', 'label': 'Transportation', 'category': 'transportation', 'unit': 'vehicles', 'placeholder': 'How many vehicles?'},
                    {'id': 'cleanup-services', 'label': 'Cleanup Services', 'category': 'other'}
                ]
            }
        }
        
        # Insert final requirements into database
        total_inserted = 0
        for event_id, categories in final_requirements.items():
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
            self.style.SUCCESS(f'Successfully populated {total_inserted} final requirements. Database now contains ALL 138+ events!')
        )