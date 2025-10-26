from django.core.management.base import BaseCommand
from events.models import EventRequirement, RequirementQuestion

class Command(BaseCommand):
    help = 'Update requirements to include photo gallery functionality'

    def handle(self, *args, **options):
        # Photo gallery requirements mapping
        photo_requirements = {
            # Corporate Events
            'conference': ['event-photography', 'conference-videography', 'candid-photography', 'led-screens', 'stage-design'],
            'seminar': ['event-photography'],
            'corporate-party': ['photo-booth', 'floral-arrangements', 'lighting-design', 'corporate-branding'],
            'product-launch': ['product-photography', 'event-videography', 'stage-design'],
            'award-ceremony': ['stage-design', 'red-carpet-setup', 'ceremony-photography', 'award-videography', 'award-engraving'],
            'trade-show': ['booth-design', 'display-systems'],
            
            # Social Events
            'wedding': ['bridal-photography', 'couple-photography', 'family-photography', 'candid-photography', 
                       'reception-photography', 'mehendi-photography', 'sangam-photography', 'ring-ceremony-photography',
                       'traditional-portraits', 'wedding-album-design', 'wedding-videography', 'drone-videography',
                       'cinematic-video', 'mandap-decoration', 'floral-decoration', 'wedding-cake'],
            'birthday': ['balloon-decoration', 'theme-decoration', 'event-photography', 'candid-photography', 'birthday-cake'],
            'engagement': ['event-photography', 'candid-photography', 'event-decoration', 'floral-arrangements'],
            'anniversary': ['anniversary-photography', 'anniversary-cake'],
            'baby-shower': ['baby-themed-decoration', 'baby-shower-cake'],
            'pre-wedding-shoot': ['pre-wedding-photography', 'pre-wedding-decoration'],
            'gender-reveal-party': ['gender-reveal-setup', 'reveal-photography'],
            
            # Festival Events
            'diwali-celebration': ['diya-decoration', 'rangoli-setup', 'festive-lighting', 'lantern-display', 'flower-decoration', 'torans-garlands'],
            'christmas-celebration': ['christmas-tree-setup', 'christmas-ornaments', 'nativity-scene', 'christmas-cake'],
            
            # Environmental Events
            'tree-planting-drive': ['event-photography', 'candid-photography', 'progress-documentation'],
            
            # Religious Events
            'puja-ceremony': ['altar-decoration', 'flower-garlands', 'religious-banners'],
            
            # Cultural Events
            'cultural-fair': ['artwork-display', 'cultural-displays', 'gallery-lighting', 'performance-photography'],
            'heritage-walk': ['artwork-display', 'cultural-displays', 'gallery-lighting', 'performance-photography'],
            'cultural-exchange': ['artwork-display', 'cultural-displays', 'gallery-lighting', 'performance-photography'],
            
            # Entertainment Events
            'fashion-show': ['runway-setup', 'fashion-photography'],
            'dance-performance': ['stage-design', 'backdrop-design', 'event-photography'],
            'comedy-show': ['stage-design', 'backdrop-design', 'event-photography'],
            'theater-play': ['stage-design', 'backdrop-design', 'event-photography'],
            'magic-show': ['stage-design', 'backdrop-design', 'event-photography'],
        }
        
        updated_count = 0
        
        for event_id, requirement_ids in photo_requirements.items():
            for req_id in requirement_ids:
                # Check if requirement exists
                requirements = EventRequirement.objects.filter(
                    event_id=event_id,
                    requirement_id=req_id
                )
                
                if requirements.exists():
                    for requirement in requirements:
                        # Add photo gallery specific questions
                        gallery_questions = [
                            {
                                'question_text': 'Photo gallery style preference?',
                                'question_type': 'dropdown',
                                'options': ['Classic', 'Modern', 'Artistic', 'Professional'],
                                'is_required': True,
                                'order': 1
                            },
                            {
                                'question_text': 'Number of photos needed?',
                                'question_type': 'dropdown',
                                'options': ['50-100 photos', '100-200 photos', '200-500 photos', '500+ photos'],
                                'is_required': True,
                                'order': 2
                            },
                            {
                                'question_text': 'Digital delivery format?',
                                'question_type': 'dropdown',
                                'options': ['Online gallery', 'USB drive', 'Cloud storage', 'All formats'],
                                'is_required': True,
                                'order': 3
                            }
                        ]
                        
                        # Delete existing questions and add new ones
                        RequirementQuestion.objects.filter(requirement=requirement).delete()
                        
                        for q_data in gallery_questions:
                            RequirementQuestion.objects.create(
                                requirement=requirement,
                                **q_data
                            )
                            updated_count += 1
                
                else:
                    # Create new requirement if it doesn't exist
                    category_map = {
                        'photography': 'photography',
                        'videography': 'videography',
                        'decoration': 'decoration',
                        'cake': 'catering',
                        'setup': 'decoration',
                        'design': 'decoration',
                        'display': 'other',
                        'lighting': 'decoration'
                    }
                    
                    category = 'photography'  # default
                    for key, cat in category_map.items():
                        if key in req_id:
                            category = cat
                            break
                    
                    requirement = EventRequirement.objects.create(
                        event_id=event_id,
                        category_name='Visual/Photo Display',
                        requirement_id=req_id,
                        label=req_id.replace('-', ' ').title(),
                        category=category
                    )
                    
                    # Add photo gallery questions
                    gallery_questions = [
                        {
                            'question_text': 'Photo gallery style preference?',
                            'question_type': 'dropdown',
                            'options': ['Classic', 'Modern', 'Artistic', 'Professional'],
                            'is_required': True,
                            'order': 1
                        },
                        {
                            'question_text': 'Number of photos needed?',
                            'question_type': 'dropdown',
                            'options': ['50-100 photos', '100-200 photos', '200-500 photos', '500+ photos'],
                            'is_required': True,
                            'order': 2
                        },
                        {
                            'question_text': 'Digital delivery format?',
                            'question_type': 'dropdown',
                            'options': ['Online gallery', 'USB drive', 'Cloud storage', 'All formats'],
                            'is_required': True,
                            'order': 3
                        }
                    ]
                    
                    for q_data in gallery_questions:
                        RequirementQuestion.objects.create(
                            requirement=requirement,
                            **q_data
                        )
                        updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} photo gallery requirements')
        )