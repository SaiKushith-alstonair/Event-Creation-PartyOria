from django.core.management.base import BaseCommand
from django.db import connection
from vendors.models import Venue
from events.models import Event

class Command(BaseCommand):
    help = 'Reset ID sequences for venues and events to start from 1'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Reset venue IDs
            venues = list(Venue.objects.all().order_by('id'))
            for i, venue in enumerate(venues, 1):
                venue.id = i
                venue.save()
            
            # Reset venue sequence for PostgreSQL
            cursor.execute("SELECT setval(pg_get_serial_sequence('venues', 'id'), %s, false)", [len(venues)])
            
            # Reset event IDs if events exist
            events = list(Event.objects.all().order_by('id'))
            if events:
                for i, event in enumerate(events, 1):
                    event.id = i
                    event.save()
                cursor.execute("SELECT setval(pg_get_serial_sequence('events', 'id'), %s, false)", [len(events)])
            
            self.stdout.write(self.style.SUCCESS(f'Reset {len(venues)} venue IDs and {len(events)} event IDs to start from 1'))