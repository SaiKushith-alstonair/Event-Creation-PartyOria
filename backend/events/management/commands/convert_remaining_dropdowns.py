from django.core.management.base import BaseCommand
from events.models import RequirementQuestion

class Command(BaseCommand):
    help = 'Convert remaining "What type of" questions to dropdown format'

    def handle(self, *args, **options):
        conversions = {
            'What type of artisan booths do you need?': {
                'type': 'dropdown',
                'options': ['Handicraft booths', 'Food artisan booths', 'Art & craft booths', 'Traditional craft booths', 'Modern art booths']
            },
            
            'What type of dance instructors do you need?': {
                'type': 'dropdown',
                'options': ['Classical dance', 'Bollywood dance', 'Folk dance', 'Contemporary dance', 'Hip-hop dance']
            },
            
            'What type of assistant trainers do you need?': {
                'type': 'dropdown',
                'options': ['Fitness trainers', 'Sports trainers', 'Skill trainers', 'Technical trainers', 'Life coaches']
            },
            
            'What type of makeup services do you need?': {
                'type': 'dropdown',
                'options': ['Bridal makeup', 'Party makeup', 'Professional makeup', 'Traditional makeup', 'HD makeup']
            },
            
            'What type of mic hosts do you need?': {
                'type': 'dropdown',
                'options': ['Professional anchors', 'Celebrity hosts', 'Bilingual hosts', 'Comedy hosts', 'Corporate hosts']
            },
            
            'What type of memory lane display do you need?': {
                'type': 'dropdown',
                'options': ['Photo displays', 'Video montages', 'Timeline displays', 'Interactive displays', 'Digital galleries']
            },
            
            'What type of traditional sweets do you need?': {
                'type': 'dropdown',
                'options': ['Regional sweets', 'Festival sweets', 'Homemade sweets', 'Premium sweets', 'Sugar-free sweets']
            },
            
            'What type of lantern display do you need?': {
                'type': 'dropdown',
                'options': ['Paper lanterns', 'LED lanterns', 'Traditional lanterns', 'Floating lanterns', 'Sky lanterns']
            },
            
            'What type of debate preparation do you need?': {
                'type': 'dropdown',
                'options': ['Topic research', 'Speaking coaching', 'Argument structuring', 'Mock debates', 'Presentation skills']
            },
            
            'What type of voter registration do you need?': {
                'type': 'dropdown',
                'options': ['Online registration', 'Mobile registration', 'Booth registration', 'Door-to-door registration', 'Campus registration']
            },
            
            'What type of program booklets do you need?': {
                'type': 'dropdown',
                'options': ['Event programs', 'Wedding programs', 'Conference programs', 'Memorial programs', 'Festival programs']
            },
            
            'What type of waste disposal do you need?': {
                'type': 'dropdown',
                'options': ['General waste disposal', 'Recycling services', 'Organic waste disposal', 'Hazardous waste disposal', 'Bulk waste removal']
            },
            
            'What type of campaign rallies do you need?': {
                'type': 'dropdown',
                'options': ['Public rallies', 'Indoor rallies', 'Street campaigns', 'Digital campaigns', 'Community rallies']
            },
            
            'What type of timing systems do you need?': {
                'type': 'dropdown',
                'options': ['Digital timers', 'Stopwatches', 'Countdown timers', 'Race timing systems', 'Event scheduling systems']
            },
            
            'What type of dhak players do you need?': {
                'type': 'dropdown',
                'options': ['Traditional dhak players', 'Professional dhak groups', 'Festival dhak teams', 'Cultural dhak performers', 'Competition dhak players']
            },
            
            'What type of workshop facilitators do you need?': {
                'type': 'dropdown',
                'options': ['Technical facilitators', 'Creative facilitators', 'Business facilitators', 'Educational facilitators', 'Team building facilitators']
            },
            
            'What type of easter cake do you need?': {
                'type': 'dropdown',
                'options': ['Traditional Easter cake', 'Chocolate Easter cake', 'Fruit Easter cake', 'Custom Easter cake', 'Vegan Easter cake']
            },
            
            'What type of table setting do you need?': {
                'type': 'dropdown',
                'options': ['Formal table setting', 'Casual table setting', 'Buffet table setting', 'Themed table setting', 'Traditional table setting']
            },
            
            'What type of meditation instructor do you need?': {
                'type': 'dropdown',
                'options': ['Mindfulness instructor', 'Yoga meditation instructor', 'Zen meditation instructor', 'Guided meditation instructor', 'Group meditation leader']
            },
            
            'What type of harmonium tabla do you need?': {
                'type': 'dropdown',
                'options': ['Professional harmonium & tabla', 'Traditional instruments', 'Electronic instruments', 'Rental instruments', 'Performance grade instruments']
            }
        }
        
        updated_count = 0
        
        for question_text, config in conversions.items():
            questions = RequirementQuestion.objects.filter(
                question_text=question_text,
                question_type='text'
            )
            
            for question in questions:
                question.question_type = config['type']
                question.options = config['options']
                question.save()
                updated_count += 1
                self.stdout.write(f"Updated: {question.requirement.label} - {question_text}")
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully converted {updated_count} remaining questions to dropdown format')
        )