from django.db import models
from decimal import Decimal
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

class TraditionStyle(models.Model):
    event_type = models.CharField(max_length=100)
    style_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'events_traditionstyle'
    
    def __str__(self):
        return f"{self.event_type} - {self.style_name}"

class EventSection(models.Model):
    section_id = models.CharField(max_length=50, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_sections'
        constraints = [
            models.UniqueConstraint(fields=['section_id'], name='unique_section_id')
        ]
    
    def clean(self):
        if not self.section_id:
            raise ValidationError('Section ID is required')
        if not self.name:
            raise ValidationError('Section name is required')
    
    def __str__(self):
        return self.name

class EventSubsection(models.Model):
    section = models.ForeignKey(
        EventSection, 
        on_delete=models.CASCADE, 
        related_name='subsections',
        db_index=True
    )
    subsection_id = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_subsections'
        constraints = [
            models.UniqueConstraint(
                fields=['section', 'subsection_id'], 
                name='unique_subsection_per_section'
            )
        ]
        indexes = [
            models.Index(fields=['subsection_id']),
            models.Index(fields=['section', 'subsection_id']),
        ]
    
    def clean(self):
        if not self.subsection_id:
            raise ValidationError('Subsection ID is required')
        if not self.name:
            raise ValidationError('Subsection name is required')
    
    def __str__(self):
        return f"{self.section.name} - {self.name}"

class EventImage(models.Model):
    event_id = models.CharField(max_length=100, unique=True)
    image_url = models.URLField(max_length=500)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_images'
        indexes = [
            models.Index(fields=['event_id']),
        ]
    
    def __str__(self):
        return self.event_id

class EventRequirement(models.Model):
    event_id = models.CharField(max_length=100)
    category_name = models.CharField(max_length=200)
    requirement_id = models.CharField(max_length=100)
    label = models.CharField(max_length=200)
    category = models.CharField(max_length=50)
    unit = models.CharField(max_length=50, blank=True, null=True)
    placeholder = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_requirements'
        indexes = [
            models.Index(fields=['event_id']),
        ]
    
    def __str__(self):
        return f"{self.event_id} - {self.label}"

class VendorCategory(models.Model):
    category_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    vendors = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'vendor_categories'
    
    def __str__(self):
        return self.name

class HeroVideo(models.Model):
    name = models.CharField(max_length=200)
    video_url = models.URLField(max_length=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'hero_videos'
    
    def __str__(self):
        return self.name



class RequirementQuestion(models.Model):
    QUESTION_TYPES = [
        ('text', 'Text Input'),
        ('number', 'Number Input'),
        ('dropdown', 'Dropdown'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio Button'),
    ]
    
    requirement = models.ForeignKey(
        EventRequirement, 
        on_delete=models.CASCADE, 
        related_name='dynamic_questions',
        db_index=True
    )
    requirement_name = models.CharField(
        max_length=200, 
        blank=True, 
        help_text='Readable requirement name for easy identification'
    )
    question_text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='text')
    options = models.JSONField(
        blank=True, 
        null=True, 
        help_text='Options for dropdown/radio/checkbox'
    )
    placeholder = models.CharField(max_length=100, blank=True)
    min_value = models.IntegerField(
        blank=True, 
        null=True,
        validators=[MinValueValidator(0)]
    )
    max_value = models.IntegerField(
        blank=True, 
        null=True,
        validators=[MinValueValidator(1)]
    )
    is_required = models.BooleanField(default=False)
    order = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    class Meta:
        db_table = 'requirement_questions'
        ordering = ['order', 'id']
        constraints = [
            models.CheckConstraint(
                check=models.Q(min_value__isnull=True) | models.Q(max_value__isnull=True) | models.Q(min_value__lt=models.F('max_value')),
                name='min_value_less_than_max_value'
            )
        ]
        indexes = [
            models.Index(fields=['requirement', 'order']),
        ]
    
    def clean(self):
        if not self.question_text:
            raise ValidationError('Question text is required')
        if self.min_value is not None and self.max_value is not None:
            if self.min_value >= self.max_value:
                raise ValidationError('Min value must be less than max value')
        if self.question_type in ['dropdown', 'radio', 'checkbox'] and not self.options:
            raise ValidationError(f'{self.question_type} questions must have options')
    
    def __str__(self):
        return f"{self.requirement_name or self.requirement.label} - {self.question_text}"




class EventRequirementImages(models.Model):
    event_name = models.CharField(max_length=100)
    requirement_name = models.CharField(max_length=100)
    image_number = models.IntegerField()
    image_url = models.URLField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_requirement_images'
        ordering = ['event_name', 'requirement_name', 'image_number']
    
    def __str__(self):
        return f"{self.event_name} - {self.requirement_name} {self.image_number}"

class Event(models.Model):
    EVENT_TYPES = [
        ('corporate', 'Corporate'),
        ('wedding', 'Wedding'),
        ('birthday', 'Birthday'),
        ('festival', 'Festival'),
        ('other', 'Other'),
    ]
    
    VENUE_TYPES = [
        ('indoor', 'Indoor'),
        ('outdoor', 'Outdoor'),
        ('hybrid', 'Hybrid'),
    ]
    
    event_name = models.CharField(max_length=255, default='Untitled Event')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other', db_index=True)
    attendees = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(1), MaxValueValidator(10000)]
    )
    venue_type = models.CharField(max_length=20, choices=VENUE_TYPES, default='indoor')
    duration = models.PositiveIntegerField(
        default=4, 
        help_text="Duration in hours",
        validators=[MinValueValidator(1), MaxValueValidator(168)]  # Max 1 week
    )
    total_budget = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=10000.00,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    services = models.JSONField(default=list, help_text="List of selected services")
    form_data = models.JSONField(default=dict)
    special_requirements = models.JSONField(
        default=dict, 
        blank=True, 
        help_text="Format: {req_id: {selected: bool, quantity: int, unit: str, questions: list, answers: dict}}"
    )
    selected_services = models.JSONField(
        default=list, 
        blank=True, 
        help_text="List of selected service names"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='events', 
        null=True, 
        blank=True,
        db_index=True
    )
    created_by = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Name of the user who created the event"
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['event_type', 'created_at']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(attendees__gte=1),
                name='positive_attendees'
            ),
            models.CheckConstraint(
                check=models.Q(total_budget__gt=0),
                name='positive_budget'
            )
        ]
    
    def clean(self):
        if not self.event_name or not self.event_name.strip():
            raise ValidationError('Event name is required')
        if self.attendees < 1:
            raise ValidationError('Event must have at least 1 attendee')
        if self.total_budget <= 0:
            raise ValidationError('Budget must be greater than 0')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.event_name

