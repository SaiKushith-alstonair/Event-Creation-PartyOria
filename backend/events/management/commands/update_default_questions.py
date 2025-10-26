from django.core.management.base import BaseCommand
from events.models import RequirementQuestion, EventRequirement

class Command(BaseCommand):
    help = 'Update requirements that have default questions with specific ones'

    def handle(self, *args, **options):
        # Find requirements with default questions
        default_questions = RequirementQuestion.objects.filter(
            question_text='Please specify your requirements'
        )
        
        requirement_ids = set()
        for q in default_questions:
            requirement_ids.add(q.requirement.requirement_id)
        
        self.stdout.write(f'Found {len(requirement_ids)} requirements with default questions')
        
        # Specific questions for each requirement type
        specific_questions = {
            # Photography & Videography
            'event-photography': [
                {'question_text': 'Photography style?', 'question_type': 'dropdown', 'options': ['Candid', 'Traditional', 'Artistic', 'Documentary'], 'is_required': True, 'order': 1},
                {'question_text': 'Coverage duration?', 'question_type': 'dropdown', 'options': ['2-4 hours', '4-6 hours', '6-8 hours', 'Full Day'], 'is_required': True, 'order': 2},
                {'question_text': 'Deliverables needed?', 'question_type': 'checkbox', 'options': ['Digital Photos', 'Printed Album', 'USB Drive', 'Online Gallery'], 'is_required': True, 'order': 3}
            ],
            'candid-photography': [
                {'question_text': 'Number of photographers?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 1},
                {'question_text': 'Event duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                {'question_text': 'Photo editing included?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'professional-portraits': [
                {'question_text': 'Number of subjects?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 1},
                {'question_text': 'Portrait style?', 'question_type': 'dropdown', 'options': ['Formal', 'Casual', 'Creative', 'Traditional'], 'is_required': True, 'order': 2},
                {'question_text': 'Background preference?', 'question_type': 'dropdown', 'options': ['Studio backdrop', 'Natural setting', 'Venue background'], 'is_required': True, 'order': 3}
            ],
            'event-videography': [
                {'question_text': 'Video style?', 'question_type': 'dropdown', 'options': ['Cinematic', 'Documentary', 'Highlight Reel', 'Live Coverage'], 'is_required': True, 'order': 1},
                {'question_text': 'Equipment needed?', 'question_type': 'checkbox', 'options': ['Multiple Cameras', 'Drone Shots', 'Stabilizers', 'Professional Audio'], 'is_required': True, 'order': 2},
                {'question_text': 'Final delivery format?', 'question_type': 'dropdown', 'options': ['Digital File', 'DVD/Blu-ray', 'USB Drive', 'Online Link'], 'is_required': True, 'order': 3}
            ],
            
            # Decoration & Setup
            'event-decoration': [
                {'question_text': 'Decoration theme?', 'question_type': 'text', 'placeholder': 'Describe your theme', 'is_required': True, 'order': 1},
                {'question_text': 'Color scheme?', 'question_type': 'text', 'placeholder': 'Preferred colors', 'is_required': True, 'order': 2},
                {'question_text': 'Decoration areas?', 'question_type': 'checkbox', 'options': ['Entrance', 'Stage', 'Tables', 'Ceiling', 'Walls'], 'is_required': True, 'order': 3}
            ],
            'floral-arrangements': [
                {'question_text': 'Flower type preference?', 'question_type': 'dropdown', 'options': ['Roses', 'Lilies', 'Orchids', 'Marigolds', 'Mixed Flowers'], 'is_required': True, 'order': 1},
                {'question_text': 'Arrangement style?', 'question_type': 'dropdown', 'options': ['Bouquets', 'Centerpieces', 'Garlands', 'Wall Decorations'], 'is_required': True, 'order': 2},
                {'question_text': 'Color theme?', 'question_type': 'text', 'placeholder': 'e.g., Red & White, Pastel Colors', 'is_required': False, 'order': 3}
            ],
            'stage-setup': [
                {'question_text': 'Stage size needed?', 'question_type': 'dropdown', 'options': ['Small (10x10 ft)', 'Medium (15x15 ft)', 'Large (20x20 ft)', 'Custom size'], 'is_required': True, 'order': 1},
                {'question_text': 'Stage height?', 'question_type': 'dropdown', 'options': ['Ground level', '2 feet', '3 feet', '4+ feet'], 'is_required': True, 'order': 2},
                {'question_text': 'Backdrop needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            'stage-lighting': [
                {'question_text': 'Lighting complexity?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'Advanced', 'Professional'], 'is_required': True, 'order': 1},
                {'question_text': 'Special effects?', 'question_type': 'checkbox', 'options': ['Spotlights', 'Color changes', 'Moving lights', 'Fog effects'], 'is_required': False, 'order': 2},
                {'question_text': 'Light operator needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
            ],
            
            # Music & Entertainment
            'sound-system': [
                {'question_text': 'Venue size?', 'question_type': 'dropdown', 'options': ['Small (up to 50)', 'Medium (50-200)', 'Large (200-500)', 'Extra Large (500+)'], 'is_required': True, 'order': 1},
                {'question_text': 'Audio quality level?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'High Quality', 'Professional'], 'is_required': True, 'order': 2},
                {'question_text': 'Number of microphones?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 3}
            ],
            'music-system': [
                {'question_text': 'Music source?', 'question_type': 'dropdown', 'options': ['Playlist', 'Live DJ', 'Live band', 'Mixed'], 'is_required': True, 'order': 1},
                {'question_text': 'Sound quality?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'High-end'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 3}
            ],
            
            # Catering
            'refreshments': [
                {'question_text': 'Beverage type?', 'question_type': 'checkbox', 'options': ['Tea/Coffee', 'Soft Drinks', 'Fresh Juices', 'Water'], 'is_required': True, 'order': 1},
                {'question_text': 'Snack preference?', 'question_type': 'checkbox', 'options': ['Samosas', 'Sandwiches', 'Cookies', 'Fruits'], 'is_required': True, 'order': 2},
                {'question_text': 'Service timing?', 'question_type': 'dropdown', 'options': ['Morning', 'Afternoon', 'Evening', 'Multiple Times'], 'is_required': True, 'order': 3}
            ],
            'beverage-service': [
                {'question_text': 'Beverage types?', 'question_type': 'checkbox', 'options': ['Hot beverages', 'Cold beverages', 'Juices', 'Alcoholic drinks'], 'is_required': True, 'order': 1},
                {'question_text': 'Service duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 3}
            ],
            
            # Transportation
            'transportation': [
                {'question_text': 'Transportation type?', 'question_type': 'dropdown', 'options': ['Bus', 'Car', 'Tempo Traveller', 'Luxury vehicle'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of passengers?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 2},
                {'question_text': 'Distance to travel?', 'question_type': 'dropdown', 'options': ['Within city', '50-100 km', '100-200 km', '200+ km'], 'is_required': True, 'order': 3}
            ],
            'transportation-service': [
                {'question_text': 'Vehicle type needed?', 'question_type': 'dropdown', 'options': ['Car', 'Bus', 'Tempo Traveller', 'Luxury car'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of people?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 2},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full day'], 'is_required': True, 'order': 3}
            ],
            
            # Security & Safety
            'security-services': [
                {'question_text': 'Security type needed?', 'question_type': 'dropdown', 'options': ['Uniformed Guards', 'Plain Clothes', 'Bouncers', 'Mixed Team'], 'is_required': True, 'order': 1},
                {'question_text': 'Number of personnel?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 2},
                {'question_text': 'Special requirements?', 'question_type': 'checkbox', 'options': ['Metal Detectors', 'Bag Checking', 'VIP Protection', 'Crowd Control'], 'is_required': False, 'order': 3}
            ],
            
            # Cleanup & Maintenance
            'cleanup-services': [
                {'question_text': 'Cleanup timing?', 'question_type': 'dropdown', 'options': ['During event', 'Post event', 'Both'], 'is_required': True, 'order': 1},
                {'question_text': 'Waste disposal method?', 'question_type': 'dropdown', 'options': ['Regular pickup', 'Segregated disposal', 'Recycling'], 'is_required': True, 'order': 2},
                {'question_text': 'Area size?', 'question_type': 'dropdown', 'options': ['Small', 'Medium', 'Large', 'Multiple areas'], 'is_required': True, 'order': 3}
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