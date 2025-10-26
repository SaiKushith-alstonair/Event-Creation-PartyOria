from django.core.management.base import BaseCommand
from events.models import HeroVideo

class Command(BaseCommand):
    help = 'Update hero video to use the new party-hero.mp4'

    def handle(self, *args, **options):
        # Clear existing videos
        HeroVideo.objects.all().delete()
        
        # Add new video
        HeroVideo.objects.create(
            name='Party Hero Video',
            video_url='/videos/party-hero.mp4',
            is_active=True
        )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully updated hero video to party-hero.mp4')
        )