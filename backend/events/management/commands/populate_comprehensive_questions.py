from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Populate comprehensive requirement questions for all events'

    def handle(self, *args, **options):
        # Clear existing questions
        RequirementQuestion.objects.all().delete()
        self.stdout.write('Cleared existing questions')
        
        # Define all questions from the comprehensive list
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
            'event-catering': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 5000, 'is_required': True, 'order': 1},
                {'question_text': 'Meal type?', 'question_type': 'dropdown', 'options': ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], 'is_required': True, 'order': 2},
                {'question_text': 'Dietary restrictions?', 'question_type': 'checkbox', 'options': ['Veg', 'Non-veg', 'Vegan', 'Gluten-free', 'Halal', 'Jain'], 'is_required': False, 'order': 3},
                {'question_text': 'Service style?', 'question_type': 'dropdown', 'options': ['Buffet', 'Plated', 'Family-style'], 'is_required': True, 'order': 4},
                {'question_text': 'Cuisine preference?', 'question_type': 'text', 'placeholder': 'Specify cuisine preference', 'is_required': False, 'order': 5}
            ],
            'event-coordination': [
                {'question_text': 'Event duration?', 'question_type': 'dropdown', 'options': ['Half day', 'Full day', '2 days', '3+ days'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of coordinators needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 2},
                {'question_text': 'Specific responsibilities?', 'question_type': 'text', 'placeholder': 'Describe coordination needs', 'is_required': False, 'order': 3}
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
            
            # FESTIVAL EVENTS
            'diya-decoration': [
                {'question_text': 'Number of diyas needed?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Diya type?', 'question_type': 'dropdown', 'options': ['Clay diyas', 'Decorative diyas', 'LED diyas'], 'is_required': True, 'order': 2},
                {'question_text': 'Oil or wax?', 'question_type': 'radio', 'options': ['Oil', 'Wax'], 'is_required': True, 'order': 3}
            ],
            'rangoli-setup': [
                {'question_text': 'Rangoli size?', 'question_type': 'dropdown', 'options': ['Small (3x3 ft)', 'Medium (5x5 ft)', 'Large (8x8 ft)'], 'is_required': True, 'order': 1},
                {'question_text': 'Design complexity?', 'question_type': 'dropdown', 'options': ['Simple', 'Moderate', 'Complex'], 'is_required': True, 'order': 2},
                {'question_text': 'Materials?', 'question_type': 'checkbox', 'options': ['Colored powder', 'Flower petals', 'Rice'], 'is_required': True, 'order': 3}
            ],
            
            # HEALTH EVENTS
            'health-screening': [
                {'question_text': 'Screening types?', 'question_type': 'checkbox', 'options': ['Blood pressure', 'Sugar', 'BMI', 'Cholesterol'], 'is_required': True, 'order': 1},
                {'question_text': 'Expected participants?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 2},
                {'question_text': 'Duration of camp?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full day'], 'is_required': True, 'order': 3}
            ],
            'medical-equipment': [
                {'question_text': 'Equipment needed?', 'question_type': 'checkbox', 'options': ['BP monitor', 'Glucometer', 'Weighing scale', 'Stethoscope'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 2},
                {'question_text': 'Calibration required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            
            # SPORTS EVENTS
            'sports-equipment': [
                {'question_text': 'Sport type?', 'question_type': 'dropdown', 'options': ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis'], 'is_required': True, 'order': 1},
                {'question_text': 'Equipment quality?', 'question_type': 'dropdown', 'options': ['Professional', 'Amateur', 'Basic'], 'is_required': True, 'order': 2},
                {'question_text': 'Backup equipment needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'timing-systems': [
                {'question_text': 'System type?', 'question_type': 'dropdown', 'options': ['Electronic timing', 'Manual stopwatch', 'Professional timing'], 'is_required': True, 'order': 1},
                {'question_text': 'Sport-specific requirements?', 'question_type': 'text', 'placeholder': 'Describe specific timing needs', 'is_required': False, 'order': 2}
            ],
            
            # EDUCATIONAL EVENTS
            'workshop-kits': [
                {'question_text': 'Kit contents?', 'question_type': 'checkbox', 'options': ['Notebooks', 'Pens', 'Materials', 'Tools'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 500, 'is_required': True, 'order': 2},
                {'question_text': 'Take-home materials?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'expert-facilitators': [
                {'question_text': 'Number of facilitators?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 1},
                {'question_text': 'Expertise area?', 'question_type': 'text', 'placeholder': 'Specify expertise required', 'is_required': True, 'order': 2},
                {'question_text': 'Session duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', 'Full day', '2 days'], 'is_required': True, 'order': 3}
            ],
            
            # VIRTUAL EVENTS
            'webinar-platform': [
                {'question_text': 'Platform preference?', 'question_type': 'dropdown', 'options': ['Zoom', 'Teams', 'Google Meet', 'Webex'], 'is_required': True, 'order': 1},
                {'question_text': 'Expected attendees?', 'question_type': 'number', 'min_value': 1, 'max_value': 10000, 'is_required': True, 'order': 2},
                {'question_text': 'Features needed?', 'question_type': 'checkbox', 'options': ['Breakout rooms', 'Polls', 'Q&A', 'Recording'], 'is_required': True, 'order': 3},
                {'question_text': 'Recording required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ],
            
            # ENVIRONMENTAL EVENTS
            'tree-saplings': [
                {'question_text': 'Tree species preference?', 'question_type': 'dropdown', 'options': ['Native species', 'Fruit trees', 'Flowering trees', 'Mixed variety'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of saplings?', 'question_type': 'number', 'min_value': 10, 'max_value': 10000, 'is_required': True, 'order': 2},
                {'question_text': 'Sapling age/height?', 'question_type': 'dropdown', 'options': ['6 months', '1 year', '2 years', '3+ years'], 'is_required': True, 'order': 3},
                {'question_text': 'Native or exotic species?', 'question_type': 'radio', 'options': ['Native', 'Exotic', 'Mixed'], 'is_required': True, 'order': 4}
            ],
            'gardening-tools': [
                {'question_text': 'Tool types?', 'question_type': 'checkbox', 'options': ['Shovels', 'Hoes', 'Rakes', 'Watering cans'], 'is_required': True, 'order': 1},
                {'question_text': 'Quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 2},
                {'question_text': 'Personal or shared tools?', 'question_type': 'radio', 'options': ['Personal', 'Shared'], 'is_required': True, 'order': 3}
            ],
            
            # POLITICAL EVENTS
            'crowd-management': [
                {'question_text': 'Expected crowd size?', 'question_type': 'dropdown', 'options': ['Under 100', '100-500', '500-1000', '1000-5000', '5000+'], 'is_required': True, 'order': 1},
                {'question_text': 'Barricading needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Entry/exit points?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 3},
                {'question_text': 'Emergency protocols?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 4}
            ],
            'security-coordination': [
                {'question_text': 'Security personnel quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 200, 'is_required': True, 'order': 1},
                {'question_text': 'VIP security needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Metal detectors required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3},
                {'question_text': 'CCTV surveillance needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 4}
            ]
        }
        
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