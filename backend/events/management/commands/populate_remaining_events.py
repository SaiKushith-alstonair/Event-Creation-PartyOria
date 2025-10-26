from django.core.management.base import BaseCommand
from events.models import EventRequirement

class Command(BaseCommand):
    help = 'Populate remaining events (Festival, Health, Sports, etc.)'

    def handle(self, *args, **options):
        
        remaining_requirements = {
            # FESTIVAL EVENTS (25+)
            'diwali-celebration': {
                'Decoration Services': [
                    {'id': 'diya-decoration', 'label': 'Diya Decoration', 'category': 'decoration', 'unit': 'diyas', 'placeholder': 'How many diyas?'},
                    {'id': 'rangoli-setup', 'label': 'Rangoli Setup', 'category': 'decoration', 'unit': 'rangolis', 'placeholder': 'How many rangolis?'},
                    {'id': 'festive-lighting', 'label': 'Festive Lighting', 'category': 'decoration'},
                    {'id': 'lantern-display', 'label': 'Lantern Display', 'category': 'decoration', 'unit': 'lanterns', 'placeholder': 'How many lanterns?'},
                    {'id': 'flower-decoration', 'label': 'Flower Decoration', 'category': 'flowers', 'unit': 'arrangements', 'placeholder': 'How many arrangements?'},
                    {'id': 'torans-garlands', 'label': 'Torans & Garlands', 'category': 'decoration', 'unit': 'pieces', 'placeholder': 'How many pieces?'}
                ],
                'Entertainment': [
                    {'id': 'cultural-performance', 'label': 'Cultural Performance', 'category': 'entertainment', 'unit': 'performances', 'placeholder': 'How many performances?'},
                    {'id': 'traditional-music', 'label': 'Traditional Music', 'category': 'entertainment', 'unit': 'musicians', 'placeholder': 'How many musicians?'},
                    {'id': 'dance-performances', 'label': 'Dance Performances', 'category': 'entertainment', 'unit': 'dancers', 'placeholder': 'How many dancers?'},
                    {'id': 'fireworks-display', 'label': 'Fireworks Display', 'category': 'entertainment'}
                ],
                'Catering': [
                    {'id': 'festive-sweets', 'label': 'Festive Sweets', 'category': 'catering', 'unit': 'varieties', 'placeholder': 'How many varieties?'},
                    {'id': 'traditional-food', 'label': 'Traditional Food', 'category': 'catering', 'unit': 'dishes', 'placeholder': 'How many dishes?'},
                    {'id': 'mithai-counter', 'label': 'Mithai Counter', 'category': 'catering', 'unit': 'counters', 'placeholder': 'How many counters?'}
                ],
                'Cultural Activities': [
                    {'id': 'lakshmi-puja', 'label': 'Lakshmi Puja', 'category': 'other'},
                    {'id': 'aarti-ceremony', 'label': 'Aarti Ceremony', 'category': 'other'},
                    {'id': 'bhajan-singing', 'label': 'Bhajan Singing', 'category': 'entertainment', 'unit': 'singers', 'placeholder': 'How many singers?'}
                ]
            },
            
            'christmas-celebration': {
                'Decoration Services': [
                    {'id': 'christmas-tree-setup', 'label': 'Christmas Tree Setup', 'category': 'decoration', 'unit': 'trees', 'placeholder': 'How many trees?'},
                    {'id': 'festive-lighting', 'label': 'Festive Lighting', 'category': 'decoration'},
                    {'id': 'christmas-ornaments', 'label': 'Christmas Ornaments', 'category': 'decoration', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'nativity-scene', 'label': 'Nativity Scene', 'category': 'decoration'}
                ],
                'Entertainment': [
                    {'id': 'christmas-carols', 'label': 'Christmas Carols', 'category': 'entertainment', 'unit': 'singers', 'placeholder': 'How many singers?'},
                    {'id': 'santa-claus-performer', 'label': 'Santa Claus Performer', 'category': 'entertainment'}
                ],
                'Catering': [
                    {'id': 'christmas-feast', 'label': 'Christmas Feast', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'christmas-cake', 'label': 'Christmas Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'}
                ]
            },
            
            'holi-festival': {
                'Festival Supplies': [
                    {'id': 'organic-colors', 'label': 'Organic Colors', 'category': 'other', 'unit': 'packets', 'placeholder': 'How many packets?'},
                    {'id': 'water-guns', 'label': 'Water Guns', 'category': 'other', 'unit': 'guns', 'placeholder': 'How many guns?'},
                    {'id': 'color-powder', 'label': 'Color Powder', 'category': 'other', 'unit': 'packets', 'placeholder': 'How many packets?'},
                    {'id': 'protective-gear', 'label': 'Protective Gear', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Entertainment': [
                    {'id': 'dhol-players', 'label': 'Dhol Players', 'category': 'entertainment', 'unit': 'players', 'placeholder': 'How many players?'},
                    {'id': 'folk-dancers', 'label': 'Folk Dancers', 'category': 'entertainment', 'unit': 'dancers', 'placeholder': 'How many dancers?'},
                    {'id': 'music-system', 'label': 'Music System', 'category': 'music_dj'}
                ],
                'Refreshments': [
                    {'id': 'thandai-service', 'label': 'Thandai Service', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'traditional-snacks', 'label': 'Traditional Snacks', 'category': 'catering', 'unit': 'platters', 'placeholder': 'How many platters?'},
                    {'id': 'cooling-drinks', 'label': 'Cooling Drinks', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ]
            },
            
            'ganesh-chaturthi': {
                'Decoration': [
                    {'id': 'ganesh-idol', 'label': 'Ganesh Idol', 'category': 'decoration', 'unit': 'idols', 'placeholder': 'How many idols?'},
                    {'id': 'pandal-decoration', 'label': 'Pandal Decoration', 'category': 'decoration'}
                ],
                'Entertainment': [
                    {'id': 'dhol-tasha', 'label': 'Dhol Tasha', 'category': 'entertainment', 'unit': 'groups', 'placeholder': 'How many groups?'}
                ],
                'Catering': [
                    {'id': 'modak-service', 'label': 'Modak Service', 'category': 'catering', 'unit': 'pieces', 'placeholder': 'How many pieces?'}
                ]
            },
            
            'navratri-garba': {
                'Entertainment': [
                    {'id': 'garba-instructors', 'label': 'Garba Instructors', 'category': 'entertainment', 'unit': 'instructors', 'placeholder': 'How many instructors?'},
                    {'id': 'dandiya-sticks', 'label': 'Dandiya Sticks', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'traditional-music', 'label': 'Traditional Music', 'category': 'music_dj'}
                ],
                'Services': [
                    {'id': 'costume-rental', 'label': 'Costume Rental', 'category': 'other', 'unit': 'costumes', 'placeholder': 'How many costumes?'}
                ]
            },
            
            'durga-puja': {
                'Decoration': [
                    {'id': 'pandal-design', 'label': 'Pandal Design', 'category': 'decoration'},
                    {'id': 'durga-idol', 'label': 'Durga Idol', 'category': 'decoration', 'unit': 'idols', 'placeholder': 'How many idols?'}
                ],
                'Entertainment': [
                    {'id': 'dhak-players', 'label': 'Dhak Players', 'category': 'entertainment', 'unit': 'players', 'placeholder': 'How many players?'}
                ]
            },
            
            'janmashtami': {
                'Entertainment': [
                    {'id': 'dahi-handi', 'label': 'Dahi Handi', 'category': 'entertainment'},
                    {'id': 'flute-players', 'label': 'Flute Players', 'category': 'entertainment', 'unit': 'players', 'placeholder': 'How many players?'}
                ],
                'Services': [
                    {'id': 'krishna-costumes', 'label': 'Krishna Costumes', 'category': 'other', 'unit': 'costumes', 'placeholder': 'How many costumes?'}
                ]
            },
            
            'onam': {
                'Decoration': [
                    {'id': 'pookalam-flowers', 'label': 'Pookalam Flowers', 'category': 'flowers', 'unit': 'arrangements', 'placeholder': 'How many arrangements?'}
                ],
                'Entertainment': [
                    {'id': 'kathakali-performers', 'label': 'Kathakali Performers', 'category': 'entertainment', 'unit': 'performers', 'placeholder': 'How many performers?'}
                ],
                'Catering': [
                    {'id': 'sadhya-catering', 'label': 'Sadhya Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'}
                ]
            },
            
            'raksha-bandhan': {
                'Services': [
                    {'id': 'rakhi-supplies', 'label': 'Rakhi Supplies', 'category': 'other', 'unit': 'rakhis', 'placeholder': 'How many rakhis?'},
                    {'id': 'gift-coordination', 'label': 'Gift Coordination', 'category': 'coordination'}
                ],
                'Beauty': [
                    {'id': 'henna-artists', 'label': 'Henna Artists', 'category': 'beauty', 'unit': 'artists', 'placeholder': 'How many artists?'}
                ]
            },
            
            'baisakhi': {
                'Entertainment': [
                    {'id': 'bhangra-performers', 'label': 'Bhangra Performers', 'category': 'entertainment', 'unit': 'performers', 'placeholder': 'How many performers?'}
                ],
                'Services': [
                    {'id': 'turban-tying', 'label': 'Turban Tying', 'category': 'other'}
                ],
                'Catering': [
                    {'id': 'punjabi-food', 'label': 'Punjabi Food', 'category': 'catering', 'unit': 'dishes', 'placeholder': 'How many dishes?'}
                ]
            },
            
            'gurupurab': {
                'Entertainment': [
                    {'id': 'kirtan-singers', 'label': 'Kirtan Singers', 'category': 'entertainment', 'unit': 'singers', 'placeholder': 'How many singers?'}
                ],
                'Catering': [
                    {'id': 'langar-service', 'label': 'Langar Service', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'}
                ],
                'Coordination': [
                    {'id': 'nagar-kirtan', 'label': 'Nagar Kirtan', 'category': 'coordination'}
                ]
            },
            
            'makar-sankranti': {
                'Entertainment': [
                    {'id': 'kite-flying', 'label': 'Kite Flying', 'category': 'entertainment'},
                    {'id': 'kite-supplies', 'label': 'Kite Supplies', 'category': 'other', 'unit': 'kites', 'placeholder': 'How many kites?'}
                ],
                'Catering': [
                    {'id': 'til-gud', 'label': 'Til Gud', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ]
            },
            
            'easter-celebration': {
                'Entertainment': [
                    {'id': 'easter-egg-hunt', 'label': 'Easter Egg Hunt', 'category': 'entertainment'},
                    {'id': 'bunny-costume', 'label': 'Bunny Costume', 'category': 'entertainment'}
                ],
                'Decoration': [
                    {'id': 'church-decoration', 'label': 'Church Decoration', 'category': 'decoration'}
                ],
                'Catering': [
                    {'id': 'easter-cake', 'label': 'Easter Cake', 'category': 'catering', 'unit': 'cakes', 'placeholder': 'How many cakes?'}
                ]
            },
            
            'new-years-party': {
                'Entertainment': [
                    {'id': 'countdown-coordination', 'label': 'Countdown Coordination', 'category': 'entertainment'},
                    {'id': 'fireworks-display', 'label': 'Fireworks Display', 'category': 'entertainment'},
                    {'id': 'party-music', 'label': 'Party Music', 'category': 'music_dj'}
                ],
                'Catering': [
                    {'id': 'champagne-service', 'label': 'Champagne Service', 'category': 'catering', 'unit': 'bottles', 'placeholder': 'How many bottles?'},
                    {'id': 'midnight-snacks', 'label': 'Midnight Snacks', 'category': 'catering', 'unit': 'platters', 'placeholder': 'How many platters?'}
                ]
            },
            
            'eid-al-fitr': {
                'Religious Services': [
                    {'id': 'eid-prayers', 'label': 'Eid Prayers', 'category': 'other'},
                    {'id': 'imam-services', 'label': 'Imam Services', 'category': 'other'}
                ],
                'Decoration': [
                    {'id': 'islamic-decoration', 'label': 'Islamic Decoration', 'category': 'decoration'},
                    {'id': 'crescent-moon-setup', 'label': 'Crescent Moon Setup', 'category': 'decoration', 'unit': 'setups', 'placeholder': 'How many setups?'}
                ],
                'Catering': [
                    {'id': 'eid-feast', 'label': 'Eid Feast', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'traditional-sweets', 'label': 'Traditional Sweets', 'category': 'catering', 'unit': 'varieties', 'placeholder': 'How many varieties?'}
                ]
            },
            
            'eid-al-adha': {
                'Religious Services': [
                    {'id': 'eid-prayers', 'label': 'Eid Prayers', 'category': 'other'},
                    {'id': 'imam-services', 'label': 'Imam Services', 'category': 'other'}
                ],
                'Catering': [
                    {'id': 'halal-meat-service', 'label': 'Halal Meat Service', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'community-feast', 'label': 'Community Feast', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'}
                ]
            },
            
            # HEALTH EVENTS (20+)
            'health-camp': {
                'Medical Services': [
                    {'id': 'health-screening', 'label': 'Health Screening', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many screening stations?'},
                    {'id': 'medical-equipment', 'label': 'Medical Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'doctors', 'label': 'Doctors', 'category': 'other', 'unit': 'doctors', 'placeholder': 'How many doctors?'}
                ],
                'Support Services': [
                    {'id': 'refreshment-counter', 'label': 'Refreshment Counter', 'category': 'catering', 'unit': 'counters', 'placeholder': 'How many counters?'},
                    {'id': 'awareness-materials', 'label': 'Awareness Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ]
            },
            
            'mental-health-seminar': {
                'Professional Services': [
                    {'id': 'mental-health-experts', 'label': 'Mental Health Experts', 'category': 'other', 'unit': 'experts', 'placeholder': 'How many experts?'},
                    {'id': 'counseling-sessions', 'label': 'Counseling Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'},
                    {'id': 'support-groups', 'label': 'Support Groups', 'category': 'other', 'unit': 'groups', 'placeholder': 'How many groups?'},
                    {'id': 'awareness-materials', 'label': 'Awareness Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ],
                'Educational Setup': [
                    {'id': 'presentation-materials', 'label': 'Presentation Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'interactive-sessions', 'label': 'Interactive Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'},
                    {'id': 'resource-distribution', 'label': 'Resource Distribution', 'category': 'other'}
                ]
            },
            
            'blood-donation-drive': {
                'Medical Services': [
                    {'id': 'medical-team', 'label': 'Medical Team', 'category': 'other', 'unit': 'teams', 'placeholder': 'How many teams?'},
                    {'id': 'blood-collection-equipment', 'label': 'Blood Collection Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'health-screening', 'label': 'Health Screening', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'donor-registration', 'label': 'Donor Registration', 'category': 'coordination', 'unit': 'desks', 'placeholder': 'How many desks?'}
                ],
                'Support Services': [
                    {'id': 'refreshment-counter', 'label': 'Refreshment Counter', 'category': 'catering', 'unit': 'counters', 'placeholder': 'How many counters?'},
                    {'id': 'rest-area', 'label': 'Rest Area', 'category': 'other', 'unit': 'areas', 'placeholder': 'How many areas?'},
                    {'id': 'awareness-materials', 'label': 'Awareness Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'}
                ]
            },
            
            'yoga-festival': {
                'Yoga Equipment': [
                    {'id': 'yoga-mats', 'label': 'Yoga Mats', 'category': 'other', 'unit': 'mats', 'placeholder': 'How many mats?'},
                    {'id': 'meditation-cushions', 'label': 'Meditation Cushions', 'category': 'other', 'unit': 'cushions', 'placeholder': 'How many cushions?'},
                    {'id': 'yoga-blocks', 'label': 'Yoga Blocks', 'category': 'other', 'unit': 'blocks', 'placeholder': 'How many blocks?'},
                    {'id': 'sound-bowls', 'label': 'Sound Bowls', 'category': 'other', 'unit': 'bowls', 'placeholder': 'How many bowls?'}
                ],
                'Instruction & Guidance': [
                    {'id': 'yoga-instructors', 'label': 'Yoga Instructors', 'category': 'other', 'unit': 'instructors', 'placeholder': 'How many instructors?'},
                    {'id': 'meditation-guides', 'label': 'Meditation Guides', 'category': 'other', 'unit': 'guides', 'placeholder': 'How many guides?'},
                    {'id': 'wellness-speakers', 'label': 'Wellness Speakers', 'category': 'other', 'unit': 'speakers', 'placeholder': 'How many speakers?'}
                ],
                'Wellness Services': [
                    {'id': 'healthy-refreshments', 'label': 'Healthy Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'},
                    {'id': 'aromatherapy', 'label': 'Aromatherapy', 'category': 'other'},
                    {'id': 'wellness-products', 'label': 'Wellness Products', 'category': 'other', 'unit': 'products', 'placeholder': 'How many products?'}
                ]
            },
            
            # SPORTS EVENTS (8+)
            'sports-tournament': {
                'Equipment & Facilities': [
                    {'id': 'sports-equipment', 'label': 'Sports Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many equipment sets?'},
                    {'id': 'scoreboards', 'label': 'Scoreboards', 'category': 'other', 'unit': 'boards', 'placeholder': 'How many scoreboards?'},
                    {'id': 'timing-systems', 'label': 'Timing Systems', 'category': 'other'}
                ],
                'Officials & Staff': [
                    {'id': 'referees-umpires', 'label': 'Referees/Umpires', 'category': 'other', 'unit': 'officials', 'placeholder': 'How many officials?'},
                    {'id': 'medical-staff', 'label': 'Medical Staff', 'category': 'other', 'unit': 'staff', 'placeholder': 'How many medical staff?'}
                ],
                'Support Services': [
                    {'id': 'player-refreshments', 'label': 'Player Refreshments', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'trophy-awards', 'label': 'Trophy & Awards', 'category': 'other', 'unit': 'trophies', 'placeholder': 'How many trophies?'}
                ]
            },
            
            'marathon-run': {
                'Race Management': [
                    {'id': 'route-marking', 'label': 'Route Marking', 'category': 'other'},
                    {'id': 'timing-chips', 'label': 'Timing Chips', 'category': 'other', 'unit': 'chips', 'placeholder': 'How many chips?'},
                    {'id': 'water-stations', 'label': 'Water Stations', 'category': 'catering', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'finish-line-setup', 'label': 'Finish Line Setup', 'category': 'other'}
                ],
                'Safety & Medical': [
                    {'id': 'medical-teams', 'label': 'Medical Teams', 'category': 'other', 'unit': 'teams', 'placeholder': 'How many teams?'},
                    {'id': 'ambulance-service', 'label': 'Ambulance Service', 'category': 'other', 'unit': 'ambulances', 'placeholder': 'How many ambulances?'},
                    {'id': 'safety-marshals', 'label': 'Safety Marshals', 'category': 'other', 'unit': 'marshals', 'placeholder': 'How many marshals?'}
                ],
                'Participant Services': [
                    {'id': 'registration-booth', 'label': 'Registration Booth', 'category': 'coordination', 'unit': 'booths', 'placeholder': 'How many booths?'},
                    {'id': 'participant-kits', 'label': 'Participant Kits', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'},
                    {'id': 'medal-ceremony', 'label': 'Medal Ceremony', 'category': 'other'}
                ]
            },
            
            'cycling-event': {
                'Race Management': [
                    {'id': 'route-marking', 'label': 'Route Marking', 'category': 'other'},
                    {'id': 'safety-marshals', 'label': 'Safety Marshals', 'category': 'other', 'unit': 'marshals', 'placeholder': 'How many marshals?'},
                    {'id': 'timing-system', 'label': 'Timing System', 'category': 'other'},
                    {'id': 'bike-maintenance', 'label': 'Bike Maintenance', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many stations?'}
                ],
                'Support Services': [
                    {'id': 'hydration-stations', 'label': 'Hydration Stations', 'category': 'catering', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'medical-support', 'label': 'Medical Support', 'category': 'other', 'unit': 'teams', 'placeholder': 'How many teams?'},
                    {'id': 'participant-kits', 'label': 'Participant Kits', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'}
                ]
            },
            
            'obstacle-course-race': {
                'Course Setup': [
                    {'id': 'obstacle-equipment', 'label': 'Obstacle Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'safety-equipment', 'label': 'Safety Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'course-design', 'label': 'Course Design', 'category': 'other'},
                    {'id': 'timing-system', 'label': 'Timing System', 'category': 'other'}
                ],
                'Safety & Support': [
                    {'id': 'medical-team', 'label': 'Medical Team', 'category': 'other', 'unit': 'teams', 'placeholder': 'How many teams?'},
                    {'id': 'safety-briefing', 'label': 'Safety Briefing', 'category': 'other'},
                    {'id': 'completion-certificates', 'label': 'Completion Certificates', 'category': 'other', 'unit': 'certificates', 'placeholder': 'How many certificates?'}
                ]
            },
            
            # EDUCATIONAL EVENTS (10+)
            'workshop': {
                'Learning Materials': [
                    {'id': 'workshop-kits', 'label': 'Workshop Kits', 'category': 'other', 'unit': 'kits', 'placeholder': 'How many kits?'},
                    {'id': 'handout-materials', 'label': 'Handout Materials', 'category': 'other', 'unit': 'copies', 'placeholder': 'How many copies?'},
                    {'id': 'tools-equipment', 'label': 'Tools & Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many tool sets?'},
                    {'id': 'reference-books', 'label': 'Reference Books', 'category': 'other', 'unit': 'books', 'placeholder': 'How many books?'},
                    {'id': 'practice-materials', 'label': 'Practice Materials', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'software-licenses', 'label': 'Software Licenses', 'category': 'other', 'unit': 'licenses', 'placeholder': 'How many licenses?'},
                    {'id': 'safety-equipment', 'label': 'Safety Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'measurement-tools', 'label': 'Measurement Tools', 'category': 'other', 'unit': 'tools', 'placeholder': 'How many tools?'},
                    {'id': 'art-supplies', 'label': 'Art Supplies', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'stationery-items', 'label': 'Stationery Items', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'sample-products', 'label': 'Sample Products', 'category': 'other', 'unit': 'samples', 'placeholder': 'How many samples?'},
                    {'id': 'instruction-manuals', 'label': 'Instruction Manuals', 'category': 'other', 'unit': 'manuals', 'placeholder': 'How many manuals?'}
                ],
                'Technical Setup': [
                    {'id': 'projector-screen', 'label': 'Projector & Screen', 'category': 'other'},
                    {'id': 'audio-system', 'label': 'Audio System', 'category': 'music_dj'},
                    {'id': 'flipchart-boards', 'label': 'Flipchart Boards', 'category': 'other', 'unit': 'boards', 'placeholder': 'How many boards?'}
                ],
                'Facilitation': [
                    {'id': 'expert-facilitators', 'label': 'Expert Facilitators', 'category': 'other', 'unit': 'facilitators', 'placeholder': 'How many facilitators?'},
                    {'id': 'assistant-trainers', 'label': 'Assistant Trainers', 'category': 'other', 'unit': 'trainers', 'placeholder': 'How many trainers?'},
                    {'id': 'certificate-printing', 'label': 'Certificate Printing', 'category': 'other', 'unit': 'certificates', 'placeholder': 'How many certificates?'},
                    {'id': 'industry-experts', 'label': 'Industry Experts', 'category': 'other', 'unit': 'experts', 'placeholder': 'How many experts?'},
                    {'id': 'guest-speakers', 'label': 'Guest Speakers', 'category': 'other', 'unit': 'speakers', 'placeholder': 'How many speakers?'},
                    {'id': 'skill-assessors', 'label': 'Skill Assessors', 'category': 'other', 'unit': 'assessors', 'placeholder': 'How many assessors?'},
                    {'id': 'mentorship-program', 'label': 'Mentorship Program', 'category': 'other'},
                    {'id': 'peer-learning-groups', 'label': 'Peer Learning Groups', 'category': 'other', 'unit': 'groups', 'placeholder': 'How many groups?'},
                    {'id': 'feedback-sessions', 'label': 'Feedback Sessions', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'}
                ],
                'Workshop Logistics': [
                    {'id': 'workspace-setup', 'label': 'Workspace Setup', 'category': 'other', 'unit': 'workspaces', 'placeholder': 'How many workspaces?'},
                    {'id': 'group-seating', 'label': 'Group Seating', 'category': 'other', 'unit': 'groups', 'placeholder': 'How many groups?'},
                    {'id': 'storage-solutions', 'label': 'Storage Solutions', 'category': 'other', 'unit': 'units', 'placeholder': 'How many units?'},
                    {'id': 'cleanup-services', 'label': 'Cleanup Services', 'category': 'other'},
                    {'id': 'material-distribution', 'label': 'Material Distribution', 'category': 'coordination'},
                    {'id': 'progress-tracking', 'label': 'Progress Tracking', 'category': 'other'}
                ]
            },
            
            'science-fair': {
                'Exhibition Setup': [
                    {'id': 'display-boards', 'label': 'Display Boards', 'category': 'other', 'unit': 'boards', 'placeholder': 'How many boards?'},
                    {'id': 'experiment-tables', 'label': 'Experiment Tables', 'category': 'other', 'unit': 'tables', 'placeholder': 'How many tables?'},
                    {'id': 'safety-equipment', 'label': 'Safety Equipment', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many sets?'},
                    {'id': 'power-supply', 'label': 'Power Supply', 'category': 'other'}
                ],
                'Judging & Awards': [
                    {'id': 'expert-judges', 'label': 'Expert Judges', 'category': 'other', 'unit': 'judges', 'placeholder': 'How many judges?'},
                    {'id': 'evaluation-sheets', 'label': 'Evaluation Sheets', 'category': 'other', 'unit': 'sheets', 'placeholder': 'How many sheets?'},
                    {'id': 'prizes-trophies', 'label': 'Prizes & Trophies', 'category': 'other', 'unit': 'prizes', 'placeholder': 'How many prizes?'}
                ],
                'Documentation': [
                    {'id': 'project-photography', 'label': 'Project Photography', 'category': 'photography'},
                    {'id': 'demonstration-recording', 'label': 'Demonstration Recording', 'category': 'videography'}
                ]
            },
            
            # VIRTUAL EVENTS (8+)
            'online-webinar': {
                'Technical Platform': [
                    {'id': 'webinar-platform', 'label': 'Webinar Platform', 'category': 'other'},
                    {'id': 'streaming-software', 'label': 'Streaming Software', 'category': 'other'},
                    {'id': 'chat-moderation', 'label': 'Chat Moderation', 'category': 'other', 'unit': 'moderators', 'placeholder': 'How many moderators?'}
                ],
                'Content & Support': [
                    {'id': 'presentation-slides', 'label': 'Presentation Slides', 'category': 'other', 'unit': 'presentations', 'placeholder': 'How many presentations?'},
                    {'id': 'technical-support', 'label': 'Technical Support', 'category': 'other', 'unit': 'technicians', 'placeholder': 'How many technicians?'}
                ]
            },
            
            'virtual-conference': {
                'Platform & Technology': [
                    {'id': 'virtual-event-platform', 'label': 'Virtual Event Platform', 'category': 'other'},
                    {'id': 'multi-session-support', 'label': 'Multi-Session Support', 'category': 'other', 'unit': 'sessions', 'placeholder': 'How many sessions?'},
                    {'id': 'networking-tools', 'label': 'Networking Tools', 'category': 'other'},
                    {'id': 'virtual-exhibition', 'label': 'Virtual Exhibition', 'category': 'other', 'unit': 'exhibitions', 'placeholder': 'How many exhibitions?'}
                ],
                'Production Services': [
                    {'id': 'live-streaming', 'label': 'Live Streaming', 'category': 'videography'},
                    {'id': 'video-production', 'label': 'Video Production', 'category': 'videography', 'unit': 'videos', 'placeholder': 'How many videos?'},
                    {'id': 'audio-engineering', 'label': 'Audio Engineering', 'category': 'music_dj', 'unit': 'engineers', 'placeholder': 'How many engineers?'}
                ]
            },
            
            # ENVIRONMENTAL EVENTS (8+)
            'tree-planting-drive': {
                'Plant & Equipment': [
                    {'id': 'tree-saplings', 'label': 'Tree Saplings', 'category': 'other', 'unit': 'saplings', 'placeholder': 'How many saplings?'},
                    {'id': 'gardening-tools', 'label': 'Gardening Tools', 'category': 'other', 'unit': 'sets', 'placeholder': 'How many tool sets?'},
                    {'id': 'watering-equipment', 'label': 'Watering Equipment', 'category': 'other', 'unit': 'units', 'placeholder': 'How many watering units?'},
                    {'id': 'soil-fertilizer', 'label': 'Soil & Fertilizer', 'category': 'other', 'unit': 'bags', 'placeholder': 'How many bags?'}
                ],
                'Educational Services': [
                    {'id': 'environmental-educator', 'label': 'Environmental Educator', 'category': 'other', 'unit': 'educators', 'placeholder': 'How many educators?'},
                    {'id': 'planting-instructor', 'label': 'Planting Instructor', 'category': 'other', 'unit': 'instructors', 'placeholder': 'How many instructors?'}
                ],
                'Logistics': [
                    {'id': 'transportation-plants', 'label': 'Transportation for Plants', 'category': 'transportation', 'unit': 'vehicles', 'placeholder': 'How many vehicles?'},
                    {'id': 'volunteer-coordination', 'label': 'Volunteer Coordination', 'category': 'coordination', 'unit': 'coordinators', 'placeholder': 'How many coordinators?'},
                    {'id': 'site-preparation', 'label': 'Site Preparation', 'category': 'other'}
                ],
                'Documentation': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'candid-photography', 'label': 'Candid Photography', 'category': 'photography'},
                    {'id': 'professional-portraits', 'label': 'Professional Portraits', 'category': 'photography'},
                    {'id': 'progress-documentation', 'label': 'Progress Documentation', 'category': 'videography'}
                ]
            },
            
            'eco-festival': {
                'Sustainable Services': [
                    {'id': 'eco-friendly-vendors', 'label': 'Eco-Friendly Vendors', 'category': 'other', 'unit': 'vendors', 'placeholder': 'How many vendors?'},
                    {'id': 'organic-food-stalls', 'label': 'Organic Food Stalls', 'category': 'catering', 'unit': 'stalls', 'placeholder': 'How many stalls?'},
                    {'id': 'recycling-stations', 'label': 'Recycling Stations', 'category': 'other', 'unit': 'stations', 'placeholder': 'How many stations?'},
                    {'id': 'solar-power-setup', 'label': 'Solar Power Setup', 'category': 'other'}
                ],
                'Educational Exhibits': [
                    {'id': 'sustainability-displays', 'label': 'Sustainability Displays', 'category': 'other', 'unit': 'displays', 'placeholder': 'How many displays?'},
                    {'id': 'workshop-facilitators', 'label': 'Workshop Facilitators', 'category': 'other', 'unit': 'facilitators', 'placeholder': 'How many facilitators?'},
                    {'id': 'environmental-speakers', 'label': 'Environmental Speakers', 'category': 'other', 'unit': 'speakers', 'placeholder': 'How many speakers?'}
                ]
            }
        }
        
        # Insert remaining requirements into database
        total_inserted = 0
        for event_id, categories in remaining_requirements.items():
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
            self.style.SUCCESS(f'Successfully populated {total_inserted} additional requirements')
        )