from django.core.management.base import BaseCommand
from events.models import EventRequirement, EventSubsection

class Command(BaseCommand):
    help = 'Add venues as a special requirement to all events'

    def handle(self, *args, **options):
        # Get all event subsection IDs
        event_ids = EventSubsection.objects.values_list('subsection_id', flat=True)
        
        # Venue data categorized by event type
        venue_data = {
            # Wedding venues
            'wedding': ['Banquet Hall', 'Resort', 'Palace', 'Garden', 'Beach Resort', 'Heritage Hotel', 'Farmhouse', 'Destination Wedding Venue', 'Luxury Hotel', 'Convention Center'],
            'engagement': ['Banquet Hall', 'Resort', 'Garden', 'Hotel', 'Farmhouse', 'Rooftop Venue', 'Community Hall', 'Restaurant'],
            'reception': ['Banquet Hall', 'Hotel', 'Convention Center', 'Resort', 'Palace', 'Luxury Venue', 'Garden', 'Farmhouse'],
            
            # Birthday venues
            'birthday': ['Party Hall', 'Restaurant', 'Home', 'Garden', 'Community Center', 'Hotel', 'Farmhouse', 'Banquet Hall', 'Rooftop Venue', 'Beach Resort'],
            'kids-birthday': ['Party Hall', 'Play Area', 'Restaurant', 'Home', 'Garden', 'Community Center', 'Theme Park', 'Indoor Play Zone'],
            
            # Corporate venues
            'conference': ['Convention Center', 'Hotel', 'Corporate Office', 'Auditorium', 'Business Center', 'Resort', 'Meeting Hall'],
            'seminar': ['Auditorium', 'Hotel', 'Convention Center', 'Corporate Office', 'Conference Hall', 'Business Center'],
            'workshop': ['Training Center', 'Hotel', 'Corporate Office', 'Community Center', 'Conference Hall', 'Auditorium'],
            'team-building': ['Resort', 'Farmhouse', 'Adventure Park', 'Hotel', 'Outdoor Venue', 'Corporate Retreat Center'],
            
            # Festival venues
            'diwali': ['Home', 'Community Center', 'Temple', 'Banquet Hall', 'Garden', 'Farmhouse', 'Hotel'],
            'holi': ['Garden', 'Farmhouse', 'Open Ground', 'Community Center', 'Resort', 'Beach', 'Park'],
            'christmas': ['Home', 'Church', 'Community Center', 'Hotel', 'Restaurant', 'Banquet Hall', 'Garden'],
            'eid': ['Home', 'Mosque', 'Community Center', 'Banquet Hall', 'Garden', 'Hotel', 'Restaurant'],
            
            # Entertainment venues
            'concert': ['Auditorium', 'Stadium', 'Open Ground', 'Convention Center', 'Arena', 'Amphitheater', 'Music Hall'],
            'comedy-show': ['Auditorium', 'Theater', 'Comedy Club', 'Hotel', 'Restaurant', 'Community Center'],
            'dance-performance': ['Auditorium', 'Theater', 'Cultural Center', 'Hotel', 'Banquet Hall', 'Stadium'],
            
            # Social venues
            'charity-event': ['Community Center', 'Hotel', 'Banquet Hall', 'Auditorium', 'Convention Center', 'Garden'],
            'fundraiser': ['Hotel', 'Banquet Hall', 'Community Center', 'Auditorium', 'Convention Center', 'Garden'],
            'reunion': ['Hotel', 'Banquet Hall', 'Restaurant', 'Community Center', 'Resort', 'Garden', 'Farmhouse'],
            
            # Sports venues
            'sports-tournament': ['Stadium', 'Sports Complex', 'Ground', 'Arena', 'Sports Club', 'Outdoor Venue'],
            'marathon': ['Stadium', 'Open Road', 'Park', 'Sports Complex', 'Beach', 'City Streets'],
            
            # Default venues for other events
            'default': ['Banquet Hall', 'Hotel', 'Community Center', 'Garden', 'Restaurant', 'Convention Center', 'Resort', 'Farmhouse', 'Auditorium', 'Open Ground']
        }
        
        created_count = 0
        
        for event_id in event_ids:
            # Check if venues requirement already exists
            if EventRequirement.objects.filter(event_id=event_id, requirement_id='venues').exists():
                continue
                
            # Determine venue category based on event_id
            venues = venue_data.get('default')
            for category, category_venues in venue_data.items():
                if category in event_id.lower():
                    venues = category_venues
                    break
            
            # Create venues requirement
            EventRequirement.objects.create(
                event_id=event_id,
                category_name='Special Requirements',
                requirement_id='venues',
                label='Venues',
                category='special',
                unit='selection',
                placeholder='Select preferred venue types'
            )
            created_count += 1
            
        self.stdout.write(
            self.style.SUCCESS(f'Successfully added venues requirement to {created_count} events')
        )