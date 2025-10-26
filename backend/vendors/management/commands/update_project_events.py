import json
import random
from django.core.management.base import BaseCommand
from vendors.models import Venue

class Command(BaseCommand):
    help = 'Update venues with project-specific events'

    VENUE_EVENT_MAPPING = {
        "banquet_hall": ["Wedding", "Engagement", "Anniversary", "Birthday", "Award Ceremony", "Corporate Party", "Retirement", "Farewell"],
        "hotel": ["Conference", "Seminar", "Corporate Party", "Wedding", "Product Launch", "Leadership Summit", "Networking Mixer", "Trade Show"],
        "resort": ["Wedding", "Corporate Party", "Anniversary", "Bachelor Party", "Pre-Wedding Bash", "Adventure Camp"],
        "marriage_hall": ["Wedding", "Engagement", "Anniversary", "Pre-Wedding Bash", "Bridal Shower", "Naming Ceremony"],
        "conference_center": ["Conference", "Seminar", "Leadership Summit", "Trade Show", "Academic Symposium", "Workshop", "Medical Conference"],
        "community_hall": ["Community Festival", "Neighborhood Gathering", "Cultural Fair", "Religious Seminar", "Volunteer Appreciation"],
        "auditorium": ["Music Concert", "Theater Play", "Dance Performance", "School Annual Day", "Comedy Show", "Fashion Show"],
        "outdoor_venue": ["Sports Tournament", "Marathon Run", "Tree Planting Drive", "Political Rally", "Adventure Camp", "Sports Day"],
        "restaurant": ["Birthday", "Anniversary", "Kitty Party", "Friendship Day Event", "Valentine's Day Celebration"],
        "temple": ["Puja Ceremony", "Religious Discourse", "Temple Inauguration", "Prayer Meeting", "Blessing Ceremony"],
        "exhibition_center": ["Trade Show", "Career Expo", "Science Fair", "Handicraft Exhibition", "Food Festival"],
        "sports_complex": ["Sports Tournament", "Sports Day", "Marathon Run", "Fitness Bootcamp", "Adventure Camp"],
        "school": ["School Annual Day", "Workshop", "Science Fair", "Debate Competition", "Quiz Contest"],
        "park": ["Tree Planting Drive", "Clean-Up Drive", "Marathon Run", "Eco-Festival", "Environmental Awareness Campaign"],
        "farmhouse": ["Wedding", "Bachelor Party", "Corporate Party", "Birthday", "Anniversary", "Pre-Wedding Bash"]
    }

    def handle(self, *args, **options):
        venues = Venue.objects.all()
        updated_count = 0
        
        self.stdout.write(f"Starting update of {venues.count()} venues...")
        
        for venue in venues:
            try:
                if venue.venue_details:
                    if isinstance(venue.venue_details, str):
                        venue_details = json.loads(venue.venue_details)
                    else:
                        venue_details = venue.venue_details
                else:
                    venue_details = {}
                
                venue_type = venue_details.get('venue_type', 'banquet_hall')
                
                # Get events for this venue type
                events = self.VENUE_EVENT_MAPPING.get(venue_type, ["Wedding", "Birthday", "Corporate Party"])
                suitable_events = random.sample(events, min(random.randint(3, 6), len(events)))
                
                venue_details['suitable_events'] = suitable_events
                venue.venue_details = json.dumps(venue_details)
                venue.save()
                
                updated_count += 1
                if updated_count % 500 == 0:
                    self.stdout.write(f"Updated {updated_count} venues...")
                    
            except Exception as e:
                self.stdout.write(f"Error with venue {venue.id}: {e}")
                continue
        
        self.stdout.write(self.style.SUCCESS(f'Updated {updated_count} venues with project events'))