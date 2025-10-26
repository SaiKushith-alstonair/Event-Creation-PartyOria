from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Populate requirement questions for corporate events'

    def handle(self, *args, **options):
        # Conference - Projector Setup Questions
        try:
            projector_req = EventRequirement.objects.get(
                event_id='conference',
                requirement_id='projector-setup'
            )
            
            questions = [
                {
                    'question_text': 'Which projector type?',
                    'question_type': 'dropdown',
                    'options': ['LCD', 'DLP', 'LED', 'Laser'],
                    'order': 1
                },
                {
                    'question_text': 'What brightness level (lumens)?',
                    'question_type': 'dropdown',
                    'options': ['2000-3000', '3000-4000', '4000-5000', '5000+'],
                    'order': 2
                },
                {
                    'question_text': 'Screen size preference?',
                    'question_type': 'dropdown',
                    'options': ['Small (6-8 ft)', 'Medium (8-12 ft)', 'Large (12-16 ft)', 'Extra Large (16+ ft)'],
                    'order': 3
                },
                {
                    'question_text': 'Number of projectors needed?',
                    'question_type': 'number',
                    'min_value': 1,
                    'max_value': 10,
                    'placeholder': 'Enter quantity',
                    'order': 4
                }
            ]
            
            for q_data in questions:
                RequirementQuestion.objects.get_or_create(
                    requirement=projector_req,
                    question_text=q_data['question_text'],
                    defaults=q_data
                )
            
            self.stdout.write(f'Created questions for {projector_req.label}')
            
        except EventRequirement.DoesNotExist:
            self.stdout.write('Projector setup requirement not found')

        # Conference - AV Equipment Questions
        try:
            av_req = EventRequirement.objects.get(
                event_id='conference',
                requirement_id='av-equipment'
            )
            
            questions = [
                {
                    'question_text': 'What type of AV equipment do you need?',
                    'question_type': 'dropdown',
                    'options': ['Projectors', 'Screens', 'Speakers', 'Microphones', 'All of the above'],
                    'order': 1
                },
                {
                    'question_text': 'What is your venue size?',
                    'question_type': 'dropdown',
                    'options': ['Small (up to 50)', 'Medium (50-200)', 'Large (200-500)', 'Extra Large (500+)'],
                    'order': 2
                },
                {
                    'question_text': 'Do you need backup equipment?',
                    'question_type': 'dropdown',
                    'options': ['Yes', 'No'],
                    'order': 3
                }
            ]
            
            for q_data in questions:
                RequirementQuestion.objects.get_or_create(
                    requirement=av_req,
                    question_text=q_data['question_text'],
                    defaults=q_data
                )
            
            self.stdout.write(f'Created questions for {av_req.label}')
            
        except EventRequirement.DoesNotExist:
            self.stdout.write('AV equipment requirement not found')

        self.stdout.write(self.style.SUCCESS('Successfully populated requirement questions'))