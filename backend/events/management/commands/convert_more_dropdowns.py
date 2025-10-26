from django.core.management.base import BaseCommand
from events.models import RequirementQuestion

class Command(BaseCommand):
    help = 'Convert more text questions to dropdown questions with predefined options'

    def handle(self, *args, **options):
        # Define conversion mappings
        conversions = {
            # Theme and Decoration
            'Theme type?': {
                'type': 'dropdown',
                'options': ['Traditional', 'Modern', 'Vintage', 'Minimalist', 'Luxury', 'Rustic', 'Bohemian', 'Classic']
            },
            
            'Decoration theme?': {
                'type': 'dropdown',
                'options': ['Traditional', 'Modern', 'Vintage', 'Floral', 'Elegant', 'Rustic', 'Minimalist', 'Themed']
            },
            
            # Equipment Types
            'Equipment type needed?': {
                'type': 'dropdown',
                'options': ['Basic equipment', 'Professional equipment', 'Specialized equipment', 'Rental equipment', 'Custom equipment']
            },
            
            # Group Seating
            'What type of group seating do you need?': {
                'type': 'dropdown',
                'options': ['Round tables', 'Long tables', 'Classroom style', 'Theater style', 'Lounge seating', 'Standing tables']
            },
            
            # Visitor Registration
            'What type of visitor registration do you need?': {
                'type': 'dropdown',
                'options': ['Digital registration', 'Manual registration', 'QR code check-in', 'Badge printing', 'Mobile app registration']
            },
            
            # Motivational Sessions
            'What type of motivational sessions do you need?': {
                'type': 'dropdown',
                'options': ['Keynote speeches', 'Interactive workshops', 'Group sessions', 'One-on-one coaching', 'Team building activities']
            },
            
            # Meditation Guides
            'What type of meditation guides do you need?': {
                'type': 'dropdown',
                'options': ['Guided meditation', 'Silent meditation', 'Walking meditation', 'Group meditation', 'Specialized techniques']
            },
            
            # Donor Registration
            'What type of donor registration do you need?': {
                'type': 'dropdown',
                'options': ['Online registration', 'On-site registration', 'Pre-registration', 'Walk-in registration', 'VIP registration']
            },
            
            # Route Marking
            'What type of route marking do you need?': {
                'type': 'dropdown',
                'options': ['Signage boards', 'Floor markings', 'Banners', 'Digital displays', 'Temporary markers']
            },
            
            # Poets
            'What type of poets do you need?': {
                'type': 'dropdown',
                'options': ['Hindi poets', 'English poets', 'Regional language poets', 'Sufi poets', 'Contemporary poets']
            },
            
            # Dandiya Sticks
            'What type of dandiya sticks do you need?': {
                'type': 'dropdown',
                'options': ['Traditional wooden sticks', 'Decorated sticks', 'LED sticks', 'Colorful sticks', 'Premium quality sticks']
            },
            
            # Support Groups
            'What type of support groups do you need?': {
                'type': 'dropdown',
                'options': ['Peer support groups', 'Professional support', 'Family support groups', 'Online support', 'Specialized support']
            },
            
            # Peer Learning Groups
            'What type of peer learning groups do you need?': {
                'type': 'dropdown',
                'options': ['Study groups', 'Discussion groups', 'Project groups', 'Skill sharing groups', 'Mentorship circles']
            },
            
            # Speed Networking
            'What type of speed networking do you need?': {
                'type': 'dropdown',
                'options': ['Business networking', 'Professional networking', 'Industry-specific networking', 'Startup networking', 'Career networking']
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
            self.style.SUCCESS(f'Successfully converted {updated_count} more questions to dropdown format')
        )