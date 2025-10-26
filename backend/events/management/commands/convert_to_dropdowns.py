from django.core.management.base import BaseCommand
from events.models import RequirementQuestion

class Command(BaseCommand):
    help = 'Convert text questions to dropdown questions with predefined options'

    def handle(self, *args, **options):
        # Define conversion mappings
        conversions = {
            # LED Screens
            'What type of led screens do you need?': {
                'type': 'dropdown',
                'options': ['Indoor LED', 'Outdoor LED', 'Curved LED', 'Transparent LED', 'Flexible LED']
            },
            
            # Storage Solutions
            'What type of storage solutions do you need?': {
                'type': 'dropdown',
                'options': ['Temporary storage', 'Equipment storage', 'Document storage', 'Cold storage', 'Secure storage']
            },
            
            # Interactive Sessions
            'What type of interactive sessions do you need?': {
                'type': 'dropdown',
                'options': ['Q&A sessions', 'Workshops', 'Panel discussions', 'Breakout sessions', 'Networking sessions']
            },
            
            # Soil & Fertilizer
            'What type of soil fertilizer do you need?': {
                'type': 'dropdown',
                'options': ['Organic fertilizer', 'Chemical fertilizer', 'Compost', 'Liquid fertilizer', 'Slow-release fertilizer']
            },
            
            # Software Licenses
            'What type of software licenses do you need?': {
                'type': 'dropdown',
                'options': ['Event management software', 'Registration software', 'Live streaming software', 'Design software', 'Project management tools']
            },
            
            # Scoreboards
            'What type of scoreboards do you need?': {
                'type': 'dropdown',
                'options': ['Digital scoreboard', 'Manual scoreboard', 'LED scoreboard', 'Portable scoreboard', 'Multi-sport scoreboard']
            },
            
            # Expert Trainers
            'What type of expert trainers do you need?': {
                'type': 'dropdown',
                'options': ['Fitness trainers', 'Technical trainers', 'Skill development trainers', 'Leadership trainers', 'Specialized coaches']
            },
            
            # Family Tree Display
            'What type of family tree display do you need?': {
                'type': 'dropdown',
                'options': ['Digital display', 'Printed charts', 'Interactive display', 'Wall mounted', 'Portable display']
            },
            
            # Halal Meat Service
            'What type of halal meat service do you need?': {
                'type': 'dropdown',
                'options': ['Fresh meat supply', 'Cooked meat dishes', 'BBQ service', 'Traditional preparations', 'Catering service']
            },
            
            # AV Production
            'What type of av production do you need?': {
                'type': 'dropdown',
                'options': ['Live streaming', 'Video recording', 'Audio recording', 'Live broadcast', 'Post-production editing']
            },
            
            # Torans & Garlands
            'What type of torans garlands do you need?': {
                'type': 'dropdown',
                'options': ['Fresh flower garlands', 'Artificial garlands', 'Marigold torans', 'Rose garlands', 'Mixed flower arrangements']
            },
            
            # Industry Experts
            'What type of industry experts do you need?': {
                'type': 'dropdown',
                'options': ['Technical experts', 'Business consultants', 'Subject matter experts', 'Industry veterans', 'Innovation specialists']
            },
            
            # Industry Judges
            'What type of industry judges do you need?': {
                'type': 'dropdown',
                'options': ['Technical judges', 'Creative judges', 'Business judges', 'Academic judges', 'Celebrity judges']
            },
            
            # Display Systems
            'What type of display systems do you need?': {
                'type': 'dropdown',
                'options': ['LED displays', 'LCD screens', 'Projection systems', 'Interactive displays', 'Digital signage']
            },
            
            # Dance Floor
            'What type of dance floor do you need?': {
                'type': 'dropdown',
                'options': ['Wooden dance floor', 'LED dance floor', 'Portable dance floor', 'Outdoor dance floor', 'Traditional dance floor']
            },
            
            # Seating Arrangement
            'What type of seating arrangement do you need?': {
                'type': 'dropdown',
                'options': ['Theater style', 'Classroom style', 'U-shape', 'Banquet style', 'Cocktail style', 'Auditorium style']
            },
            
            # Sample Products
            'What type of sample products do you need?': {
                'type': 'dropdown',
                'options': ['Product samples', 'Demo products', 'Promotional items', 'Trial versions', 'Miniature models']
            },
            
            # Krishna Costumes
            'What type of krishna costumes do you need?': {
                'type': 'dropdown',
                'options': ['Traditional Krishna costume', 'Bal Krishna costume', 'Radha Krishna pair', 'Modern Krishna outfit', 'Regional style costume']
            },
            
            # Cultural Displays
            'What type of cultural displays do you need?': {
                'type': 'dropdown',
                'options': ['Traditional artifacts', 'Cultural exhibitions', 'Art displays', 'Heritage showcases', 'Interactive cultural zones']
            },
            
            # Aarti Ceremony
            'What type of aarti ceremony do you need?': {
                'type': 'dropdown',
                'options': ['Traditional aarti', 'Group aarti', 'Special occasion aarti', 'Daily aarti', 'Festival aarti']
            },
            
            # Turban Tying
            'What type of turban tying do you need?': {
                'type': 'dropdown',
                'options': ['Sikh turban', 'Rajasthani turban', 'Punjabi turban', 'Wedding turban', 'Traditional regional turban']
            },
            
            # Cocktail Reception
            'What type of cocktail reception do you need?': {
                'type': 'dropdown',
                'options': ['Welcome cocktails', 'Networking cocktails', 'Premium bar service', 'Signature cocktails', 'Non-alcoholic mocktails']
            },
            
            # Presentation Slides
            'What type of presentation slides do you need?': {
                'type': 'dropdown',
                'options': ['Business presentations', 'Educational slides', 'Marketing presentations', 'Technical presentations', 'Creative presentations']
            },
            
            # Technical Mentors
            'What type of technical mentors do you need?': {
                'type': 'dropdown',
                'options': ['Software development mentors', 'Engineering mentors', 'Data science mentors', 'AI/ML mentors', 'Cybersecurity mentors']
            },
            
            # Lead Capture System
            'What type of lead capture system do you need?': {
                'type': 'dropdown',
                'options': ['Digital lead capture', 'QR code system', 'Badge scanning', 'Mobile app integration', 'CRM integration']
            },
            
            # Campaign Merchandise
            'What type of campaign merchandise do you need?': {
                'type': 'dropdown',
                'options': ['T-shirts & apparel', 'Banners & flags', 'Badges & pins', 'Promotional items', 'Branded accessories']
            },
            
            # Executive Coaching
            'What type of executive coaching do you need?': {
                'type': 'dropdown',
                'options': ['Leadership coaching', 'Performance coaching', 'Career coaching', 'Communication coaching', 'Strategic coaching']
            },
            
            # Mentorship Program
            'What type of mentorship program do you need?': {
                'type': 'dropdown',
                'options': ['One-on-one mentorship', 'Group mentorship', 'Peer mentorship', 'Industry mentorship', 'Skill-based mentorship']
            },
            
            # Progress Documentation
            'What type of progress documentation do you need?': {
                'type': 'dropdown',
                'options': ['Photo documentation', 'Video documentation', 'Written reports', 'Digital portfolios', 'Progress tracking systems']
            },
            
            # Cultural Props
            'What type of cultural props do you need?': {
                'type': 'dropdown',
                'options': ['Traditional instruments', 'Cultural artifacts', 'Decorative props', 'Performance props', 'Educational displays']
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
            self.style.SUCCESS(f'Successfully converted {updated_count} questions to dropdown format')
        )