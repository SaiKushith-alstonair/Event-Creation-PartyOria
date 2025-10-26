from django.core.management.base import BaseCommand
from events.models import EventRequirementImages

class Command(BaseCommand):
    help = 'Add conference event photography images'

    def handle(self, *args, **options):
        # Clear existing conference event-photography images
        EventRequirementImages.objects.filter(
            event_name='conference', 
            requirement_name='event-photography'
        ).delete()
        
        # Add the 3 images
        images = [
            'https://th.bing.com/th/id/OIP.Ug31CtrOkrHjOtA8vMHrwwHaE8?w=246&h=180&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3',
            'https://images.squarespace-cdn.com/content/v1/5a3984a4be42d65c69fdaf79/1516137608694-EKWDXKHN90GQN6PEORX8/EVent-Photography-1.jpg?format=2500w',
            'https://th.bing.com/th/id/OIP.WAw6xgVMDGl8296Z6uEo7wHaE7?w=282&h=189&c=7&r=0&o=7&cb=12&dpr=1.3&pid=1.7&rm=3'
        ]
        
        for i, url in enumerate(images, 1):
            EventRequirementImages.objects.create(
                event_name='conference',
                requirement_name='event-photography',
                image_number=i,
                image_url=url
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully added {len(images)} conference event photography images')
        )