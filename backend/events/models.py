from django.db import models

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
    section_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    icon = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_sections'
    
    def __str__(self):
        return self.name

class EventSubsection(models.Model):
    section = models.ForeignKey(EventSection, on_delete=models.CASCADE, related_name='subsections')
    subsection_id = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_subsections'
        indexes = [
            models.Index(fields=['subsection_id']),
        ]
    
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
    
    requirement = models.ForeignKey(EventRequirement, on_delete=models.CASCADE, related_name='dynamic_questions')
    question_text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='text')
    options = models.JSONField(blank=True, null=True, help_text='Options for dropdown/radio/checkbox')
    placeholder = models.CharField(max_length=100, blank=True)
    min_value = models.IntegerField(blank=True, null=True)
    max_value = models.IntegerField(blank=True, null=True)
    is_required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'requirement_questions'
        ordering = ['order', 'id']
    
    def __str__(self):
        return f"{self.requirement.label} - {self.question_text}"




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
    event_name = models.CharField(max_length=255, default='Untitled Event')
    form_data = models.JSONField(default=dict)
    special_requirements = models.JSONField(default=dict, blank=True, help_text="Format: {req_id: {selected: bool, quantity: int, unit: str}}")
    selected_services = models.JSONField(default=list, blank=True, help_text="List of selected service names")
    budget_allocation = models.JSONField(default=dict, blank=True, help_text="Budget allocation by category")
    allocation_method = models.CharField(max_length=20, choices=[('manual', 'Manual'), ('automatic', 'AI-Powered')], blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
    
    def __str__(self):
        return self.event_name