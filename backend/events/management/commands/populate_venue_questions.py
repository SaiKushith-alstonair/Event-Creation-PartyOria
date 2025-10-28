from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Populate venue questions for all events with appropriate venue options'

    def handle(self, *args, **options):
        # Comprehensive venue options for all event types
        venue_options = {
            # Wedding & Engagement
            'wedding': ['Banquet Hall', 'Resort', 'Palace', 'Garden', 'Beach Resort', 'Heritage Hotel', 'Farmhouse', 'Destination Wedding Venue', 'Luxury Hotel', 'Convention Center', 'Temple', 'Church', 'Gurudwara', 'Mosque'],
            'engagement': ['Banquet Hall', 'Resort', 'Garden', 'Hotel', 'Farmhouse', 'Rooftop Venue', 'Community Hall', 'Restaurant', 'Home', 'Lawn'],
            'reception': ['Banquet Hall', 'Hotel', 'Convention Center', 'Resort', 'Palace', 'Luxury Venue', 'Garden', 'Farmhouse', 'Rooftop Venue'],
            'sangam': ['Banquet Hall', 'Garden', 'Community Hall', 'Hotel', 'Resort', 'Farmhouse'],
            'mehendi': ['Garden', 'Banquet Hall', 'Home', 'Farmhouse', 'Hotel', 'Rooftop Venue'],
            'haldi': ['Home', 'Garden', 'Banquet Hall', 'Farmhouse', 'Hotel'],
            'bachelor': ['Hotel', 'Resort', 'Club', 'Restaurant', 'Farmhouse', 'Beach Resort'],
            'bachelorette': ['Hotel', 'Resort', 'Spa', 'Restaurant', 'Club', 'Beach Resort'],
            'naming-ceremony': ['Home', 'Banquet Hall', 'Community Center', 'Temple', 'Garden'],
            'mundan': ['Home', 'Temple', 'Community Center', 'Garden'],
            'thread-ceremony': ['Home', 'Temple', 'Community Center', 'Banquet Hall'],
            'house-warming': ['Home', 'Garden', 'Community Center'],
            
            # Birthday & Kids
            'birthday': ['Party Hall', 'Restaurant', 'Home', 'Garden', 'Community Center', 'Hotel', 'Farmhouse', 'Banquet Hall', 'Rooftop Venue', 'Beach Resort', 'Club House'],
            'kids-birthday': ['Party Hall', 'Play Area', 'Restaurant', 'Home', 'Garden', 'Community Center', 'Theme Park', 'Indoor Play Zone', 'Amusement Park'],
            'baby-shower': ['Home', 'Banquet Hall', 'Garden', 'Hotel', 'Restaurant'],
            'first-birthday': ['Home', 'Party Hall', 'Garden', 'Restaurant'],
            'sweet-sixteen': ['Party Hall', 'Restaurant', 'Hotel', 'Club', 'Garden'],
            
            # Corporate & Business
            'conference': ['Convention Center', 'Hotel', 'Corporate Office', 'Auditorium', 'Business Center', 'Resort', 'Meeting Hall', 'Conference Room'],
            'seminar': ['Auditorium', 'Hotel', 'Convention Center', 'Corporate Office', 'Conference Hall', 'Business Center', 'Training Center'],
            'workshop': ['Training Center', 'Hotel', 'Corporate Office', 'Community Center', 'Conference Hall', 'Auditorium', 'Classroom'],
            'team-building': ['Resort', 'Farmhouse', 'Adventure Park', 'Hotel', 'Outdoor Venue', 'Corporate Retreat Center', 'Sports Complex'],
            'product-launch': ['Convention Center', 'Hotel', 'Auditorium', 'Exhibition Hall', 'Corporate Office'],
            'trade-show': ['Exhibition Hall', 'Convention Center', 'Trade Center', 'Hotel'],
            'networking': ['Hotel', 'Club', 'Restaurant', 'Business Center', 'Rooftop Venue'],
            'annual-meet': ['Convention Center', 'Hotel', 'Auditorium', 'Resort'],
            'board-meeting': ['Corporate Office', 'Hotel', 'Business Center', 'Conference Room'],
            'client-appreciation': ['Hotel', 'Restaurant', 'Club', 'Resort', 'Banquet Hall'],
            'award-ceremony': ['Auditorium', 'Hotel', 'Convention Center', 'Banquet Hall'],
            'corporate-party': ['Hotel', 'Banquet Hall', 'Resort', 'Restaurant', 'Rooftop Venue'],
            'training': ['Training Center', 'Corporate Office', 'Hotel', 'Conference Hall'],
            'retreat': ['Resort', 'Farmhouse', 'Hotel', 'Corporate Retreat Center'],
            'inauguration': ['Office Space', 'Convention Center', 'Hotel', 'Auditorium'],
            'exhibition': ['Exhibition Hall', 'Convention Center', 'Gallery', 'Museum'],
            'career-expo': ['Convention Center', 'Exhibition Hall', 'College', 'Auditorium'],
            
            # Environmental & Social Causes
            'tree-planting': ['Outdoor Venue', 'Park', 'Forest Area', 'Farmland', 'Open Ground', 'Nature Reserve', 'Garden', 'Community Park'],
            'clean-up': ['Outdoor Venue', 'Park', 'Public Venue', 'Recycling Center', 'Open Ground', 'Beach', 'Community Area'],
            'eco-festival': ['Outdoor Venue', 'Park', 'Community Centre', 'Open Ground', 'Nature Reserve', 'Garden'],
            'environmental': ['Outdoor Venue', 'Community Centre', 'Park', 'Public Venue', 'Nature Center', 'Open Ground'],
            'awareness-campaign': ['Community Center', 'Park', 'Public Venue', 'School', 'College'],
            'health-camp': ['Community Center', 'Hospital', 'Clinic', 'School', 'Park'],
            'blood-donation': ['Hospital', 'Community Center', 'School', 'College', 'Corporate Office'],
            'charity-event': ['Community Center', 'Hotel', 'Banquet Hall', 'Auditorium', 'Convention Center', 'Garden', 'NGO Office'],
            'fundraiser': ['Hotel', 'Banquet Hall', 'Community Center', 'Auditorium', 'Convention Center', 'Garden', 'Club'],
            'volunteer': ['Community Center', 'NGO Office', 'School', 'Park'],
            
            # Festivals & Religious
            'diwali': ['Home', 'Community Center', 'Temple', 'Banquet Hall', 'Garden', 'Farmhouse', 'Hotel', 'Cultural Center'],
            'holi': ['Garden', 'Farmhouse', 'Open Ground', 'Community Center', 'Resort', 'Beach', 'Park', 'Playground'],
            'christmas': ['Home', 'Church', 'Community Center', 'Hotel', 'Restaurant', 'Banquet Hall', 'Garden', 'Club'],
            'eid': ['Home', 'Mosque', 'Community Center', 'Banquet Hall', 'Garden', 'Hotel', 'Restaurant', 'Islamic Center'],
            'ganesh-chaturthi': ['Home', 'Community Center', 'Temple', 'Garden', 'Open Ground'],
            'navratri': ['Community Center', 'Garden', 'Open Ground', 'Cultural Center', 'Temple'],
            'durga-puja': ['Community Center', 'Pandal', 'Open Ground', 'Cultural Center'],
            'karva-chauth': ['Home', 'Community Center', 'Garden', 'Banquet Hall'],
            'raksha-bandhan': ['Home', 'Community Center', 'Garden'],
            'janmashtami': ['Temple', 'Community Center', 'Home', 'Cultural Center'],
            'dussehra': ['Open Ground', 'Community Center', 'Park', 'Cultural Center'],
            'onam': ['Home', 'Community Center', 'Cultural Center', 'Garden'],
            'pongal': ['Home', 'Community Center', 'Cultural Center', 'Garden'],
            'baisakhi': ['Community Center', 'Gurudwara', 'Garden', 'Cultural Center'],
            'guru-nanak': ['Gurudwara', 'Community Center', 'Cultural Center'],
            
            # Entertainment & Arts
            'concert': ['Auditorium', 'Stadium', 'Open Ground', 'Convention Center', 'Arena', 'Amphitheater', 'Music Hall', 'Theater'],
            'music-concert': ['Auditorium', 'Stadium', 'Arena', 'Music Hall', 'Theater', 'Open Ground'],
            'comedy-show': ['Auditorium', 'Theater', 'Comedy Club', 'Hotel', 'Restaurant', 'Community Center', 'Bar', 'Lounge'],
            'dance-performance': ['Auditorium', 'Theater', 'Cultural Center', 'Hotel', 'Banquet Hall', 'Stadium', 'Dance Studio'],
            'drama': ['Theater', 'Auditorium', 'Cultural Center', 'Community Center'],
            'puppet-show': ['Theater', 'Community Center', 'School', 'Cultural Center'],
            'magic-show': ['Theater', 'Community Center', 'Hotel', 'Party Hall'],
            'art-exhibition': ['Gallery', 'Museum', 'Cultural Center', 'Hotel', 'Community Center'],
            'fashion-show': ['Auditorium', 'Hotel', 'Convention Center', 'Theater'],
            'talent-show': ['Auditorium', 'Theater', 'Community Center', 'School'],
            'karaoke': ['Bar', 'Restaurant', 'Hotel', 'Club', 'Community Center'],
            'open-mic': ['Cafe', 'Bar', 'Community Center', 'Cultural Center'],
            'film-screening': ['Theater', 'Auditorium', 'Community Center', 'Open Ground'],
            'book-launch': ['Library', 'Bookstore', 'Hotel', 'Cultural Center'],
            'poetry': ['Cafe', 'Library', 'Cultural Center', 'Community Center'],
            'storytelling': ['Library', 'Community Center', 'Cultural Center', 'School'],
            
            # Sports & Fitness
            'sports-tournament': ['Stadium', 'Sports Complex', 'Ground', 'Arena', 'Sports Club', 'Outdoor Venue', 'Gymnasium'],
            'marathon': ['Stadium', 'Open Road', 'Park', 'Sports Complex', 'Beach', 'City Streets', 'Running Track'],
            'cricket': ['Cricket Ground', 'Stadium', 'Sports Complex', 'Playground'],
            'football': ['Football Ground', 'Stadium', 'Sports Complex', 'Playground'],
            'basketball': ['Basketball Court', 'Sports Complex', 'Gymnasium', 'School'],
            'tennis': ['Tennis Court', 'Sports Club', 'Sports Complex'],
            'badminton': ['Badminton Court', 'Sports Complex', 'Gymnasium', 'Community Center'],
            'swimming': ['Swimming Pool', 'Sports Complex', 'Club', 'Resort'],
            'cycling': ['Park', 'Open Road', 'Sports Complex', 'Cycling Track'],
            'yoga': ['Park', 'Community Center', 'Yoga Studio', 'Beach', 'Garden'],
            'fitness': ['Gymnasium', 'Sports Complex', 'Park', 'Community Center'],
            'adventure': ['Adventure Park', 'Outdoor Venue', 'Resort', 'Forest Area'],
            
            # Social & Community
            'reunion': ['Hotel', 'Banquet Hall', 'Restaurant', 'Community Center', 'Resort', 'Garden', 'Farmhouse', 'School/College'],
            'alumni-meet': ['School/College', 'Hotel', 'Restaurant', 'Community Center'],
            'farewell': ['School/College', 'Restaurant', 'Hotel', 'Community Center'],
            'welcome': ['School/College', 'Office', 'Community Center', 'Hotel'],
            'graduation': ['School/College', 'Auditorium', 'Convention Center', 'Hotel'],
            'anniversary': ['Hotel', 'Restaurant', 'Banquet Hall', 'Resort', 'Home'],
            'retirement': ['Hotel', 'Restaurant', 'Community Center', 'Office'],
            'promotion': ['Restaurant', 'Hotel', 'Office', 'Club'],
            'picnic': ['Park', 'Garden', 'Resort', 'Farmhouse', 'Beach', 'Lake'],
            'barbecue': ['Garden', 'Farmhouse', 'Beach', 'Park', 'Rooftop'],
            'potluck': ['Community Center', 'Home', 'Park', 'Garden'],
            'game-night': ['Home', 'Community Center', 'Club', 'Restaurant'],
            'movie-night': ['Home', 'Community Center', 'Theater', 'Open Ground'],
            'neighborhood': ['Community Center', 'Park', 'Garden', 'Club House'],
            'cultural': ['Cultural Center', 'Community Center', 'Auditorium', 'Museum'],
            'heritage': ['Heritage Site', 'Museum', 'Cultural Center', 'Historical Venue'],
            
            # Food & Dining
            'food-festival': ['Open Ground', 'Park', 'Convention Center', 'Community Center'],
            'wine-tasting': ['Restaurant', 'Hotel', 'Club', 'Winery'],
            'cooking': ['Community Center', 'Restaurant', 'Hotel', 'Cooking Studio'],
            'dinner': ['Restaurant', 'Hotel', 'Home', 'Banquet Hall'],
            'lunch': ['Restaurant', 'Hotel', 'Community Center', 'Garden'],
            'brunch': ['Restaurant', 'Hotel', 'Garden', 'Rooftop Venue'],
            'cocktail': ['Bar', 'Hotel', 'Restaurant', 'Club', 'Rooftop Venue'],
            'tea-party': ['Garden', 'Home', 'Hotel', 'Restaurant'],
            
            # Educational & Learning
            'workshop': ['Training Center', 'Hotel', 'Corporate Office', 'Community Center', 'Conference Hall', 'Auditorium', 'Classroom'],
            'masterclass': ['Training Center', 'Auditorium', 'Hotel', 'Cultural Center'],
            'lecture': ['Auditorium', 'Classroom', 'Library', 'Community Center'],
            'debate': ['Auditorium', 'School/College', 'Community Center'],
            'quiz': ['Auditorium', 'School/College', 'Community Center', 'Hotel'],
            'science-fair': ['School/College', 'Convention Center', 'Community Center'],
            'craft-workshop': ['Community Center', 'Cultural Center', 'Art Studio'],
            
            # Default venues for unmatched events
            'default': ['Banquet Hall', 'Hotel', 'Community Center', 'Garden', 'Restaurant', 'Convention Center', 'Resort', 'Farmhouse', 'Auditorium', 'Open Ground', 'Home', 'Club House', 'Rooftop Venue', 'Beach Resort']
        }
        
        # Get all venue requirements
        venue_requirements = EventRequirement.objects.filter(requirement_id='venues')
        created_count = 0
        
        for requirement in venue_requirements:
            # Skip if question already exists
            if RequirementQuestion.objects.filter(requirement=requirement).exists():
                continue
                
            # Determine venue options based on event_id
            event_id = requirement.event_id.lower()
            options = venue_options.get('default')
            
            # Direct mapping for specific events
            event_mappings = {
                'tree-planting-drive': 'tree-planting',
                'clean-up-drive': 'clean-up',
                'eco-festival': 'eco-festival',
                'environmental-awareness-campaign': 'environmental',
                'health-camp': 'health-camp',
                'blood-donation-camp': 'blood-donation',
                'music-concert': 'music-concert',
                'comedy-show': 'comedy-show',
                'dance-performance': 'dance-performance',
                'art-exhibition': 'art-exhibition',
                'fashion-show': 'fashion-show',
                'talent-show': 'talent-show',
                'karaoke-night': 'karaoke',
                'open-mic-night': 'open-mic',
                'film-screening': 'film-screening',
                'book-launch': 'book-launch',
                'poetry-reading': 'poetry',
                'storytelling-session': 'storytelling',
                'sports-tournament': 'sports-tournament',
                'cricket-tournament': 'cricket',
                'football-tournament': 'football',
                'basketball-tournament': 'basketball',
                'tennis-tournament': 'tennis',
                'badminton-tournament': 'badminton',
                'swimming-competition': 'swimming',
                'cycling-event': 'cycling',
                'yoga-session': 'yoga',
                'fitness-bootcamp': 'fitness',
                'adventure-sports': 'adventure',
                'alumni-meet': 'alumni-meet',
                'farewell-party': 'farewell',
                'welcome-party': 'welcome',
                'graduation-ceremony': 'graduation',
                'anniversary-celebration': 'anniversary',
                'retirement-party': 'retirement',
                'promotion-party': 'promotion',
                'picnic-party': 'picnic',
                'barbecue-party': 'barbecue',
                'potluck-dinner': 'potluck',
                'game-night': 'game-night',
                'movie-night': 'movie-night',
                'neighborhood-gathering': 'neighborhood',
                'cultural-program': 'cultural',
                'heritage-walk': 'heritage',
                'food-festival': 'food-festival',
                'wine-tasting': 'wine-tasting',
                'cooking-class': 'cooking',
                'dinner-party': 'dinner',
                'lunch-party': 'lunch',
                'brunch-party': 'brunch',
                'cocktail-party': 'cocktail',
                'tea-party': 'tea-party',
                'masterclass': 'masterclass',
                'lecture-series': 'lecture',
                'debate-competition': 'debate',
                'quiz-competition': 'quiz',
                'science-fair': 'science-fair',
                'traditional-craft-workshop': 'craft-workshop'
            }
            
            # Check direct mappings first
            if event_id in event_mappings:
                options = venue_options[event_mappings[event_id]]
            else:
                # Check for partial matches with keywords
                for keyword, category in event_mappings.items():
                    if keyword.replace('-', ' ') in event_id.replace('-', ' '):
                        options = venue_options[category]
                        break
                else:
                    # Fallback to category-based matching
                    for category, category_options in venue_options.items():
                        if category != 'default' and category in event_id:
                            options = category_options
                            break
            
            # Create venue selection question
            RequirementQuestion.objects.create(
                requirement=requirement,
                question_text='Select preferred venue types for your event',
                question_type='checkbox',
                options=options,
                placeholder='Choose one or more venue types',
                is_required=True,
                order=1
            )
            
            # Create capacity question
            RequirementQuestion.objects.create(
                requirement=requirement,
                question_text='Expected number of guests',
                question_type='number',
                placeholder='Enter expected guest count',
                min_value=1,
                max_value=10000,
                is_required=True,
                order=2
            )
            
            # Create budget question
            RequirementQuestion.objects.create(
                requirement=requirement,
                question_text='Venue budget range',
                question_type='dropdown',
                options=['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,50,000', 'Above ₹2,50,000'],
                placeholder='Select budget range',
                is_required=True,
                order=3
            )
            
            created_count += 1
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created venue questions for {created_count} events')
        )