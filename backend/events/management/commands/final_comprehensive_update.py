from django.core.management.base import BaseCommand
from events.models import RequirementQuestion, EventRequirement

class Command(BaseCommand):
    help = 'Final comprehensive update for ALL remaining requirements'

    def handle(self, *args, **options):
        # Get all requirements that still have default questions
        default_questions = RequirementQuestion.objects.filter(
            question_text='Please specify your requirements'
        )
        
        requirement_ids = set()
        for q in default_questions:
            requirement_ids.add(q.requirement.requirement_id)
        
        self.stdout.write(f'Updating {len(requirement_ids)} remaining requirements')
        
        # Generate appropriate questions based on requirement type
        def generate_questions_for_requirement(req_id):
            # Photography related
            if 'photography' in req_id or 'photo' in req_id:
                return [
                    {'question_text': 'Photography style needed?', 'question_type': 'dropdown', 'options': ['Candid', 'Traditional', 'Artistic', 'Professional'], 'is_required': True, 'order': 1},
                    {'question_text': 'Duration of coverage?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                    {'question_text': 'Number of photographers?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 3}
                ]
            
            # Videography related
            elif 'video' in req_id or 'recording' in req_id or 'streaming' in req_id:
                return [
                    {'question_text': 'Video quality needed?', 'question_type': 'dropdown', 'options': ['HD (1080p)', '4K', 'Professional grade', 'Standard'], 'is_required': True, 'order': 1},
                    {'question_text': 'Recording duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                    {'question_text': 'Editing required?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': False, 'order': 3}
                ]
            
            # Music/Audio related
            elif any(word in req_id for word in ['music', 'audio', 'sound', 'dj', 'band', 'singer']):
                return [
                    {'question_text': 'Music type preference?', 'question_type': 'dropdown', 'options': ['Live music', 'DJ', 'Recorded music', 'Mixed'], 'is_required': True, 'order': 1},
                    {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 2},
                    {'question_text': 'Sound system included?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'is_required': True, 'order': 3}
                ]
            
            # Decoration related
            elif any(word in req_id for word in ['decoration', 'decor', 'setup', 'design', 'lighting', 'flower']):
                return [
                    {'question_text': 'Decoration theme?', 'question_type': 'text', 'placeholder': 'Describe your theme preference', 'is_required': True, 'order': 1},
                    {'question_text': 'Color scheme?', 'question_type': 'text', 'placeholder': 'Preferred colors', 'is_required': True, 'order': 2},
                    {'question_text': 'Setup duration?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full day'], 'is_required': True, 'order': 3}
                ]
            
            # Catering related
            elif any(word in req_id for word in ['catering', 'food', 'meal', 'lunch', 'dinner', 'snack', 'refreshment']):
                return [
                    {'question_text': 'Number of guests?', 'question_type': 'number', 'min_value': 1, 'max_value': 1000, 'is_required': True, 'order': 1},
                    {'question_text': 'Food preference?', 'question_type': 'dropdown', 'options': ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Mixed'], 'is_required': True, 'order': 2},
                    {'question_text': 'Service style?', 'question_type': 'dropdown', 'options': ['Buffet', 'Plated service', 'Counter service', 'Self-service'], 'is_required': True, 'order': 3}
                ]
            
            # Transportation related
            elif any(word in req_id for word in ['transport', 'vehicle', 'car', 'bus']):
                return [
                    {'question_text': 'Vehicle type needed?', 'question_type': 'dropdown', 'options': ['Car', 'Bus', 'Tempo Traveller', 'Luxury vehicle'], 'is_required': True, 'order': 1},
                    {'question_text': 'Number of passengers?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'is_required': True, 'order': 2},
                    {'question_text': 'Distance to travel?', 'question_type': 'dropdown', 'options': ['Within city', '50-100 km', '100+ km'], 'is_required': True, 'order': 3}
                ]
            
            # Entertainment related
            elif any(word in req_id for word in ['entertainment', 'performance', 'show', 'artist', 'dancer']):
                return [
                    {'question_text': 'Entertainment type?', 'question_type': 'dropdown', 'options': ['Live performance', 'Interactive show', 'Background entertainment'], 'is_required': True, 'order': 1},
                    {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['30 minutes', '1 hour', '2 hours', '3+ hours'], 'is_required': True, 'order': 2},
                    {'question_text': 'Audience size?', 'question_type': 'dropdown', 'options': ['Small (up to 50)', 'Medium (50-200)', 'Large (200+)'], 'is_required': True, 'order': 3}
                ]
            
            # Coordination/Management related
            elif any(word in req_id for word in ['coordination', 'management', 'coordinator', 'planning']):
                return [
                    {'question_text': 'Coordination scope?', 'question_type': 'dropdown', 'options': ['Full event', 'Specific activities', 'Vendor coordination', 'Guest management'], 'is_required': True, 'order': 1},
                    {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['Half day', 'Full day', '2 days', '3+ days'], 'is_required': True, 'order': 2},
                    {'question_text': 'Number of coordinators?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 3}
                ]
            
            # Security related
            elif any(word in req_id for word in ['security', 'safety', 'guard']):
                return [
                    {'question_text': 'Security type needed?', 'question_type': 'dropdown', 'options': ['Uniformed guards', 'Plain clothes', 'Bouncers', 'Mixed team'], 'is_required': True, 'order': 1},
                    {'question_text': 'Number of personnel?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'is_required': True, 'order': 2},
                    {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['4 hours', '6 hours', '8 hours', '12+ hours'], 'is_required': True, 'order': 3}
                ]
            
            # Equipment related
            elif any(word in req_id for word in ['equipment', 'tools', 'supplies', 'materials']):
                return [
                    {'question_text': 'Equipment type needed?', 'question_type': 'text', 'placeholder': 'Specify equipment required', 'is_required': True, 'order': 1},
                    {'question_text': 'Quantity required?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'is_required': True, 'order': 2},
                    {'question_text': 'Quality level?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'Professional', 'Premium'], 'is_required': True, 'order': 3}
                ]
            
            # Medical/Health related
            elif any(word in req_id for word in ['medical', 'health', 'doctor', 'nurse']):
                return [
                    {'question_text': 'Medical service type?', 'question_type': 'dropdown', 'options': ['First aid', 'Medical checkup', 'Emergency care', 'Consultation'], 'is_required': True, 'order': 1},
                    {'question_text': 'Number of medical staff?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'is_required': True, 'order': 2},
                    {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['2 hours', '4 hours', '6 hours', 'Full event'], 'is_required': True, 'order': 3}
                ]
            
            # Default questions for unmatched requirements
            else:
                return [
                    {'question_text': f'What type of {req_id.replace("-", " ")} do you need?', 'question_type': 'text', 'placeholder': 'Describe your requirements', 'is_required': True, 'order': 1},
                    {'question_text': 'Quantity or duration needed?', 'question_type': 'text', 'placeholder': 'Specify quantity/duration', 'is_required': True, 'order': 2},
                    {'question_text': 'Quality level preferred?', 'question_type': 'dropdown', 'options': ['Basic', 'Standard', 'Premium', 'Luxury'], 'is_required': True, 'order': 3}
                ]
        
        updated_count = 0
        
        for req_id in requirement_ids:
            try:
                # Delete existing default questions for this requirement
                requirements = EventRequirement.objects.filter(requirement_id=req_id)
                for requirement in requirements:
                    RequirementQuestion.objects.filter(requirement=requirement).delete()
                    
                    # Add generated questions
                    questions = generate_questions_for_requirement(req_id)
                    for q_data in questions:
                        RequirementQuestion.objects.create(
                            requirement=requirement,
                            **q_data
                        )
                        updated_count += 1
                
                self.stdout.write(f'Updated {req_id}')
                
            except Exception as e:
                self.stdout.write(f'Error updating {req_id}: {str(e)}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} questions for all remaining requirements')
        )