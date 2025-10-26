from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Populate ALL requirement questions from the comprehensive file'

    def handle(self, *args, **options):
        # Clear existing questions
        RequirementQuestion.objects.all().delete()
        self.stdout.write('Cleared existing questions')
        
        # Define ALL questions from the comprehensive list
        requirement_questions = {
            # CORPORATE EVENTS - Conference
            'av-equipment': [
                {'question_text': 'What type of AV equipment do you need?', 'question_type': 'checkbox', 'options': ['Projectors', 'Screens', 'Speakers', 'Microphones'], 'is_required': True, 'order': 1},
                {'question_text': 'What is your venue size?', 'question_type': 'dropdown', 'options': ['Small (up to 50)', 'Medium (50-200)', 'Large (200-500)', 'Extra Large (500+)'], 'is_required': True, 'order': 2},
                {'question_text': 'Do you need backup equipment?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            'projector-setup': [
                {'question_text': 'Which projector type?', 'question_type': 'dropdown', 'options': ['LCD', 'DLP', 'LED', 'Laser'], 'is_required': True, 'order': 1},
                {'question_text': 'What brightness level (lumens)?', 'question_type': 'dropdown', 'options': ['2000-3000', '3000-4000', '4000-5000', '5000+'], 'is_required': True, 'order': 2},
                {'question_text': 'Screen size preference?', 'question_type': 'dropdown', 'options': ['Small (6-8 ft)', 'Medium (8-12 ft)', 'Large (12-16 ft)', 'Extra Large (16+ ft)'], 'is_required': True, 'order': 3},
                {'question_text': 'Indoor or outdoor use?', 'question_type': 'radio', 'options': ['Indoor', 'Outdoor'], 'is_required': True, 'order': 4},
                {'question_text': 'Portable or fixed installation?', 'question_type': 'radio', 'options': ['Portable', 'Fixed installation'], 'is_required': True, 'order': 5}
            ],
            'microphone-system': [
                {'question_text': 'How many speakers?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 1},
                {'question_text': 'Microphone type?', 'question_type': 'checkbox', 'options': ['Wireless', 'Lapel', 'Handheld', 'Podium'], 'is_required': True, 'order': 2},
                {'question_text': 'Number of microphones needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 3},
                {'question_text': 'Do you need recording capability?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ],
            'live-streaming': [
                {'question_text': 'Which platform?', 'question_type': 'dropdown', 'options': ['YouTube', 'Zoom', 'Facebook Live', 'Custom Platform'], 'is_required': True, 'order': 1},
                {'question_text': 'Expected viewers?', 'question_type': 'dropdown', 'options': ['Under 100', '100-500', '500-1000', '1000+'], 'is_required': True, 'order': 2},
                {'question_text': 'Single camera or multi-camera?', 'question_type': 'radio', 'options': ['Single camera', 'Multi-camera'], 'is_required': True, 'order': 3},
                {'question_text': 'Do you need recording?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ],
            'conference-app': [
                {'question_text': 'Number of attendees?', 'question_type': 'number', 'min_value': 1, 'max_value': 5000, 'is_required': True, 'order': 1},
                {'question_text': 'Features needed?', 'question_type': 'checkbox', 'options': ['Schedule', 'Networking', 'Polls', 'Q&A'], 'is_required': True, 'order': 2},
                {'question_text': 'Integration requirements?', 'question_type': 'dropdown', 'options': ['None', 'CRM Integration', 'Registration System'], 'is_required': False, 'order': 3}
            ],
            'wifi-setup': [
                {'question_text': 'Number of users?', 'question_type': 'dropdown', 'options': ['Under 50', '50-100', '100-300', '300+'], 'is_required': True, 'order': 1},
                {'question_text': 'Bandwidth requirements?', 'question_type': 'dropdown', 'options': ['Basic (10 Mbps)', 'Standard (50 Mbps)', 'High (100+ Mbps)'], 'is_required': True, 'order': 2},
                {'question_text': 'Security level needed?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'High Security'], 'is_required': True, 'order': 3}
            ],
            'simultaneous-translation': [
                {'question_text': 'How many languages?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 1},
                {'question_text': 'Number of participants per language?', 'question_type': 'dropdown', 'options': ['Under 20', '20-50', '50-100', '100+'], 'is_required': True, 'order': 2},
                {'question_text': 'Equipment type?', 'question_type': 'dropdown', 'options': ['Wireless receivers only', 'Translation booths only', 'Both'], 'is_required': True, 'order': 3}
            ],
            'event-catering': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 5000, 'is_required': True, 'order': 1},
                {'question_text': 'Meal type?', 'question_type': 'dropdown', 'options': ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], 'is_required': True, 'order': 2},
                {'question_text': 'Dietary restrictions?', 'question_type': 'checkbox', 'options': ['Veg', 'Non-veg', 'Vegan', 'Gluten-free', 'Halal', 'Jain'], 'is_required': False, 'order': 3},
                {'question_text': 'Service style?', 'question_type': 'dropdown', 'options': ['Buffet', 'Plated', 'Family-style'], 'is_required': True, 'order': 4},
                {'question_text': 'Cuisine preference?', 'question_type': 'text', 'placeholder': 'Specify cuisine preference', 'is_required': False, 'order': 5}
            ],
            'business-lunch': [
                {'question_text': 'Number of attendees?', 'question_type': 'number', 'min_value': 1, 'max_value': 200, 'is_required': True, 'order': 1},
                {'question_text': 'Meal preference?', 'question_type': 'dropdown', 'options': ['Light lunch', 'Full course meal', 'Executive lunch', 'Working lunch'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['30 minutes', '1 hour', '1.5 hours', '2 hours'], 'is_required': True, 'order': 3}
            ],
            'coffee-breaks': [
                {'question_text': 'Number of breaks?', 'question_type': 'number', 'min_value': 1, 'max_value': 5, 'is_required': True, 'order': 1},
                {'question_text': 'Number of people?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 2},
                {'question_text': 'Items needed?', 'question_type': 'dropdown', 'options': ['Coffee & Tea only', 'Coffee, Tea & Snacks', 'Coffee, Tea, Snacks & Fresh juice', 'Full refreshment spread'], 'is_required': True, 'order': 3}
            ],
            'event-coordination': [
                {'question_text': 'Event duration?', 'question_type': 'dropdown', 'options': ['Half day', 'Full day', '2 days', '3+ days'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of coordinators needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 2},
                {'question_text': 'Specific responsibilities?', 'question_type': 'text', 'placeholder': 'Describe coordination needs', 'is_required': False, 'order': 3}
            ],
            'registration-desk': [
                {'question_text': 'Expected attendees?', 'question_type': 'dropdown', 'options': ['Under 100', '100-300', '300-500', '500-1000', '1000+'], 'is_required': True, 'order': 1},
                {'question_text': 'Digital or manual registration?', 'question_type': 'dropdown', 'options': ['Digital only', 'Manual only', 'Both digital and manual'], 'is_required': True, 'order': 2},
                {'question_text': 'Badge printing needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            'speaker-coordination': [
                {'question_text': 'Number of speakers?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 1},
                {'question_text': 'Technical requirements per speaker?', 'question_type': 'dropdown', 'options': ['Basic (mic + screen)', 'Standard (AV setup)', 'Advanced (full production)', 'Custom requirements'], 'is_required': True, 'order': 2},
                {'question_text': 'Green room needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            
            # SEMINAR
            'presentation-equipment': [
                {'question_text': 'Type needed?', 'question_type': 'dropdown', 'options': ['Projector only', 'Screen only', 'Laptop', 'Pointer', 'Complete setup (All items)'], 'is_required': True, 'order': 1},
                {'question_text': 'Backup equipment required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 2}
            ],
            'audio-system': [
                {'question_text': 'Room size?', 'question_type': 'dropdown', 'options': ['Small (up to 30)', 'Medium (30-100)', 'Large (100-300)', 'Extra Large (300+)'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of speakers?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Recording needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'recording-equipment': [
                {'question_text': 'Video or audio only?', 'question_type': 'dropdown', 'options': ['Video only', 'Audio only', 'Both video and audio'], 'is_required': True, 'order': 1},
                {'question_text': 'Quality level?', 'question_type': 'dropdown', 'options': ['Standard (720p)', 'HD (1080p)', '4K', 'Professional grade'], 'is_required': True, 'order': 2},
                {'question_text': 'Live streaming integration?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'handout-printing': [
                {'question_text': 'Number of copies?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Color or B&W?', 'question_type': 'dropdown', 'options': ['Black & White', 'Color', 'Mixed (some color, some B&W)'], 'is_required': True, 'order': 2},
                {'question_text': 'Page count?', 'question_type': 'dropdown', 'options': ['1-5 pages', '6-20 pages', '21-50 pages', '50+ pages'], 'is_required': True, 'order': 3},
                {'question_text': 'Binding type?', 'question_type': 'dropdown', 'options': ['No binding', 'Stapled', 'Spiral bound', 'Perfect bound'], 'is_required': True, 'order': 4}
            ],
            'workshop-materials': [
                {'question_text': 'What materials?', 'question_type': 'dropdown', 'options': ['Notebooks only', 'Pens only', 'Folders only', 'Complete kit (Notebooks, Pens, Folders)', 'Custom materials'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 500, 'is_required': True, 'order': 2},
                {'question_text': 'Custom branding?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'name-badges': [
                {'question_text': 'Badge type?', 'question_type': 'dropdown', 'options': ['Paper', 'Plastic', 'Magnetic', 'Premium (Metal/Wood)'], 'is_required': True, 'order': 1},
                {'question_text': 'Custom design needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 2},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 3}
            ],
            
            # CORPORATE PARTY
            'corporate-dj': [
                {'question_text': 'Music genre preference?', 'question_type': 'dropdown', 'options': ['Pop/Top 40', 'Rock', 'Jazz', 'Electronic/Dance', 'Mixed genres'], 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '3 hours', '4 hours', '5+ hours'], 'is_required': True, 'order': 2},
                {'question_text': 'Special song requests?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'live-band': [
                {'question_text': 'Band type/genre?', 'question_type': 'dropdown', 'options': ['Rock band', 'Jazz band', 'Acoustic', 'Cover band', 'Corporate entertainment band'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of sets?', 'question_type': 'dropdown', 'options': ['1 set (45 min)', '2 sets (90 min)', '3 sets (2+ hours)', 'Continuous performance'], 'is_required': True, 'order': 2},
                {'question_text': 'Space requirements?', 'question_type': 'dropdown', 'options': ['Small stage area', 'Medium stage', 'Large stage', 'No stage needed'], 'is_required': True, 'order': 3}
            ],
            'team-building-activities': [
                {'question_text': 'Number of participants?', 'question_type': 'number', 'min_value': 5, 'max_value': 500, 'is_required': True, 'order': 1},
                {'question_text': 'Indoor or outdoor?', 'question_type': 'dropdown', 'options': ['Indoor only', 'Outdoor only', 'Both indoor and outdoor', 'Flexible'], 'is_required': True, 'order': 2},
                {'question_text': 'Activity type preference?', 'question_type': 'dropdown', 'options': ['Problem solving games', 'Physical challenges', 'Creative workshops', 'Communication exercises', 'Mixed activities'], 'is_required': True, 'order': 3},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours', 'Half day', 'Full day'], 'is_required': True, 'order': 4}
            ],
            'cocktail-service': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Open bar or limited selection?', 'question_type': 'dropdown', 'options': ['Open bar', 'Limited selection', 'Premium selection', 'Non-alcoholic only'], 'is_required': True, 'order': 2},
                {'question_text': 'Signature cocktails?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3},
                {'question_text': 'Duration of service?', 'question_type': 'dropdown', 'options': ['2 hours', '3 hours', '4 hours', '5+ hours'], 'is_required': True, 'order': 4}
            ],
            'dinner-buffet': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Cuisine type?', 'question_type': 'dropdown', 'options': ['Indian', 'Continental', 'Chinese', 'Italian', 'Mixed international'], 'is_required': True, 'order': 2},
                {'question_text': 'Number of courses?', 'question_type': 'dropdown', 'options': ['Appetizers only', 'Main course only', 'Appetizers + Main', 'Full course (App + Main + Dessert)'], 'is_required': True, 'order': 3},
                {'question_text': 'Dietary requirements?', 'question_type': 'dropdown', 'options': ['Standard', 'Vegetarian options', 'Vegan options', 'Gluten-free', 'Multiple dietary needs'], 'is_required': True, 'order': 4}
            ],
            'bartender-service': [
                {'question_text': 'Number of bartenders?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 1},
                {'question_text': 'Bar setup type?', 'question_type': 'dropdown', 'options': ['Single main bar', 'Multiple bar stations', 'Mobile bar cart', 'Premium bar setup'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '3 hours', '4 hours', '5+ hours', 'Full event'], 'is_required': True, 'order': 3}
            ],
            
            # SOCIAL EVENTS - Wedding
            'wedding-catering': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 5000, 'is_required': True, 'order': 1},
                {'question_text': 'Cuisine type?', 'question_type': 'dropdown', 'options': ['North Indian', 'South Indian', 'Continental', 'Fusion'], 'is_required': True, 'order': 2},
                {'question_text': 'Veg, Non-veg, or Both?', 'question_type': 'radio', 'options': ['Veg only', 'Non-veg only', 'Both'], 'is_required': True, 'order': 3},
                {'question_text': 'Jain food required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4},
                {'question_text': 'Number of courses?', 'question_type': 'dropdown', 'options': ['3 courses', '4 courses', '5+ courses'], 'is_required': True, 'order': 5},
                {'question_text': 'Live counters needed?', 'question_type': 'checkbox', 'options': ['Chaat', 'Dosa', 'Pasta', 'Ice cream'], 'is_required': False, 'order': 6},
                {'question_text': 'Buffet or Plated service?', 'question_type': 'radio', 'options': ['Buffet', 'Plated service'], 'is_required': True, 'order': 7}
            ],
            'lighting-setup': [
                {'question_text': 'Venue type?', 'question_type': 'dropdown', 'options': ['Indoor', 'Outdoor', 'Semi-outdoor'], 'is_required': True, 'order': 1},
                {'question_text': 'Lighting style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Modern', 'Elegant'], 'is_required': True, 'order': 2},
                {'question_text': 'Special effects?', 'question_type': 'checkbox', 'options': ['Fairy lights', 'Chandeliers', 'LED'], 'is_required': False, 'order': 3},
                {'question_text': 'Dance floor lighting needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ],
            'wedding-band': [
                {'question_text': 'Band type?', 'question_type': 'dropdown', 'options': ['Live music', 'DJ', 'Orchestra'], 'is_required': True, 'order': 1},
                {'question_text': 'Music genres?', 'question_type': 'checkbox', 'options': ['Bollywood', 'Classical', 'Western', 'Folk'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 3},
                {'question_text': 'Song requests?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ],
            'dj-services': [
                {'question_text': 'Music style preference?', 'question_type': 'checkbox', 'options': ['Bollywood', 'Punjabi', 'English Pop', 'Electronic', 'Retro'], 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                {'question_text': 'Special equipment?', 'question_type': 'checkbox', 'options': ['Smoke machine', 'LED walls', 'Laser lights'], 'is_required': False, 'order': 3}
            ],
            'traditional-musicians': [
                {'question_text': 'Instrument type?', 'question_type': 'dropdown', 'options': ['Shehnai', 'Dhol', 'Nadaswaram', 'Tabla'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of musicians?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '4 hours', 'Full ceremony'], 'is_required': True, 'order': 3}
            ],
            'highlight-reel': [
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['3-5 minutes', '10-15 minutes'], 'is_required': True, 'order': 1},
                {'question_text': 'Music preference?', 'question_type': 'dropdown', 'options': ['Romantic', 'Upbeat', 'Traditional', 'Custom'], 'is_required': True, 'order': 2},
                {'question_text': 'Delivery timeline?', 'question_type': 'dropdown', 'options': ['Same day', '1 week', '2 weeks', '1 month'], 'is_required': True, 'order': 3}
            ],
            'ceremony-recording': [
                {'question_text': 'Which ceremonies?', 'question_type': 'checkbox', 'options': ['Mehendi', 'Sangeet', 'Wedding', 'Reception'], 'is_required': True, 'order': 1},
                {'question_text': 'Full recording or highlights?', 'question_type': 'radio', 'options': ['Full recording', 'Highlights only'], 'is_required': True, 'order': 2}
            ],
            'same-day-edit': [
                {'question_text': 'Required or optional?', 'question_type': 'radio', 'options': ['Required', 'Optional'], 'is_required': True, 'order': 1},
                {'question_text': 'Screening during reception?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2}
            ],
            
            # BIRTHDAY
            'magic-show': [
                {'question_text': 'Age group?', 'question_type': 'dropdown', 'options': ['Kids (3-8)', 'Children (8-12)', 'Teens (12-18)', 'Adults', 'Mixed'], 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['30 minutes', '45 minutes', '1 hour', '1.5 hours'], 'is_required': True, 'order': 2},
                {'question_text': 'Indoor or outdoor?', 'question_type': 'radio', 'options': ['Indoor', 'Outdoor'], 'is_required': True, 'order': 3}
            ],
            'clown-performance': [
                {'question_text': 'Number of kids?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['30 minutes', '45 minutes', '1 hour'], 'is_required': True, 'order': 2},
                {'question_text': 'Specific activities?', 'question_type': 'checkbox', 'options': ['Balloon making', 'Face painting', 'Games', 'Magic tricks'], 'is_required': False, 'order': 3}
            ],
            'face-painting': [
                {'question_text': 'Number of kids?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 1},
                {'question_text': 'Design themes?', 'question_type': 'checkbox', 'options': ['Animals', 'Superheroes', 'Flowers', 'Cartoon characters'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours'], 'is_required': True, 'order': 3}
            ],
            'balloon-artist': [
                {'question_text': 'Number of kids?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 1},
                {'question_text': 'Balloon types?', 'question_type': 'checkbox', 'options': ['Animals', 'Characters', 'Flowers', 'Swords'], 'is_required': True, 'order': 2}
            ],
            'birthday-cake': [
                {'question_text': 'Cake size?', 'question_type': 'dropdown', 'options': ['1 kg', '2 kg', '3 kg', '5+ kg'], 'is_required': True, 'order': 1},
                {'question_text': 'Theme/design?', 'question_type': 'text', 'placeholder': 'Describe cake theme', 'is_required': False, 'order': 2},
                {'question_text': 'Flavor?', 'question_type': 'dropdown', 'options': ['Chocolate', 'Vanilla', 'Strawberry', 'Black Forest', 'Custom'], 'is_required': True, 'order': 3}
            ],
            'snacks-refreshments': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 200, 'is_required': True, 'order': 1},
                {'question_text': 'Food preferences?', 'question_type': 'checkbox', 'options': ['Sandwiches', 'Pizza', 'Snacks', 'Fruits'], 'is_required': True, 'order': 2},
                {'question_text': 'Birthday menu theme?', 'question_type': 'text', 'placeholder': 'Any specific theme', 'is_required': False, 'order': 3}
            ],
            'party-treats': [
                {'question_text': 'Type of treats?', 'question_type': 'checkbox', 'options': ['Cookies', 'Candies', 'Chocolates', 'Cupcakes'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 10, 'max_value': 500, 'is_required': True, 'order': 2},
                {'question_text': 'Packaging preference?', 'question_type': 'dropdown', 'options': ['Individual packs', 'Bulk serving', 'Gift bags'], 'is_required': True, 'order': 3}
            ],
            'balloon-decoration': [
                {'question_text': 'Balloon type?', 'question_type': 'dropdown', 'options': ['Latex', 'Foil/Mylar', 'LED Balloons', 'Helium Balloons'], 'is_required': True, 'order': 1},
                {'question_text': 'Decoration style?', 'question_type': 'dropdown', 'options': ['Arch', 'Columns', 'Ceiling Decoration', 'Backdrop'], 'is_required': True, 'order': 2},
                {'question_text': 'Color scheme?', 'question_type': 'text', 'placeholder': 'Preferred colors', 'is_required': True, 'order': 3}
            ],
            'theme-decoration': [
                {'question_text': 'Theme type?', 'question_type': 'text', 'placeholder': 'e.g., Superhero, Princess, Cartoon', 'is_required': True, 'order': 1},
                {'question_text': 'Decoration elements?', 'question_type': 'checkbox', 'options': ['Backdrop', 'Props', 'Centerpieces', 'Entrance Decor'], 'is_required': True, 'order': 2},
                {'question_text': 'Budget range for decoration?', 'question_type': 'dropdown', 'options': ['₹5,000-₹15,000', '₹15,000-₹30,000', '₹30,000-₹50,000', '₹50,000+'], 'is_required': False, 'order': 3}
            ],
            'banner-setup': [
                {'question_text': 'Banner size?', 'question_type': 'dropdown', 'options': ['Small (2x3 ft)', 'Medium (3x5 ft)', 'Large (4x6 ft)', 'Extra Large (6x8 ft)'], 'is_required': True, 'order': 1},
                {'question_text': 'Content/message?', 'question_type': 'text', 'placeholder': 'Banner text/message', 'is_required': True, 'order': 2},
                {'question_text': 'Material type?', 'question_type': 'dropdown', 'options': ['Vinyl', 'Fabric', 'Paper', 'Flex'], 'is_required': True, 'order': 3}
            ]
        }
        
        # Add questions for all missing requirements
        missing_requirements = {
            # Festival Events
            'aarti-ceremony': [
                {'question_text': 'Timing preference?', 'question_type': 'dropdown', 'options': ['Morning', 'Evening', 'Both'], 'is_required': True, 'order': 1},
                {'question_text': 'Aarti thali provided?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2}
            ],
            'bhajan-singing': [
                {'question_text': 'Number of singers?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours', '4+ hours'], 'is_required': True, 'order': 2},
                {'question_text': 'Song preferences?', 'question_type': 'text', 'placeholder': 'Specific bhajans or general', 'is_required': False, 'order': 3}
            ],
            'festive-sweets': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Sweet variety?', 'question_type': 'checkbox', 'options': ['Ladoo', 'Barfi', 'Jalebi', 'Gulab Jamun'], 'is_required': True, 'order': 2},
                {'question_text': 'Quantity per type?', 'question_type': 'dropdown', 'options': ['1 kg', '2 kg', '5 kg', '10+ kg'], 'is_required': True, 'order': 3}
            ],
            'traditional-food': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Regional cuisine?', 'question_type': 'dropdown', 'options': ['North Indian', 'South Indian', 'East Indian', 'West Indian'], 'is_required': True, 'order': 2}
            ],
            'mithai-counter': [
                {'question_text': 'Live counter or pre-packed?', 'question_type': 'radio', 'options': ['Live counter', 'Pre-packed'], 'is_required': True, 'order': 1},
                {'question_text': 'Variety of sweets?', 'question_type': 'number', 'min_value': 3, 'max_value': 20, 'is_required': True, 'order': 2}
            ],
            'lakshmi-puja': [
                {'question_text': 'Priest needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of participants?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 2}
            ],
            # Health Events
            'doctors': [
                {'question_text': 'Number of doctors?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 1},
                {'question_text': 'Specialization needed?', 'question_type': 'dropdown', 'options': ['General physician', 'Cardiologist', 'Diabetologist', 'Mixed'], 'is_required': True, 'order': 2}
            ],
            'refreshment-counter': [
                {'question_text': 'Food type?', 'question_type': 'dropdown', 'options': ['Light snacks', 'Healthy options', 'Full meals', 'Beverages only'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 2}
            ],
            # Sports Events
            'scoreboards': [
                {'question_text': 'Scoreboard type?', 'question_type': 'dropdown', 'options': ['Electronic', 'Manual', 'Digital display'], 'is_required': True, 'order': 1},
                {'question_text': 'Number needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 2}
            ],
            'referees-umpires': [
                {'question_text': 'Number needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 1},
                {'question_text': 'Certification required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2}
            ],
            'medical-staff': [
                {'question_text': 'Number of medical personnel?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 1},
                {'question_text': 'Ambulance on standby?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2}
            ],
            'player-refreshments': [
                {'question_text': 'Refreshment type?', 'question_type': 'checkbox', 'options': ['Energy drinks', 'Water', 'Snacks', 'Fruits'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 10, 'max_value': 500, 'is_required': True, 'order': 2}
            ],
            'trophy-awards': [
                {'question_text': 'Number of trophies?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 1},
                {'question_text': 'Trophy design?', 'question_type': 'dropdown', 'options': ['Standard', 'Custom', 'Premium'], 'is_required': True, 'order': 2}
            ]
        }
        
        # Merge missing requirements with existing ones
        requirement_questions.update(missing_requirements)
        
        created_count = 0
        
        # Create questions for each requirement
        for req_id, questions in requirement_questions.items():
            try:
                # Find all requirements with this requirement_id across all events
                requirements = EventRequirement.objects.filter(requirement_id=req_id)
                
                for requirement in requirements:
                    for q_data in questions:
                        question, created = RequirementQuestion.objects.get_or_create(
                            requirement=requirement,
                            question_text=q_data['question_text'],
                            defaults=q_data
                        )
                        if created:
                            created_count += 1
                
                if requirements.exists():
                    self.stdout.write(f'Created questions for {req_id} ({requirements.count()} events)')
                
            except Exception as e:
                self.stdout.write(f'Error creating questions for {req_id}: {str(e)}')
        
        if created_count > 0:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {created_count} requirement questions')
            )
        else:
            self.stdout.write(
                self.style.WARNING('No questions were created. Check if EventRequirement data exists.')
            )