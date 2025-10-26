from django.core.management.base import BaseCommand
from events.models import RequirementQuestion, EventRequirement

class Command(BaseCommand):
    help = 'Add comprehensive specific questions for all requirements from the file'

    def handle(self, *args, **options):
        # Find all requirements that still have default questions
        default_questions = RequirementQuestion.objects.filter(
            question_text='Please specify your requirements'
        )
        
        requirement_ids = set()
        for q in default_questions:
            requirement_ids.add(q.requirement.requirement_id)
        
        self.stdout.write(f'Found {len(requirement_ids)} requirements still with default questions')
        
        # Comprehensive specific questions based on your file
        specific_questions = {
            # More Photography & Videography
            'bridal-photography': [
                {'question_text': 'Photography style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Candid', 'Artistic', 'Fashion'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of outfit changes?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 2},
                {'question_text': 'Makeup artist coordination?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'couple-photography': [
                {'question_text': 'Session type?', 'question_type': 'dropdown', 'options': ['Pre-wedding', 'Engagement', 'Anniversary', 'Casual'], 'is_required': True, 'order': 1},
                {'question_text': 'Location preference?', 'question_type': 'dropdown', 'options': ['Studio', 'Outdoor', 'Home', 'Destination'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours', '4+ hours'], 'is_required': True, 'order': 3}
            ],
            'family-photography': [
                {'question_text': 'Number of family members?', 'question_type': 'number', 'min_value': 2, 'max_value': 50, 'is_required': True, 'order': 1},
                {'question_text': 'Age groups included?', 'question_type': 'checkbox', 'options': ['Infants', 'Children', 'Adults', 'Seniors'], 'is_required': True, 'order': 2},
                {'question_text': 'Group photos needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            'reception-photography': [
                {'question_text': 'Coverage duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full reception'], 'is_required': True, 'order': 1},
                {'question_text': 'Key moments to capture?', 'question_type': 'checkbox', 'options': ['Entry', 'Speeches', 'Cake cutting', 'Dancing', 'Games'], 'is_required': True, 'order': 2},
                {'question_text': 'Guest photos included?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'mehendi-photography': [
                {'question_text': 'Mehendi session duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full day'], 'is_required': True, 'order': 1},
                {'question_text': 'Detail shots needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Group photos with friends?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'sangam-photography': [
                {'question_text': 'Ceremony duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours', '4+ hours'], 'is_required': True, 'order': 1},
                {'question_text': 'Traditional rituals coverage?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Family group photos?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'ring-ceremony-photography': [
                {'question_text': 'Ceremony style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Modern', 'Fusion'], 'is_required': True, 'order': 1},
                {'question_text': 'Ring exchange shots?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Guest reactions needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'traditional-portraits': [
                {'question_text': 'Portrait style?', 'question_type': 'dropdown', 'options': ['Classical', 'Traditional Indian', 'Vintage', 'Royal'], 'is_required': True, 'order': 1},
                {'question_text': 'Costume coordination?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 2},
                {'question_text': 'Props needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'wedding-album-design': [
                {'question_text': 'Album size?', 'question_type': 'dropdown', 'options': ['8x10 inches', '10x12 inches', '12x18 inches', 'Custom size'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of pages?', 'question_type': 'dropdown', 'options': ['20-30 pages', '30-50 pages', '50-80 pages', '80+ pages'], 'is_required': True, 'order': 2},
                {'question_text': 'Album material?', 'question_type': 'dropdown', 'options': ['Leather', 'Fabric', 'Acrylic', 'Premium'], 'is_required': True, 'order': 3}
            ],
            
            # Videography
            'wedding-videography': [
                {'question_text': 'Video style?', 'question_type': 'dropdown', 'options': ['Cinematic', 'Traditional', 'Documentary', 'Artistic'], 'is_required': True, 'order': 1},
                {'question_text': 'Ceremonies to cover?', 'question_type': 'checkbox', 'options': ['Mehendi', 'Sangeet', 'Wedding', 'Reception'], 'is_required': True, 'order': 2},
                {'question_text': 'Final video length?', 'question_type': 'dropdown', 'options': ['10-15 minutes', '20-30 minutes', '45-60 minutes', 'Full coverage'], 'is_required': True, 'order': 3}
            ],
            'drone-videography': [
                {'question_text': 'Aerial shots needed?', 'question_type': 'checkbox', 'options': ['Venue exterior', 'Procession', 'Group shots', 'Landscape'], 'is_required': True, 'order': 1},
                {'question_text': 'Flight permissions obtained?', 'question_type': 'radio', 'options': ['Yes', 'No', 'Need assistance'], 'is_required': True, 'order': 2},
                {'question_text': 'Weather backup plan?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'cinematic-video': [
                {'question_text': 'Video theme?', 'question_type': 'dropdown', 'options': ['Romantic', 'Traditional', 'Modern', 'Vintage'], 'is_required': True, 'order': 1},
                {'question_text': 'Music preference?', 'question_type': 'dropdown', 'options': ['Instrumental', 'Bollywood', 'Classical', 'Custom'], 'is_required': True, 'order': 2},
                {'question_text': 'Special effects needed?', 'question_type': 'checkbox', 'options': ['Slow motion', 'Time lapse', 'Color grading', 'Transitions'], 'is_required': False, 'order': 3}
            ],
            'pre-wedding-video': [
                {'question_text': 'Video concept?', 'question_type': 'dropdown', 'options': ['Love story', 'Fun & casual', 'Romantic', 'Adventure'], 'is_required': True, 'order': 1},
                {'question_text': 'Location shoots?', 'question_type': 'number', 'min_value': 1, 'max_value': 5, 'is_required': True, 'order': 2},
                {'question_text': 'Costume changes?', 'question_type': 'number', 'min_value': 1, 'max_value': 5, 'is_required': False, 'order': 3}
            ],
            
            # Entertainment
            'live-music': [
                {'question_text': 'Music type?', 'question_type': 'dropdown', 'options': ['Classical', 'Bollywood', 'Western', 'Folk', 'Fusion'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of musicians?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Performance duration?', 'question_type': 'dropdown', 'options': ['1 hour', '2 hours', '3 hours', '4+ hours'], 'is_required': True, 'order': 3}
            ],
            'dance-performance': [
                {'question_text': 'Dance style?', 'question_type': 'dropdown', 'options': ['Classical', 'Bollywood', 'Folk', 'Contemporary', 'Fusion'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of performers?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 2},
                {'question_text': 'Performance duration?', 'question_type': 'dropdown', 'options': ['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes'], 'is_required': True, 'order': 3}
            ],
            'cultural-performance': [
                {'question_text': 'Performance type?', 'question_type': 'dropdown', 'options': ['Dance', 'Music', 'Drama', 'Mixed'], 'is_required': True, 'order': 1},
                {'question_text': 'Cultural theme?', 'question_type': 'dropdown', 'options': ['Regional', 'Traditional', 'Folk', 'Classical'], 'is_required': True, 'order': 2},
                {'question_text': 'Audience participation?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            
            # Catering specific
            'snacks-catering': [
                {'question_text': 'Snack types?', 'question_type': 'checkbox', 'options': ['Samosas', 'Sandwiches', 'Pakoras', 'Chaat', 'Sweets'], 'is_required': True, 'order': 1},
                {'question_text': 'Service style?', 'question_type': 'dropdown', 'options': ['Buffet', 'Served', 'Counter service', 'Packed'], 'is_required': True, 'order': 2},
                {'question_text': 'Hot or cold items?', 'question_type': 'checkbox', 'options': ['Hot snacks', 'Cold snacks', 'Both'], 'is_required': True, 'order': 3}
            ],
            'lunch-catering': [
                {'question_text': 'Meal type?', 'question_type': 'dropdown', 'options': ['Light lunch', 'Full course meal', 'Buffet style', 'Packed lunch'], 'is_required': True, 'order': 1},
                {'question_text': 'Cuisine preference?', 'question_type': 'dropdown', 'options': ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Mixed'], 'is_required': True, 'order': 2},
                {'question_text': 'Dietary requirements?', 'question_type': 'checkbox', 'options': ['Vegetarian', 'Vegan', 'Jain', 'Gluten-free'], 'is_required': False, 'order': 3}
            ],
            'outdoor-catering': [
                {'question_text': 'Food service type?', 'question_type': 'dropdown', 'options': ['BBQ', 'Buffet', 'Food stalls', 'Packed meals'], 'is_required': True, 'order': 1},
                {'question_text': 'Weather contingency?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Cooking on-site?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            
            # Decoration specific
            'floral-decoration': [
                {'question_text': 'Flower types?', 'question_type': 'checkbox', 'options': ['Roses', 'Marigolds', 'Jasmine', 'Orchids', 'Seasonal flowers'], 'is_required': True, 'order': 1},
                {'question_text': 'Decoration style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Modern', 'Rustic', 'Elegant'], 'is_required': True, 'order': 2},
                {'question_text': 'Areas to decorate?', 'question_type': 'checkbox', 'options': ['Entrance', 'Stage', 'Tables', 'Mandap', 'Pathways'], 'is_required': True, 'order': 3}
            ],
            'mandap-decoration': [
                {'question_text': 'Mandap style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Modern', 'Floral', 'Crystal', 'Theme-based'], 'is_required': True, 'order': 1},
                {'question_text': 'Color scheme?', 'question_type': 'text', 'placeholder': 'Preferred colors', 'is_required': True, 'order': 2},
                {'question_text': 'Size requirements?', 'question_type': 'dropdown', 'options': ['Small (4 people)', 'Medium (6 people)', 'Large (8+ people)'], 'is_required': True, 'order': 3}
            ],
            
            # Technical & Equipment
            'sound-equipment': [
                {'question_text': 'Equipment type?', 'question_type': 'checkbox', 'options': ['Speakers', 'Microphones', 'Mixing console', 'Amplifiers'], 'is_required': True, 'order': 1},
                {'question_text': 'Venue coverage?', 'question_type': 'dropdown', 'options': ['Indoor only', 'Outdoor only', 'Both'], 'is_required': True, 'order': 2},
                {'question_text': 'Technical operator needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            'microphone-setup': [
                {'question_text': 'Microphone types?', 'question_type': 'checkbox', 'options': ['Handheld', 'Lapel', 'Headset', 'Podium'], 'is_required': True, 'order': 1},
                {'question_text': 'Number needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Wireless preferred?', 'question_type': 'radio', 'options': ['Yes', 'No', 'Mixed'], 'is_required': True, 'order': 3}
            ],
            'sound-amplification': [
                {'question_text': 'Coverage area?', 'question_type': 'dropdown', 'options': ['Small (up to 100)', 'Medium (100-300)', 'Large (300-500)', 'Extra Large (500+)'], 'is_required': True, 'order': 1},
                {'question_text': 'Sound quality level?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'High Quality', 'Professional'], 'is_required': True, 'order': 2},
                {'question_text': 'Backup system needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ]
        }
        
        updated_count = 0
        
        for req_id in requirement_ids:
            if req_id in specific_questions:
                try:
                    # Delete existing default questions for this requirement
                    requirements = EventRequirement.objects.filter(requirement_id=req_id)
                    for requirement in requirements:
                        RequirementQuestion.objects.filter(requirement=requirement).delete()
                        
                        # Add specific questions
                        for q_data in specific_questions[req_id]:
                            RequirementQuestion.objects.create(
                                requirement=requirement,
                                **q_data
                            )
                            updated_count += 1
                    
                    self.stdout.write(f'Updated {req_id} with specific questions')
                    
                except Exception as e:
                    self.stdout.write(f'Error updating {req_id}: {str(e)}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} questions with specific ones')
        )