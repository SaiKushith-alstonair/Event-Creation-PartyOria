from rest_framework import serializers
from .models import Event, TraditionStyle, EventSection, EventSubsection, EventImage, EventRequirement, RequirementQuestion, VendorCategory, HeroVideo
import json

class TraditionStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TraditionStyle
        fields = ['id', 'event_type', 'style_name', 'description']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'event_name', 'form_data', 'special_requirements', 'selected_services', 'budget_allocation', 'allocation_method', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Ensure special_requirements is properly structured with quantity support
        special_requirements = validated_data.get('special_requirements', {})
        
        # Validate and structure special_requirements data
        if special_requirements:
            for req_id, req_data in special_requirements.items():
                if isinstance(req_data, dict):
                    # Ensure proper structure: {selected: bool, quantity: int, unit: str}
                    if 'selected' not in req_data:
                        req_data['selected'] = True
                    if 'quantity' in req_data:
                        try:
                            req_data['quantity'] = int(req_data['quantity']) if req_data['quantity'] else None
                        except (ValueError, TypeError):
                            req_data['quantity'] = None
        
        validated_data['special_requirements'] = special_requirements
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Ensure special_requirements and budget_allocation are properly updated
        special_requirements = validated_data.get('special_requirements')
        if special_requirements is not None:
            # Validate and structure special_requirements data
            for req_id, req_data in special_requirements.items():
                if isinstance(req_data, dict):
                    if 'selected' not in req_data:
                        req_data['selected'] = True
                    if 'quantity' in req_data:
                        try:
                            req_data['quantity'] = int(req_data['quantity']) if req_data['quantity'] else None
                        except (ValueError, TypeError):
                            req_data['quantity'] = None
            instance.special_requirements = special_requirements
        
        budget_allocation = validated_data.get('budget_allocation')
        if budget_allocation is not None:
            instance.budget_allocation = budget_allocation
            
        return super().update(instance, validated_data)

class EventSubsectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSubsection
        fields = ['subsection_id', 'name']

class EventSectionSerializer(serializers.ModelSerializer):
    subsections = EventSubsectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = EventSection
        fields = ['section_id', 'name', 'icon', 'subsections']

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ['event_id', 'image_url', 'description']

class RequirementQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequirementQuestion
        fields = '__all__'


class EventRequirementSerializer(serializers.ModelSerializer):
    dynamic_questions = RequirementQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = EventRequirement
        fields = ['event_id', 'category_name', 'requirement_id', 'label', 'category', 'unit', 'placeholder', 'dynamic_questions']

class VendorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCategory
        fields = ['category_id', 'name', 'vendors']

class HeroVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroVideo
        fields = ['id', 'name', 'video_url', 'is_active']

