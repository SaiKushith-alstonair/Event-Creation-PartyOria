from django.core.management.base import BaseCommand
from events.models import RequirementQuestion, EventRequirement

class Command(BaseCommand):
    help = 'Test questions for sample requirements'

    def handle(self, *args, **options):
        # Test a few sample requirements
        test_requirements = ['event-photography', 'av-equipment', 'wedding-catering', 'dj-services']
        
        for req_id in test_requirements:
            req = EventRequirement.objects.filter(requirement_id=req_id).first()
            if req:
                questions = RequirementQuestion.objects.filter(requirement=req)
                self.stdout.write(f'\n{req_id} ({questions.count()} questions):')
                for q in questions[:3]:
                    self.stdout.write(f'  - {q.question_text}')
            else:
                self.stdout.write(f'{req_id}: Not found')
        
        # Check if any default questions remain
        default_count = RequirementQuestion.objects.filter(
            question_text='Please specify your requirements'
        ).count()
        
        self.stdout.write(f'\nRemaining default questions: {default_count}')
        self.stdout.write(f'Total questions in database: {RequirementQuestion.objects.count()}')