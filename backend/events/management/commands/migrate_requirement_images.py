from django.core.management.base import BaseCommand
from events.models import EventRequirementImages, EventRequirement
from django.db import connection

class Command(BaseCommand):
    help = 'Migrate data from RequirementImage to EventRequirementImages'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Check if requirement_images table exists (PostgreSQL)
            cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_name='requirement_images';")
            if not cursor.fetchone():
                self.stdout.write('RequirementImage table does not exist')
                return
            
            # Get data from requirement_images table
            cursor.execute('SELECT requirement_id, image_url, "order" FROM requirement_images;')
            rows = cursor.fetchall()
            
            migrated_count = 0
            for requirement_id, image_url, order in rows:
                # Find event_id for this requirement
                event_req = EventRequirement.objects.filter(requirement_id=requirement_id).first()
                event_name = event_req.event_id if event_req else 'general'
                
                EventRequirementImages.objects.create(
                    event_name=event_name,
                    requirement_name=requirement_id,
                    image_number=order + 1,
                    image_url=image_url
                )
                migrated_count += 1
            
            # Drop requirement_images table
            cursor.execute("DROP TABLE IF EXISTS requirement_images;")
            
        self.stdout.write(self.style.SUCCESS(f'Migrated {migrated_count} images and dropped requirement_images table'))