from django.core.management.base import BaseCommand
from vendors.models import VendorAuth

class Command(BaseCommand):
    help = 'Bridge existing vendors to chat system'

    def handle(self, *args, **options):
        vendors = VendorAuth.objects.filter(chat_user__isnull=True)
        count = 0
        
        for vendor in vendors:
            try:
                chat_user = vendor.get_or_create_chat_user()
                self.stdout.write(f"Created chat user {chat_user.id} for vendor {vendor.full_name}")
                count += 1
            except Exception as e:
                self.stdout.write(f"Error creating chat user for vendor {vendor.full_name}: {e}")
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully bridged {count} vendors to chat system')
        )