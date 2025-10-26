from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Add questions for all missing requirements'

    def handle(self, *args, **options):
        # Get all requirements that don't have questions
        reqs_with_questions = set(RequirementQuestion.objects.values_list('requirement__requirement_id', flat=True))
        all_reqs = EventRequirement.objects.values_list('requirement_id', flat=True).distinct()
        missing_reqs = [req for req in all_reqs if req not in reqs_with_questions]
        
        self.stdout.write(f'Found {len(missing_reqs)} requirements without questions')
        
        # Default questions for any requirement
        default_questions = [
            {'question_text': 'Please specify your requirements', 'question_type': 'text', 'placeholder': 'Describe your specific needs', 'is_required': True, 'order': 1},
            {'question_text': 'Quantity needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 2},
            {'question_text': 'Any special requirements?', 'question_type': 'text', 'placeholder': 'Additional details', 'is_required': False, 'order': 3}
        ]
        
        # Specific questions for known requirements
        specific_questions = {
            # Add all the specific questions from your file
            'accommodation-coordination': [
                {'question_text': 'Number of rooms needed?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 1},
                {'question_text': 'Room type preference?', 'question_type': 'dropdown', 'options': ['Standard', 'Deluxe', 'Suite', 'Mixed'], 'is_required': True, 'order': 2},
                {'question_text': 'Duration of stay?', 'question_type': 'dropdown', 'options': ['1 night', '2 nights', '3 nights', '4+ nights'], 'is_required': True, 'order': 3}
            ],
            'achievement-display': [
                {'question_text': 'Display items?', 'question_type': 'checkbox', 'options': ['Certificates', 'Photos', 'Awards', 'Trophies'], 'is_required': True, 'order': 1},
                {'question_text': 'Display format?', 'question_type': 'dropdown', 'options': ['Wall display', 'Table display', 'Digital display'], 'is_required': True, 'order': 2}
            ],
            'acoustic-setup': [
                {'question_text': 'Venue acoustics?', 'question_type': 'dropdown', 'options': ['Good', 'Average', 'Poor', 'Unknown'], 'is_required': True, 'order': 1},
                {'question_text': 'Sound amplification needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 2},
                {'question_text': 'Audio mixing required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'activity-planning': [
                {'question_text': 'Activities planned?', 'question_type': 'checkbox', 'options': ['Games', 'Contests', 'Workshops', 'Entertainment'], 'is_required': True, 'order': 1},
                {'question_text': 'Age-appropriate options?', 'question_type': 'dropdown', 'options': ['Kids only', 'Adults only', 'Mixed age groups'], 'is_required': True, 'order': 2},
                {'question_text': 'Equipment needed?', 'question_type': 'text', 'placeholder': 'List equipment needed', 'is_required': False, 'order': 3}
            ],
            'actors': [
                {'question_text': 'Number of actors?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 1},
                {'question_text': 'Costume changes?', 'question_type': 'number', 'min_value': 0, 'max_value': 10, 'is_required': False, 'order': 2},
                {'question_text': 'Green room facilities?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'adoption-ceremony': [
                {'question_text': 'Ceremony format?', 'question_type': 'dropdown', 'options': ['Formal', 'Informal', 'Religious', 'Legal only'], 'is_required': True, 'order': 1},
                {'question_text': 'Religious elements?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 2}
            ],
            'altar-decoration': [
                {'question_text': 'Altar size?', 'question_type': 'dropdown', 'options': ['Small', 'Medium', 'Large'], 'is_required': True, 'order': 1},
                {'question_text': 'Decoration style?', 'question_type': 'dropdown', 'options': ['Traditional', 'Modern', 'Minimalist'], 'is_required': True, 'order': 2},
                {'question_text': 'Flowers included?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'ambulance-service': [
                {'question_text': 'Number of ambulances?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 1},
                {'question_text': 'Mobile or stationary?', 'question_type': 'radio', 'options': ['Mobile', 'Stationary'], 'is_required': True, 'order': 2},
                {'question_text': 'Route coverage?', 'question_type': 'text', 'placeholder': 'Describe coverage area', 'is_required': False, 'order': 3}
            ],
            'anniversary-cake': [
                {'question_text': 'Cake size?', 'question_type': 'dropdown', 'options': ['1 kg', '2 kg', '3 kg', '5+ kg'], 'is_required': True, 'order': 1},
                {'question_text': 'Design theme?', 'question_type': 'text', 'placeholder': 'Anniversary theme', 'is_required': False, 'order': 2},
                {'question_text': 'Flavor preference?', 'question_type': 'dropdown', 'options': ['Chocolate', 'Vanilla', 'Strawberry', 'Custom'], 'is_required': True, 'order': 3}
            ],
            'anniversary-photography': [
                {'question_text': 'Photography style?', 'question_type': 'dropdown', 'options': ['Candid', 'Traditional', 'Artistic'], 'is_required': True, 'order': 1},
                {'question_text': 'Duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                {'question_text': 'Album needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'announcement-coordination': [
                {'question_text': 'Announcement format?', 'question_type': 'dropdown', 'options': ['Formal presentation', 'Press conference', 'Internal meeting'], 'is_required': True, 'order': 1},
                {'question_text': 'Stakeholder list?', 'question_type': 'text', 'placeholder': 'Key stakeholders to inform', 'is_required': True, 'order': 2},
                {'question_text': 'Timing?', 'question_type': 'dropdown', 'options': ['Morning', 'Afternoon', 'Evening'], 'is_required': True, 'order': 3}
            ],
            'api-access': [
                {'question_text': 'Which APIs needed?', 'question_type': 'checkbox', 'options': ['Social media APIs', 'Payment APIs', 'Cloud services', 'Custom APIs'], 'is_required': True, 'order': 1},
                {'question_text': 'Access level?', 'question_type': 'dropdown', 'options': ['Read only', 'Read/Write', 'Full access'], 'is_required': True, 'order': 2},
                {'question_text': 'Documentation provided?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ],
            'appetizer-service': [
                {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 10, 'max_value': 1000, 'is_required': True, 'order': 1},
                {'question_text': 'Cuisine preference?', 'question_type': 'dropdown', 'options': ['International', 'Indian', 'Continental', 'Fusion'], 'is_required': True, 'order': 2},
                {'question_text': 'Dietary restrictions?', 'question_type': 'checkbox', 'options': ['Vegetarian', 'Vegan', 'Gluten-free', 'None'], 'is_required': False, 'order': 3}
            ],
            'appreciation-gifts': [
                {'question_text': 'Gift type?', 'question_type': 'dropdown', 'options': ['Trophies', 'Certificates', 'Mementos', 'Custom gifts'], 'is_required': True, 'order': 1},
                {'question_text': 'Customization?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 2},
                {'question_text': 'Budget per gift?', 'question_type': 'dropdown', 'options': ['Under ₹500', '₹500-₹1000', '₹1000-₹2000', '₹2000+'], 'is_required': False, 'order': 3}
            ],
            'area-mapping': [
                {'question_text': 'Area size?', 'question_type': 'dropdown', 'options': ['Small (under 1 acre)', 'Medium (1-5 acres)', 'Large (5+ acres)'], 'is_required': True, 'order': 1},
                {'question_text': 'Zone division?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Priority areas?', 'question_type': 'text', 'placeholder': 'Describe priority zones', 'is_required': False, 'order': 3}
            ],
            'aromatherapy': [
                {'question_text': 'Essential oils needed?', 'question_type': 'checkbox', 'options': ['Lavender', 'Eucalyptus', 'Peppermint', 'Custom blend'], 'is_required': True, 'order': 1},
                {'question_text': 'Diffusers quantity?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                {'question_text': 'Fragrance preference?', 'question_type': 'dropdown', 'options': ['Light', 'Medium', 'Strong'], 'is_required': True, 'order': 3}
            ],
            'art-instructors': [
                {'question_text': 'Number of instructors?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 1},
                {'question_text': 'Art medium?', 'question_type': 'dropdown', 'options': ['Painting', 'Sketching', 'Sculpture', 'Mixed'], 'is_required': True, 'order': 2},
                {'question_text': 'Skill level taught?', 'question_type': 'dropdown', 'options': ['Beginner', 'Intermediate', 'Advanced', 'All levels'], 'is_required': True, 'order': 3}
            ],
            'art-supplies': [
                {'question_text': 'Supply list?', 'question_type': 'checkbox', 'options': ['Paints', 'Brushes', 'Canvas', 'Paper', 'Pencils'], 'is_required': True, 'order': 1},
                {'question_text': 'Quality level?', 'question_type': 'dropdown', 'options': ['Student grade', 'Artist grade', 'Professional'], 'is_required': True, 'order': 2},
                {'question_text': 'Take-home supplies?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
            ]
        }
        
        created_count = 0
        
        for req_id in missing_reqs:
            try:
                requirements = EventRequirement.objects.filter(requirement_id=req_id)
                
                # Use specific questions if available, otherwise use default
                questions_to_use = specific_questions.get(req_id, default_questions)
                
                for requirement in requirements:
                    for q_data in questions_to_use:
                        question, created = RequirementQuestion.objects.get_or_create(
                            requirement=requirement,
                            question_text=q_data['question_text'],
                            defaults=q_data
                        )
                        if created:
                            created_count += 1
                
                if requirements.exists():
                    question_type = "specific" if req_id in specific_questions else "default"
                    self.stdout.write(f'Added {question_type} questions for {req_id} ({requirements.count()} events)')
                
            except Exception as e:
                self.stdout.write(f'Error creating questions for {req_id}: {str(e)}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} questions for missing requirements')
        )