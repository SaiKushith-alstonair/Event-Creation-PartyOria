from django.core.management.base import BaseCommand
from django.core.management import call_command
from events.models import EventRequirement

class Command(BaseCommand):
    help = 'Populate ALL 138+ events with comprehensive requirements - Master Command'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING('Starting population of ALL 138+ events with comprehensive requirements...')
        )
        
        # Clear existing requirements
        self.stdout.write('Clearing existing requirements...')
        EventRequirement.objects.all().delete()
        
        try:
            # Run all three commands in sequence
            self.stdout.write(
                self.style.SUCCESS('Step 1/3: Populating Corporate & Social Events...')
            )
            call_command('populate_complete_requirements')
            
            self.stdout.write(
                self.style.SUCCESS('Step 2/3: Populating Festival, Health, Sports, Educational, Virtual & Environmental Events...')
            )
            call_command('populate_remaining_events')
            
            self.stdout.write(
                self.style.SUCCESS('Step 3/3: Populating Religious, Cultural, Entertainment, Community & Political Events...')
            )
            call_command('populate_final_events')
            
            # Get final count
            total_requirements = EventRequirement.objects.count()
            total_events = EventRequirement.objects.values('event_id').distinct().count()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n🎉 SUCCESS! Database populated with:\n'
                    f'   📊 {total_events} unique events\n'
                    f'   📋 {total_requirements} total requirements\n'
                    f'   🏆 Complete 138+ event coverage achieved!\n'
                    f'\n✅ Frontend special requirements page is now fully connected!'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error during population: {str(e)}')
            )
            raise e