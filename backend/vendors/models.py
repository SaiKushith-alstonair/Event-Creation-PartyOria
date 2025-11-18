from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from authentication.models import CustomUser

class Venue(models.Model):
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    venue_details = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'venues'
        indexes = [
            models.Index(fields=['state', 'city']),
            models.Index(fields=['state']),
            models.Index(fields=['city']),
        ]

    def __str__(self):
        return f"{self.venue_details.get('name', 'Unknown')} - {self.city}, {self.state}"

class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_categories'
        verbose_name_plural = 'Event Categories'

    def __str__(self):
        return self.name

class EventType(models.Model):
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='event_types')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_types'

    def __str__(self):
        return f"{self.category.name} - {self.name}"

class VendorService(models.Model):
    service_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    service_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey('VendorAuth', on_delete=models.CASCADE, related_name='vendor_services', db_column='user_id', null=True, blank=True)
    maximum_people = models.IntegerField(null=True, blank=True)
    minimum_people = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'vendor_services'

    def __str__(self):
        return self.service_name

class EventVendorMapping(models.Model):
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='vendor_mappings')
    vendor_service = models.ForeignKey(VendorService, on_delete=models.CASCADE)
    is_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'event_vendor_mappings'
        unique_together = ['event_type', 'vendor_service']

    def __str__(self):
        return f"{self.event_type.name} - {self.vendor_service.name}"

class SpecialRequirement(models.Model):
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='special_requirements')
    category_name = models.CharField(max_length=100)
    requirement_id = models.CharField(max_length=100)
    requirement_label = models.CharField(max_length=200)
    vendor_category = models.CharField(max_length=50)
    unit = models.CharField(max_length=50, blank=True, null=True)
    placeholder = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'special_requirements'
        unique_together = ['event_type', 'requirement_id']

    def __str__(self):
        return f"{self.event_type.name} - {self.requirement_label}"

class VendorProfile(models.Model):
    user = models.OneToOneField('VendorAuth', on_delete=models.CASCADE, related_name='vendor_profile', db_column='user_id', null=True, blank=True)
    profile_data = models.JSONField(default=dict)
    profile_image = models.ImageField(upload_to='vendor_profiles/', blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vendor_profiles'

    def __str__(self):
        return f"Profile for {self.user.email if self.user else 'Unknown'}"

class VendorAuth(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    full_name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    business = models.CharField(max_length=100)
    experience_level = models.CharField(max_length=50, default='Intermediate')
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    location = models.CharField(max_length=255)
    services = models.JSONField(default=list)
    profile_image = models.ImageField(upload_to='vendor_profiles/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    onboarding_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Bridge to CustomUser for chat system
    chat_user = models.OneToOneField('authentication.CustomUser', on_delete=models.CASCADE, null=True, blank=True, related_name='vendor_auth')
    
    class Meta:
        db_table = 'vendor_auth'
    
    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def get_or_create_chat_user(self):
        """Get or create corresponding CustomUser for chat system"""
        if not self.chat_user:
            from authentication.models import CustomUser
            # Create CustomUser with vendor data
            chat_user = CustomUser.objects.create(
                username=f"vendor_{self.id}_{self.email}",
                email=self.email,
                user_type='vendor',
                phone=self.mobile,
                is_verified=self.is_verified
            )
            chat_user.set_unusable_password()  # No password login for bridge user
            chat_user.save()
            self.chat_user = chat_user
            self.save()
        return self.chat_user
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"