class EventMilestone(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='milestones_data')
    milestones = models.JSONField(default=dict, help_text='Milestone completion data in JSON format')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'event_milestones'
    
    def __str__(self):
        return f"Milestones for {self.event.event_name}"

class Budget(models.Model):
    ALLOCATION_METHODS = [
        ('smart', 'Smart Allocation'),
        ('manual', 'Manual Allocation'),
    ]
    
    event = models.OneToOneField(
        Event, 
        on_delete=models.CASCADE, 
        related_name='budget',
        db_index=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='budgets', 
        null=True, 
        blank=True,
        db_index=True
    )
    total_budget = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    allocations = models.JSONField(
        default=dict, 
        help_text='Budget allocations by category: {category: {percentage: float, amount: float}}'
    )
    allocation_method = models.CharField(max_length=20, choices=ALLOCATION_METHODS, default='smart')
    efficiency_score = models.FloatField(
        default=85.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    cost_per_guest = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    cost_per_hour = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    insights = models.JSONField(default=dict, help_text='Budget insights and recommendations')
    detailed_breakdown = models.JSONField(default=dict, help_text='Detailed breakdown with requirement mappings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'budgets'
        constraints = [
            models.CheckConstraint(
                check=models.Q(total_budget__gt=0),
                name='positive_total_budget'
            ),
            models.CheckConstraint(
                check=models.Q(efficiency_score__gte=0) & models.Q(efficiency_score__lte=100),
                name='valid_efficiency_score'
            )
        ]
    
    def clean(self):
        if self.total_budget <= 0:
            raise ValidationError('Total budget must be greater than 0')
        if not (0 <= self.efficiency_score <= 100):
            raise ValidationError('Efficiency score must be between 0 and 100')
        if self.user and self.event.user and self.user != self.event.user:
            raise ValidationError('Budget user must match event user')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Budget for {self.event.event_name} - User: {self.user.username if self.user else 'No User'}"

class RSVP(models.Model):
    RESPONSE_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('maybe', 'Maybe'),
    ]
    
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        related_name='rsvps',
        db_index=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='rsvps', 
        null=True, 
        blank=True,
        db_index=True
    )
    guest_data = models.JSONField(
        default=dict, 
        help_text='Complete guest information in JSON format'
    )
    invitation_code = models.CharField(
        max_length=50, 
        unique=True, 
        help_text='Unique invitation code for guest',
        db_index=True
    )
    response_status = models.CharField(
        max_length=20, 
        choices=RESPONSE_CHOICES, 
        default='pending',
        db_index=True
    )
    response_date = models.DateTimeField(null=True, blank=True)
    plus_ones = models.IntegerField(
        default=0, 
        help_text='Number of additional guests',
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    dietary_restrictions = models.TextField(blank=True, help_text='Special dietary requirements')
    special_requests = models.TextField(blank=True, help_text='Any special requests from guest')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'event_rsvps'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event', 'response_status']),
            models.Index(fields=['user', 'response_status']),
            models.Index(fields=['invitation_code']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'invitation_code'], 
                name='unique_invitation_per_event'
            ),
            models.CheckConstraint(
                check=models.Q(plus_ones__gte=0),
                name='non_negative_plus_ones'
            )
        ]
    
    def clean(self):
        if not self.invitation_code:
            self.invitation_code = str(uuid.uuid4())[:8].upper()
        if self.plus_ones < 0:
            raise ValidationError('Plus ones cannot be negative')
        if not self.guest_data.get('name'):
            raise ValidationError('Guest name is required in guest_data')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        guest_name = self.guest_data.get('name', 'Unknown Guest')
        return f"RSVP - {guest_name} for {self.event.event_name}"
    
    @property
    def guest_name(self):
        return self.guest_data.get('name', 'Unknown Guest')
    
    @property
    def guest_email(self):
        return self.guest_data.get('email', '')
    
    @property
    def total_attendees(self):
        return 1 + self.plus_ones if self.response_status == 'accepted' else 0

class QuoteRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('vendors_notified', 'Vendors Notified'),
        ('responses_received', 'Responses Received'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    QUOTE_TYPE_CHOICES = [
        ('targeted', 'Targeted'),
        ('comprehensive', 'Comprehensive'),
    ]
    
    # Basic event information
    event_type = models.CharField(max_length=100)
    event_name = models.CharField(max_length=255, blank=True)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=20, blank=True)
    event_date = models.DateField()
    location = models.CharField(max_length=255, blank=True)
    guest_count = models.PositiveIntegerField(default=0)
    budget_range = models.CharField(max_length=50, blank=True)
    services = models.JSONField(default=list)
    description = models.TextField(blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Enhanced targeting fields
    quote_type = models.CharField(max_length=20, choices=QUOTE_TYPE_CHOICES, default='comprehensive')
    expand_vendors = models.BooleanField(default=False, help_text='Include additional vendors beyond selected ones')
    is_targeted_quote = models.BooleanField(default=False)
    prefilled_event_id = models.PositiveIntegerField(null=True, blank=True, help_text='ID of the event this quote is based on')
    selected_vendors = models.JSONField(default=list, help_text='List of specifically selected vendors')
    selected_venues = models.JSONField(default=list, help_text='List of specifically selected venues')
    vendor_responses = models.JSONField(default=dict, help_text='Vendor responses to this quote request')
    
    # Category-specific data for targeted quotes
    category_specific_data = models.JSONField(
        default=dict, 
        help_text='Category-specific requirements and budget allocation: {category: {requirements: {}, budget: amount, details: {}}}'
    )

    # Relationships
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quote_requests', null=True, blank=True)
    source_event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='quote_requests')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'quote_requests'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        quote_type_display = f" ({self.quote_type})" if self.quote_type != 'comprehensive' else ""
        return f"Quote Request - {self.event_type} by {self.client_name}{quote_type_display}"
    
    @property
    def vendor_count(self):
        """Return the number of selected vendors"""
        return len(self.selected_vendors) if self.selected_vendors else 0
    
    @property
    def venue_count(self):
        """Return the number of selected venues"""
        return len(self.selected_venues) if self.selected_venues else 0
    
    @property
    def estimated_response_time(self):
        """Return estimated response time based on urgency and quote type"""
        if self.urgency == 'high':
            return '24 hours' if self.quote_type == 'targeted' else '48 hours'
        elif self.urgency == 'medium':
            return '48 hours' if self.quote_type == 'targeted' else '72 hours'
        else:
            return '72 hours' if self.quote_type == 'targeted' else '5 days'
    
    def get_category_data_for_vendor(self, vendor_category):
        """Get category-specific data for a particular vendor category"""
        return self.category_specific_data.get(vendor_category, {})
    
    def set_category_data(self, category, requirements, budget_amount, additional_details=None):
        """Set category-specific data for targeted quotes"""
        if not self.category_specific_data:
            self.category_specific_data = {}
        
        self.category_specific_data[category] = {
            'requirements': requirements,
            'budget': float(budget_amount) if budget_amount else 0,
            'details': additional_details or {},
            'guest_count': self.guest_count,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'location': self.location
        }
    
    @classmethod
    def extract_category_specific_data(cls, event, budget_allocations=None):
        """
        Extract category-specific requirements and budget from event data
        Returns: Dict[category] -> {requirements, budget, details}
        """
        # Service to category mapping
        SERVICE_CATEGORY_MAP = {
            'catering': ['catering', 'food', 'menu', 'cake', 'cuisine', 'buffet'],
            'photography': ['photography', 'videography', 'photo', 'video', 'bridal', 'camera'],
            'decorations': ['decoration', 'decor', 'setup', 'flower', 'balloon', 'mandap'],
            'entertainment': ['entertainment', 'music', 'dj', 'band', 'dance', 'magic', 'show'],
            'venues': ['venue', 'hall', 'location', 'space'],
            'audio_visual': ['audio', 'visual', 'sound', 'microphone', 'projection'],
            'lighting': ['lighting', 'light', 'led', 'disco']
        }
        
        category_data = {}
        special_requirements = event.special_requirements or {}
        
        # Group requirements by category
        for req_id, req_data in special_requirements.items():
            if not isinstance(req_data, dict) or not req_data.get('selected'):
                continue
                
            # Find matching category
            matched_category = None
            req_id_lower = req_id.lower()
            
            for category, keywords in SERVICE_CATEGORY_MAP.items():
                if any(keyword in req_id_lower for keyword in keywords):
                    matched_category = category
                    break
            
            if matched_category:
                if matched_category not in category_data:
                    category_data[matched_category] = {
                        'requirements': {},
                        'budget': 0,
                        'details': {}
                    }
                
                # Add requirement data
                category_data[matched_category]['requirements'][req_id] = {
                    'selected': req_data.get('selected', True),
                    'quantity': req_data.get('quantity'),
                    'unit': req_data.get('unit'),
                    'questions': req_data.get('questions', []),
                    'answers': req_data.get('answers', {})
                }
        
        # Add budget allocations if available
        if budget_allocations:
            for category, allocation_data in budget_allocations.items():
                # Map display names back to category keys
                category_key = None
                category_lower = category.lower()
                
                for cat_key, keywords in SERVICE_CATEGORY_MAP.items():
                    if any(keyword in category_lower for keyword in keywords) or cat_key in category_lower:
                        category_key = cat_key
                        break
                
                if category_key and category_key in category_data:
                    category_data[category_key]['budget'] = float(allocation_data.get('amount', 0))
                    category_data[category_key]['details'].update({
                        'percentage': float(allocation_data.get('percentage', 0)),
                        'per_guest_cost': float(allocation_data.get('per_guest_cost', 0)),
                        'per_hour_cost': float(allocation_data.get('per_hour_cost', 0))
                    })
        
        return category_data

class VendorQuote(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('submitted', 'Submitted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    quote_request = models.OneToOneField(QuoteRequest, on_delete=models.CASCADE, related_name='vendor_quote')
    quote_amount = models.DecimalField(max_digits=12, decimal_places=2)
    message = models.TextField(blank=True)
    includes = models.JSONField(default=list, help_text="What's included in this quote")
    excludes = models.JSONField(default=list, help_text="What's not included")
    terms = models.TextField(blank=True, help_text="Terms and conditions")
    valid_until = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'vendor_quotes'
        indexes = [
            models.Index(fields=['quote_request', 'status']),
        ]
    
    def __str__(self):
        return f"Quote ${self.quote_amount} for {self.quote_request.event.event_name}"