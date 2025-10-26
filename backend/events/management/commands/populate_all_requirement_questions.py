from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Populate requirement questions for all special requirements'

    def handle(self, *args, **options):
        # Clear existing questions (if table exists)
        try:
            RequirementQuestion.objects.all().delete()
            self.stdout.write('Cleared existing questions')
        except Exception as e:
            self.stdout.write(f'No existing questions to clear: {str(e)}')
        
        # Define questions for each requirement type
        requirement_questions = {
            # Technical Requirements
            'projector-setup': [
                {'question_text': 'Projector type needed?', 'question_type': 'dropdown', 'options': ['LCD', 'DLP', 'LED', 'Laser'], 'order': 1},
                {'question_text': 'Brightness level (lumens)?', 'question_type': 'dropdown', 'options': ['2000-3000', '3000-4000', '4000-5000', '5000+'], 'order': 2},
                {'question_text': 'Screen size preference?', 'question_type': 'dropdown', 'options': ['Small (6-8 ft)', 'Medium (8-12 ft)', 'Large (12-16 ft)', 'Extra Large (16+ ft)'], 'order': 3},
                {'question_text': 'Number of projectors?', 'question_type': 'number', 'min_value': 1, 'max_value': 10, 'order': 4}
            ],
            'av-equipment': [
                {'question_text': 'Equipment type needed?', 'question_type': 'dropdown', 'options': ['Projectors', 'Screens', 'Speakers', 'Microphones', 'All'], 'order': 1},
                {'question_text': 'Venue size?', 'question_type': 'dropdown', 'options': ['Small (up to 50)', 'Medium (50-200)', 'Large (200-500)', 'Extra Large (500+)'], 'order': 2},
                {'question_text': 'Backup equipment needed?', 'question_type': 'radio', 'options': ['Yes', 'No'], 'order': 3}
            ],
            'sound-system': [
                {'question_text': 'Sound system type?', 'question_type': 'dropdown', 'options': ['Basic PA', 'Professional', 'Concert Grade', 'Wireless'], 'order': 1},
                {'question_text': 'Microphone type?', 'question_type': 'dropdown', 'options': ['Handheld', 'Lapel/Clip-on', 'Headset', 'Multiple Types'], 'order': 2},
                {'question_text': 'Number of microphones?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'order': 3}
            ],
            'lighting-setup': [
                {'question_text': 'Lighting type?', 'question_type': 'dropdown', 'options': ['Basic', 'Mood Lighting', 'Stage Lighting', 'LED Effects', 'Disco Lights'], 'order': 1},
                {'question_text': 'Color scheme preference?', 'question_type': 'dropdown', 'options': ['Warm White', 'Cool White', 'Multicolor', 'Theme Based'], 'order': 2},
                {'question_text': 'Special effects needed?', 'question_type': 'checkbox', 'options': ['Fog Machine', 'Strobe Lights', 'Laser Lights', 'Moving Heads'], 'order': 3}
            ],
            
            # Decoration Requirements
            'floral-arrangements': [
                {'question_text': 'Flower type preference?', 'question_type': 'dropdown', 'options': ['Roses', 'Lilies', 'Orchids', 'Marigolds', 'Mixed Flowers'], 'order': 1},
                {'question_text': 'Arrangement style?', 'question_type': 'dropdown', 'options': ['Bouquets', 'Centerpieces', 'Garlands', 'Wall Decorations'], 'order': 2},
                {'question_text': 'Color theme?', 'question_type': 'text', 'placeholder': 'e.g., Red & White, Pastel Colors', 'order': 3}
            ],
            'balloon-decoration': [
                {'question_text': 'Balloon type?', 'question_type': 'dropdown', 'options': ['Latex', 'Foil/Mylar', 'LED Balloons', 'Helium Balloons'], 'order': 1},
                {'question_text': 'Decoration style?', 'question_type': 'dropdown', 'options': ['Arch', 'Columns', 'Ceiling Decoration', 'Backdrop'], 'order': 2},
                {'question_text': 'Color scheme?', 'question_type': 'text', 'placeholder': 'Preferred colors', 'order': 3}
            ],
            'theme-decoration': [
                {'question_text': 'Theme type?', 'question_type': 'text', 'placeholder': 'e.g., Bollywood, Vintage, Modern', 'order': 1},
                {'question_text': 'Decoration elements?', 'question_type': 'checkbox', 'options': ['Backdrop', 'Props', 'Centerpieces', 'Entrance Decor'], 'order': 2},
                {'question_text': 'Budget range for decoration?', 'question_type': 'dropdown', 'options': ['₹5,000-₹15,000', '₹15,000-₹30,000', '₹30,000-₹50,000', '₹50,000+'], 'order': 3}
            ],
            
            # Catering Requirements
            'event-catering': [
                {'question_text': 'Meal type?', 'question_type': 'dropdown', 'options': ['Breakfast', 'Lunch', 'Dinner', 'Snacks Only', 'Full Day'], 'order': 1},
                {'question_text': 'Cuisine preference?', 'question_type': 'dropdown', 'options': ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Mixed'], 'order': 2},
                {'question_text': 'Service style?', 'question_type': 'dropdown', 'options': ['Buffet', 'Plated Service', 'Family Style', 'Cocktail Style'], 'order': 3},
                {'question_text': 'Dietary restrictions?', 'question_type': 'checkbox', 'options': ['Vegetarian', 'Vegan', 'Jain', 'Gluten-Free', 'No Restrictions'], 'order': 4}
            ],
            'refreshments': [
                {'question_text': 'Beverage type?', 'question_type': 'checkbox', 'options': ['Tea/Coffee', 'Soft Drinks', 'Fresh Juices', 'Mocktails', 'Water'], 'order': 1},
                {'question_text': 'Snack preference?', 'question_type': 'checkbox', 'options': ['Samosas', 'Sandwiches', 'Cookies', 'Fruits', 'Mixed Snacks'], 'order': 2},
                {'question_text': 'Service timing?', 'question_type': 'dropdown', 'options': ['Morning', 'Afternoon', 'Evening', 'Multiple Times'], 'order': 3}
            ],
            
            # Entertainment Requirements
            'live-music': [
                {'question_text': 'Music type?', 'question_type': 'dropdown', 'options': ['Classical', 'Bollywood', 'Western', 'Folk', 'Fusion'], 'order': 1},
                {'question_text': 'Performance type?', 'question_type': 'dropdown', 'options': ['Solo Artist', 'Band', 'Orchestra', 'DJ + Live'], 'order': 2},
                {'question_text': 'Duration needed?', 'question_type': 'dropdown', 'options': ['1-2 hours', '2-4 hours', '4-6 hours', 'Full Event'], 'order': 3}
            ],
            'dj-services': [
                {'question_text': 'Music genre preference?', 'question_type': 'checkbox', 'options': ['Bollywood', 'Punjabi', 'English Pop', 'Electronic', 'Retro'], 'order': 1},
                {'question_text': 'Equipment included?', 'question_type': 'checkbox', 'options': ['Sound System', 'Microphones', 'Lighting', 'Fog Machine'], 'order': 2},
                {'question_text': 'Special requests?', 'question_type': 'text', 'placeholder': 'Any specific songs or announcements', 'order': 3}
            ],
            'dance-performance': [
                {'question_text': 'Dance style?', 'question_type': 'dropdown', 'options': ['Classical', 'Bollywood', 'Folk', 'Contemporary', 'Fusion'], 'order': 1},
                {'question_text': 'Performance duration?', 'question_type': 'dropdown', 'options': ['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes'], 'order': 2},
                {'question_text': 'Number of performers?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'order': 3}
            ],
            
            # Photography Requirements
            'event-photography': [
                {'question_text': 'Photography style?', 'question_type': 'dropdown', 'options': ['Candid', 'Traditional', 'Artistic', 'Documentary', 'Mixed'], 'order': 1},
                {'question_text': 'Coverage duration?', 'question_type': 'dropdown', 'options': ['2-4 hours', '4-6 hours', '6-8 hours', 'Full Day'], 'order': 2},
                {'question_text': 'Deliverables needed?', 'question_type': 'checkbox', 'options': ['Digital Photos', 'Printed Album', 'USB Drive', 'Online Gallery'], 'order': 3}
            ],
            'videography': [
                {'question_text': 'Video style?', 'question_type': 'dropdown', 'options': ['Cinematic', 'Documentary', 'Highlight Reel', 'Live Streaming'], 'order': 1},
                {'question_text': 'Equipment needed?', 'question_type': 'checkbox', 'options': ['Multiple Cameras', 'Drone Shots', 'Stabilizers', 'Professional Audio'], 'order': 2},
                {'question_text': 'Final delivery format?', 'question_type': 'dropdown', 'options': ['Digital File', 'DVD/Blu-ray', 'USB Drive', 'Online Link'], 'order': 3}
            ],
            
            # Transportation Requirements
            'guest-transportation': [
                {'question_text': 'Vehicle type needed?', 'question_type': 'dropdown', 'options': ['Bus', 'Tempo Traveller', 'Cars', 'Luxury Vehicles'], 'order': 1},
                {'question_text': 'Number of vehicles?', 'question_type': 'number', 'min_value': 1, 'max_value': 20, 'order': 2},
                {'question_text': 'Distance to cover?', 'question_type': 'dropdown', 'options': ['Within City', '50-100 km', '100-200 km', '200+ km'], 'order': 3}
            ],
            'valet-parking': [
                {'question_text': 'Expected vehicles?', 'question_type': 'number', 'min_value': 10, 'max_value': 500, 'placeholder': 'Approximate number', 'order': 1},
                {'question_text': 'Service duration?', 'question_type': 'dropdown', 'options': ['2-4 hours', '4-6 hours', '6-8 hours', '8+ hours'], 'order': 2},
                {'question_text': 'Special requirements?', 'question_type': 'text', 'placeholder': 'Any specific instructions', 'order': 3}
            ],
            
            # Security Requirements
            'security-services': [
                {'question_text': 'Security type needed?', 'question_type': 'dropdown', 'options': ['Uniformed Guards', 'Plain Clothes', 'Bouncers', 'Mixed Team'], 'order': 1},
                {'question_text': 'Number of personnel?', 'question_type': 'number', 'min_value': 1, 'max_value': 50, 'order': 2},
                {'question_text': 'Special requirements?', 'question_type': 'checkbox', 'options': ['Metal Detectors', 'Bag Checking', 'VIP Protection', 'Crowd Control'], 'order': 3}
            ],
            
            # Accommodation Requirements
            'guest-accommodation': [
                {'question_text': 'Room type preference?', 'question_type': 'dropdown', 'options': ['Standard Rooms', 'Deluxe Rooms', 'Suites', 'Mixed Types'], 'order': 1},
                {'question_text': 'Number of rooms?', 'question_type': 'number', 'min_value': 1, 'max_value': 100, 'order': 2},
                {'question_text': 'Duration of stay?', 'question_type': 'dropdown', 'options': ['1 Night', '2 Nights', '3 Nights', '4+ Nights'], 'order': 3},
                {'question_text': 'Amenities required?', 'question_type': 'checkbox', 'options': ['WiFi', 'Breakfast', 'Airport Transfer', 'Spa Access'], 'order': 4}
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