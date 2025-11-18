from rest_framework import viewsets, status
from django.db import models, transaction
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.db.models import Q
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError, ObjectDoesNotExist
import logging
import json
from typing import Dict, List, Any
from decimal import Decimal
import decimal

# Import error handling and validation
from partyoria.error_handlers import ErrorHandler, safe_execute
from partyoria.validation_layers import ValidationLayer, EventValidationMixin
from .models import Event, Budget, TraditionStyle, EventSection, EventSubsection, EventImage, EventRequirement, RequirementQuestion, EventRequirementImages, VendorCategory, HeroVideo, EventMilestone, QuoteRequest, RSVP
from .serializers import EventSerializer, TraditionStyleSerializer, EventSectionSerializer, EventImageSerializer, EventRequirementSerializer, RequirementQuestionSerializer, VendorCategorySerializer, HeroVideoSerializer, EventMilestoneSerializer, QuoteRequestSerializer, RSVPSerializer
from .budget_algorithm import SmartBudgetAllocator



logger = logging.getLogger(__name__)

class EventViewSet(viewsets.ModelViewSet, EventValidationMixin):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = []  # Allow both authenticated and unauthenticated access
    authentication_classes = [JWTAuthentication]  # Enable JWT auth but don't require it
    
    def get_queryset(self):
        """Return events based on authentication status"""
        try:
            # If user is authenticated, return their events
            if self.request.user.is_authenticated:
                logger.info(f"Authenticated user {self.request.user.id} requesting events")
                return Event.objects.filter(user=self.request.user).order_by('-created_at')
            else:
                # For unauthenticated requests, return events for user ID 2 (saiku) for development
                logger.info("Unauthenticated request, returning events for user ID 2")
                return Event.objects.filter(user_id=2).order_by('-created_at')
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            return Event.objects.none()
    
    def list(self, request, *args, **kwargs):
        """List events for authenticated user with error handling"""
        try:
            # Debug authentication
            print(f"=== EVENTS LIST DEBUG ===")
            print(f"User authenticated: {request.user.is_authenticated}")
            print(f"User: {request.user}")
            print(f"User ID: {getattr(request.user, 'id', None)}")
            print(f"Authorization header: {request.META.get('HTTP_AUTHORIZATION', 'None')}")
            print(f"Request method: {request.method}")
            print(f"Request path: {request.path}")
            
            queryset = self.get_queryset()
            print(f"Queryset count: {queryset.count()}")
            
            serializer = self.get_serializer(queryset, many=True)
            response_data = serializer.data
            print(f"Returning {len(response_data)} events")
            
            return Response(response_data)
        except Exception as e:
            print(f"Error in list method: {str(e)}")
            import traceback
            traceback.print_exc()
            error_response = ErrorHandler.handle_generic_error(e, 'list_events')
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy to handle event deletion with proper error handling"""
        try:
            with transaction.atomic():
                instance = self.get_object()
                event_id = instance.id
                event_name = instance.event_name
                
                # Validate user permissions
                if instance.user and instance.user != request.user:
                    error_response = ErrorHandler.handle_permission_error(
                        "Cannot delete another user's event", 'delete_event'
                    )
                    return Response(error_response, status=status.HTTP_403_FORBIDDEN)
                
                # Delete the event
                instance.delete()
                
                logger.info(f"Successfully deleted event {event_id}: {event_name}")
                return Response(status=status.HTTP_204_NO_CONTENT)
                
        except ObjectDoesNotExist:
            error_response = ErrorHandler.handle_not_found_error('Event', 'delete_event')
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            error_response = ErrorHandler.handle_generic_error(e, 'delete_event')
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update(self, request, *args, **kwargs):
        """Override update with proper validation and error handling"""
        try:
            with transaction.atomic():
                instance = self.get_object()
                
                # Validate user permissions
                if instance.user and instance.user != request.user:
                    error_response = ErrorHandler.handle_permission_error(
                        "Cannot update another user's event", 'update_event'
                    )
                    return Response(error_response, status=status.HTTP_403_FORBIDDEN)
                
                # Validate input data if provided
                if request.data:
                    validated_data, validation_error = safe_execute(
                        self.validate_event_data, request.data.copy()
                    )
                    
                    if validation_error:
                        return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)
                    
                    # Update request data with validated data
                    request._full_data = validated_data
                
                return super().update(request, *args, **kwargs)
                
        except ObjectDoesNotExist:
            error_response = ErrorHandler.handle_not_found_error('Event', 'update_event')
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            error_response = ErrorHandler.handle_validation_error(e, 'update_event')
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_response = ErrorHandler.handle_generic_error(e, 'update_event')
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def partial_update(self, request, *args, **kwargs):
        """Override partial_update to handle form_data properly"""
        try:
            return super().partial_update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error updating event: {str(e)}")
            return Response(
                {'error': f'Failed to update event: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_permissions(self):
        """Override permissions for specific actions"""
        if self.action in ['get_hero_video', 'get_states', 'get_cities', 'get_traditions_by_event_type', 'get_event_sections', 'get_event_images', 'get_event_requirements', 'get_vendor_categories']:
            return []
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """Create event with comprehensive validation and error handling"""
        try:
            with transaction.atomic():
                logger.info("Creating new event")
                
                # Validate and sanitize input data
                validated_data, validation_error = safe_execute(
                    self.validate_event_data, request.data.copy()
                )
                
                if validation_error:
                    return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)
                
                # Filter out invalid fields that don't exist in Event model
                valid_fields = ['event_name', 'form_data', 'special_requirements', 'selected_services', 'user_id', 'created_by']
                filtered_data = {k: v for k, v in validated_data.items() if k in valid_fields}
                
                # Ensure required nested data structures
                filtered_data.setdefault('form_data', {})
                filtered_data.setdefault('special_requirements', {})
                filtered_data.setdefault('selected_services', [])
                
                # Replace request data with validated data
                request._full_data = filtered_data
                
                return super().create(request, *args, **kwargs)
        
        except ValidationError as e:
            error_response = ErrorHandler.handle_validation_error(e, 'create_event')
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_response = ErrorHandler.handle_generic_error(e, 'create_event')
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def perform_create(self, serializer):
        """Automatically assign the authenticated user to the event"""
        form_data = self.request.data.get('form_data', {})
        
        # Debug authentication
        print(f"=== BACKEND EVENT CREATION DEBUG ===")
        print(f"User authenticated: {self.request.user.is_authenticated}")
        print(f"User: {self.request.user}")
        print(f"User ID: {getattr(self.request.user, 'id', None)}")
        print(f"Request data keys: {list(self.request.data.keys())}")
        print(f"Services in request: {self.request.data.get('services', [])}")
        print(f"Event type in request: {self.request.data.get('event_type')}")
        print(f"Form data keys: {list(form_data.keys()) if form_data else 'No form_data'}")
        
        # Extract values from form_data for Event model fields
        event_type = self.request.data.get('event_type') or form_data.get('event_type', 'other')
        attendees = self.request.data.get('attendees') or form_data.get('attendees', 50)
        duration_str = form_data.get('duration', '4')
        
        # Parse duration from string like "4-6 hours" to integer
        try:
            if isinstance(duration_str, str) and '-' in duration_str:
                duration = int(duration_str.split('-')[0])
            else:
                duration = int(duration_str)
        except (ValueError, TypeError):
            duration = 4
        
        # Parse budget
        total_budget = self.request.data.get('total_budget') or form_data.get('budget', 10000)
        
        # Get services from request data
        services = self.request.data.get('services', [])
        if not services or len(services) == 0:
            services = ['general']  # Fallback
        
        print(f"Final values - event_type: {event_type}, attendees: {attendees}, duration: {duration}, budget: {total_budget}, services: {services}")
        
        # Determine venue type based on event details
        venue_type = 'indoor'  # Default, could be enhanced based on form data
        
        if self.request.user.is_authenticated and hasattr(self.request.user, 'id'):
            serializer.save(
                user=self.request.user,
                created_by=f"{self.request.user.first_name} {self.request.user.last_name}".strip() or self.request.user.username,
                event_type=event_type,
                attendees=attendees,
                duration=duration,
                total_budget=total_budget,
                venue_type=venue_type,
                services=services
            )
        else:
            # Force use user ID 2 (saiku) for now since authentication isn't working properly
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(id=2)
                serializer.save(
                    user=user,
                    created_by=user.username,
                    event_type=event_type,
                    attendees=attendees,
                    duration=duration,
                    total_budget=total_budget,
                    venue_type=venue_type,
                    services=services
                )
            except User.DoesNotExist:
                serializer.save(
                    user=None,
                    created_by="Guest User",
                    event_type=event_type,
                    attendees=attendees,
                    duration=duration,
                    total_budget=total_budget,
                    venue_type=venue_type,
                    services=services
                )

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        
        events = self.queryset
        
        if query:
            events = events.filter(
                Q(event_name__icontains=query) |
                Q(form_data__icontains=query)
            )
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='states', permission_classes=[])
    def get_states(self, request):
        """Get all unique states from locations table with error handling"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT DISTINCT state FROM locations ORDER BY state")
                states = cursor.fetchall()
                states_list = [{"name": state[0]} for state in states if state[0]]
                return Response({"states": states_list})
        except Exception as e:
            logger.error(f"Error fetching states: {str(e)}")
            return Response({"states": [], "error": "Failed to fetch states"})

    @action(detail=False, methods=['get'], url_path='cities', permission_classes=[])
    def get_cities(self, request):
        """Get cities for a specific state from locations table with validation"""
        try:
            state_name = request.query_params.get('state')
            if not state_name:
                return Response({"cities": [], "error": "State parameter is required"})
            
            # Validate and sanitize state name
            state_name = ValidationLayer.validate_text_field(
                state_name, max_length=100, field_name="State"
            )
            
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT city FROM locations WHERE state = %s ORDER BY city", 
                    [state_name]
                )
                cities = cursor.fetchall()
                cities_list = [{"name": city[0]} for city in cities if city[0]]
                return Response({"cities": cities_list})
                
        except ValidationError as e:
            error_response = ErrorHandler.handle_validation_error(e, 'get_cities')
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error fetching cities: {str(e)}")
            return Response({"cities": [], "error": "Failed to fetch cities"})

    @action(detail=False, methods=['get'], url_path='traditions/by_event_type', permission_classes=[])
    def get_traditions_by_event_type(self, request):
        """Get tradition styles for a specific event type"""
        event_type = request.query_params.get('event_type')
        if not event_type:
            return Response([])
        
        try:
            traditions = TraditionStyle.objects.filter(event_type=event_type)
            serializer = TraditionStyleSerializer(traditions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])

    @action(detail=False, methods=['get'], url_path='sections')
    def get_event_sections(self, request):
        """Get all event sections with subsections"""
        try:
            sections = EventSection.objects.prefetch_related('subsections').all()
            serializer = EventSectionSerializer(sections, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])

    @action(detail=False, methods=['get'], url_path='images')
    def get_event_images(self, request):
        """Get event images"""
        try:
            images = EventImage.objects.all()
            serializer = EventImageSerializer(images, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])

    @action(detail=False, methods=['get'], url_path='requirements', permission_classes=[])
    def get_event_requirements(self, request):
        """Get event requirements by event_id, with fallback to all requirements"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response([])
        
        try:
            # First try to get event-specific requirements
            requirements = EventRequirement.objects.filter(event_id=event_id)
            
            # If no event-specific requirements found, return all requirements
            if not requirements.exists():
                requirements = EventRequirement.objects.all()
            
            serializer = EventRequirementSerializer(requirements, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])
    
    @action(detail=False, methods=['get'], url_path='dynamic-requirements')
    def get_dynamic_requirements(self, request):
        """Get dynamic requirements for an event type"""
        event_type = request.query_params.get('event_type')
        subsection_id = request.query_params.get('subsection_id')
        
        if not event_type and not subsection_id:
            return Response({})
        
        try:
            # Use subsection_id first, then event_type
            search_id = subsection_id or event_type
            
            # Get requirements for this specific event
            requirements = EventRequirement.objects.filter(event_id=search_id)
            
            # Group requirements by category
            grouped_requirements = {}
            for req in requirements:
                if req.category_name not in grouped_requirements:
                    grouped_requirements[req.category_name] = []
                
                req_data = {
                    'id': req.requirement_id,
                    'label': req.label,
                    'category': req.category
                }
                
                if req.unit:
                    req_data['unit'] = req.unit
                if req.placeholder:
                    req_data['placeholder'] = req.placeholder
                
                grouped_requirements[req.category_name].append(req_data)
            
            return Response(grouped_requirements)
        
        except Exception as e:
            return Response({})

    @action(detail=False, methods=['get'], url_path='vendor-categories')
    def get_vendor_categories(self, request):
        """Get vendor categories"""
        try:
            categories = VendorCategory.objects.all()
            serializer = VendorCategorySerializer(categories, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])

    @action(detail=False, methods=['get'], url_path='hero-video', permission_classes=[])
    def get_hero_video(self, request):
        """Get active hero video"""
        try:
            video = HeroVideo.objects.filter(is_active=True).first()
            if video:
                serializer = HeroVideoSerializer(video)
                return Response(serializer.data)
            return Response({'video_url': '/videos/party-hero.mp4'})
        except Exception as e:
            return Response({'video_url': '/videos/party-hero.mp4'})

    
    @action(detail=False, methods=['get'], url_path='requirement-questions', permission_classes=[])
    def get_requirement_questions(self, request):
        """Get dynamic questions for a specific requirement"""
        requirement_id = request.query_params.get('requirement_id')
        event_id = request.query_params.get('event_id')
        
        try:
            # Find requirement by requirement_id and event_id
            filters = {'requirement_id': requirement_id}
            if event_id:
                filters['event_id'] = event_id
            
            requirement = EventRequirement.objects.filter(**filters).first()
            
            if requirement:
                # Use the requirement object (foreign key) to find questions
                questions = RequirementQuestion.objects.filter(requirement=requirement)
                serializer = RequirementQuestionSerializer(questions, many=True)
                
                return Response({
                    'requirement': {
                        'id': requirement.requirement_id,
                        'label': requirement.label,
                        'category': requirement.category
                    },
                    'questions': serializer.data
                })
            
            return Response({'questions': []})
            
        except Exception as e:
            return Response({'questions': []}, status=200)
    
    @action(detail=False, methods=['get'], url_path='requirement-images', permission_classes=[])
    def get_requirement_images(self, request):
        """Get images for a specific requirement"""
        requirement_name = request.query_params.get('requirement_name')
        event_name = request.query_params.get('event_name')
        
        if not requirement_name:
            return Response({'error': 'requirement_name is required'}, status=400)
        
        try:
            # Match both event_name and requirement_name
            if event_name:
                images = EventRequirementImages.objects.filter(
                    event_name=event_name,
                    requirement_name=requirement_name
                ).order_by('image_number')
            else:
                images = EventRequirementImages.objects.filter(
                    requirement_name=requirement_name
                ).order_by('image_number')
            
            image_urls = [img.image_url for img in images]
            
            return Response({
                'requirement_name': requirement_name,
                'event_name': event_name,
                'images': image_urls
            })
            
        except Exception as e:
            return Response({'images': []}, status=200)
    
    @action(detail=True, methods=['post'], url_path='allocate-budget')
    def allocate_budget(self, request, pk=None):
        """Generate smart budget allocation for an event with comprehensive error handling"""
        try:
            with transaction.atomic():
                event = self.get_object()
                
                # Validate user permissions
                if event.user and event.user != request.user:
                    error_response = ErrorHandler.handle_permission_error(
                        "Cannot allocate budget for another user's event", 'allocate_budget'
                    )
                    return Response(error_response, status=status.HTTP_403_FORBIDDEN)
            form_data = event.form_data or {}
            
            # Safely get values with proper defaults
            event_type = form_data.get('event_type') or getattr(event, 'event_type', 'other')
            
            # Handle attendees
            attendees_raw = form_data.get('attendees') or getattr(event, 'attendees', 50)
            try:
                attendees = int(attendees_raw)
            except (ValueError, TypeError):
                attendees = 50
            
            # Handle duration
            duration_raw = form_data.get('duration') or getattr(event, 'duration', 4)
            try:
                if isinstance(duration_raw, str):
                    duration = int(duration_raw.split('-')[0]) if '-' in duration_raw else 4
                else:
                    duration = int(duration_raw)
            except (ValueError, TypeError):
                duration = 4
            
            # Handle budget
            budget_raw = form_data.get('budget') or getattr(event, 'total_budget', 200000)
            try:
                total_budget = Decimal(str(budget_raw))
            except (ValueError, TypeError, decimal.InvalidOperation):
                total_budget = Decimal('200000')
            
            venue_type = getattr(event, 'venue_type', 'indoor')
            special_requirements = getattr(event, 'special_requirements', {}) or {}
            selected_services = getattr(event, 'selected_services', []) or []
            
            # Debug logging
            logger.info(f"Event ID: {event.id}")
            logger.info(f"Event name: {event.event_name}")
            logger.info(f"Event type: {event_type}")
            logger.info(f"Special requirements: {special_requirements}")
            logger.info(f"Selected services: {selected_services}")
            logger.info(f"Form data: {form_data}")
            
            # Add selected_services to special_requirements if they exist
            if selected_services:
                for service in selected_services:
                    if service not in special_requirements:
                        special_requirements[service] = {'selected': True}
            
            # Calculate smart allocation with both data sources
            allocation = SmartBudgetAllocator.calculate_smart_allocation(
                event_type=event_type,
                venue_type=venue_type,
                attendees=attendees,
                duration=duration,
                total_budget=total_budget,
                special_requirements=special_requirements,
                selected_services_list=selected_services
            )
            
            # Convert allocation to serializable format
            allocations_data = []
            allocations_dict = {}
            total_allocated = 0
            for category, data in allocation.items():
                allocations_data.append({
                    'category': category,
                    'percentage': float(data['percentage']),
                    'amount': float(data['amount']),
                    'per_guest_cost': float(data.get('per_guest_cost', 0)),
                    'per_hour_cost': float(data.get('per_hour_cost', 0))
                })
                allocations_dict[category] = {
                    'percentage': float(data['percentage']),
                    'amount': float(data['amount']),
                    'per_guest_cost': float(data.get('per_guest_cost', 0)),
                    'per_hour_cost': float(data.get('per_hour_cost', 0))
                }
                total_allocated += float(data['amount'])
            
            efficiency_score = self._calculate_efficiency_score(allocation, event)
            
            # Save budget allocation to database
            budget, created = Budget.objects.get_or_create(
                event=event,
                defaults={
                    'user': event.user,
                    'total_budget': total_budget,
                    'allocations': allocations_dict,
                    'allocation_method': 'smart',
                    'efficiency_score': efficiency_score,
                    'cost_per_guest': total_budget / attendees if attendees > 0 else None,
                    'cost_per_hour': total_budget / duration if duration > 0 else None,
                    'insights': {
                        'status': 'Excellent' if efficiency_score >= 95 else 'Good' if efficiency_score >= 85 else 'Fair',
                        'total_allocated': total_allocated,
                        'remaining': float(total_budget) - total_allocated
                    },
                    'detailed_breakdown': {}
                }
            )
            
            if not created:
                # Update existing budget
                budget.allocations = allocations_dict
                budget.allocation_method = 'smart'
                budget.efficiency_score = efficiency_score
                budget.cost_per_guest = total_budget / attendees if attendees > 0 else None
                budget.cost_per_hour = total_budget / duration if duration > 0 else None
                budget.insights = {
                    'status': 'Excellent' if efficiency_score >= 95 else 'Good' if efficiency_score >= 85 else 'Fair',
                    'total_allocated': total_allocated,
                    'remaining': float(total_budget) - total_allocated
                }
                budget.save()
            
            return Response({
                'message': 'Budget allocated successfully',
                'allocations': allocations_data,
                'total_budget': str(total_budget),
                'efficiency_score': efficiency_score
            })
            
        except ObjectDoesNotExist:
            error_response = ErrorHandler.handle_not_found_error('Event', 'allocate_budget')
            return Response(error_response, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            error_response = ErrorHandler.handle_validation_error(e, 'allocate_budget')
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_response = ErrorHandler.handle_generic_error(e, 'allocate_budget')
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['put'], url_path='update-budget')
    def update_budget(self, request, pk=None):
        """Update manual budget allocation"""
        try:
            event = self.get_object()
            allocations_data = request.data.get('allocations', {})
            
            # Convert to Decimal for validation
            decimal_allocations = {}
            for category, percentage in allocations_data.items():
                decimal_allocations[category] = Decimal(str(percentage))
            
            # Validate allocation
            is_valid, error_msg, validated_allocation = SmartBudgetAllocator.validate_manual_allocation(
                decimal_allocations, event.total_budget, event.attendees, event.duration
            )
            
            if not is_valid:
                return Response(
                    {'error': error_msg}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Convert validated allocation to serializable format
            allocations_list = []
            allocations_dict = {}
            total_allocated = 0
            for category, data in validated_allocation.items():
                allocations_list.append({
                    'category': category,
                    'percentage': float(data['percentage']),
                    'amount': float(data['amount']),
                    'per_guest_cost': float(data.get('per_guest_cost', 0)),
                    'per_hour_cost': float(data.get('per_hour_cost', 0))
                })
                allocations_dict[category] = {
                    'percentage': float(data['percentage']),
                    'amount': float(data['amount']),
                    'per_guest_cost': float(data.get('per_guest_cost', 0)),
                    'per_hour_cost': float(data.get('per_hour_cost', 0))
                }
                total_allocated += float(data['amount'])
            
            # Update budget in database
            budget, created = Budget.objects.get_or_create(
                event=event,
                defaults={
                    'user': event.user,
                    'total_budget': event.total_budget,
                    'allocation_method': 'manual'
                }
            )
            
            budget.allocations = allocations_dict
            budget.allocation_method = 'manual'
            budget.efficiency_score = 85.0  # Default for manual
            budget.cost_per_guest = event.total_budget / event.attendees if event.attendees > 0 else None
            budget.cost_per_hour = event.total_budget / event.duration if event.duration > 0 else None
            budget.insights = {
                'status': 'Manual Allocation',
                'total_allocated': total_allocated,
                'remaining': float(event.total_budget) - total_allocated
            }
            budget.save()
            
            return Response({
                'message': 'Budget updated successfully',
                'allocations': allocations_list,
                'total_budget': str(event.total_budget)
            })
            
        except Exception as e:
            logger.error(f"Error updating budget: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'], url_path='budget-summary')
    def get_budget_summary(self, request, pk=None):
        """Get comprehensive budget summary for an event"""
        try:
            event = self.get_object()
            form_data = event.form_data or {}
            
            # Safely get values with proper defaults
            event_type = form_data.get('event_type') or getattr(event, 'event_type', 'other')
            
            # Handle attendees
            attendees_raw = form_data.get('attendees') or getattr(event, 'attendees', 50)
            try:
                attendees = int(attendees_raw)
            except (ValueError, TypeError):
                attendees = 50
            
            # Handle duration
            duration_raw = form_data.get('duration') or getattr(event, 'duration', 4)
            try:
                if isinstance(duration_raw, str):
                    duration = int(duration_raw.split('-')[0]) if '-' in duration_raw else 4
                else:
                    duration = int(duration_raw)
            except (ValueError, TypeError):
                duration = 4
            
            # Handle budget
            budget_raw = form_data.get('budget') or getattr(event, 'total_budget', 200000)
            try:
                total_budget_decimal = Decimal(str(budget_raw))
                total_budget = str(total_budget_decimal)
            except (ValueError, TypeError, decimal.InvalidOperation):
                total_budget_decimal = Decimal('200000')
                total_budget = '200000'
            
            venue_type = getattr(event, 'venue_type', 'indoor')
            special_requirements = getattr(event, 'special_requirements', {}) or {}
            selected_services = getattr(event, 'selected_services', []) or []
            
            # Also check form_data for selectedServices
            if form_data.get('selectedServices'):
                for service in form_data['selectedServices']:
                    if service not in selected_services:
                        selected_services.append(service)
            
            # Generate allocation for display with special requirements
            allocation = SmartBudgetAllocator.calculate_smart_allocation(
                event_type=event_type,
                venue_type=venue_type,
                attendees=attendees,
                duration=duration,
                total_budget=total_budget_decimal,
                special_requirements=special_requirements,
                selected_services_list=selected_services
            )
            
            # Handle empty allocation
            if not allocation:
                return Response({
                    'message': 'No services selected for budget allocation',
                    'has_allocation': False,
                    'allocations': [],
                    'total_budget': str(total_budget)
                })
            
            allocations_data = []
            total_allocated = 0
            allocations_dict = {}
            
            if allocation:
                for category, data in allocation.items():
                    allocations_data.append({
                        'category': category,
                        'percentage': float(data['percentage']),
                        'amount': float(data['amount']),
                        'per_guest_cost': float(data.get('per_guest_cost', 0)),
                        'per_hour_cost': float(data.get('per_hour_cost', 0))
                    })
                    allocations_dict[category] = {
                        'percentage': float(data['percentage']),
                        'amount': float(data['amount']),
                        'per_guest_cost': float(data.get('per_guest_cost', 0)),
                        'per_hour_cost': float(data.get('per_hour_cost', 0))
                    }
                    total_allocated += float(data['amount'])
            
            # Generate detailed breakdown
            detailed_breakdown = self._generate_detailed_breakdown(
                allocations_data, special_requirements, attendees, duration
            )
            
            efficiency_score = self._calculate_efficiency_score(allocation, event)
            
            # Save/Update budget data in database
            budget, created = Budget.objects.get_or_create(
                event=event,
                defaults={
                    'user': event.user,
                    'total_budget': total_budget_decimal,
                    'allocations': allocations_dict,
                    'allocation_method': 'smart',
                    'efficiency_score': efficiency_score,
                    'cost_per_guest': total_budget_decimal / attendees if attendees > 0 else None,
                    'cost_per_hour': total_budget_decimal / duration if duration > 0 else None,
                    'insights': {
                        'status': 'Excellent' if efficiency_score >= 95 else 'Good' if efficiency_score >= 85 else 'Fair',
                        'total_allocated': total_allocated,
                        'remaining': float(total_budget_decimal) - total_allocated
                    },
                    'detailed_breakdown': detailed_breakdown
                }
            )
            
            if not created:
                # Update existing budget
                budget.total_budget = total_budget_decimal
                budget.allocations = allocations_dict
                budget.efficiency_score = efficiency_score
                budget.cost_per_guest = total_budget_decimal / attendees if attendees > 0 else None
                budget.cost_per_hour = total_budget_decimal / duration if duration > 0 else None
                budget.insights = {
                    'status': 'Excellent' if efficiency_score >= 95 else 'Good' if efficiency_score >= 85 else 'Fair',
                    'total_allocated': total_allocated,
                    'remaining': float(total_budget_decimal) - total_allocated
                }
                budget.detailed_breakdown = detailed_breakdown
                budget.save()
            
            return Response({
                'message': 'Budget allocation available',
                'has_allocation': True,
                'allocations': allocations_data,
                'detailed_breakdown': detailed_breakdown,
                'formatted_requirements': self._format_answers_for_display(special_requirements),
                'summary': {
                    'total_allocated': total_allocated,
                    'remaining_budget': float(total_budget) - total_allocated,
                    'efficiency_score': efficiency_score,
                    'cost_per_guest': total_allocated / attendees if attendees > 0 else 0,
                    'cost_per_hour': total_allocated / duration if duration > 0 else 0
                },
                'event': {
                    'id': event.id,
                    'name': event.event_name,
                    'type': event_type,
                    'attendees': attendees,
                    'venue_type': venue_type,
                    'duration': duration,
                    'total_budget': str(total_budget)
                },
                'insights': self._generate_budget_insights(allocations_data, event)
            })
            
        except Exception as e:
            logger.error(f"Error getting budget summary: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _calculate_efficiency_score(self, allocation: Dict, event: Event) -> float:
        """Calculate efficiency score based on allocation and event characteristics"""
        try:
            # Base score
            score = 85.0
            
            # Get event type safely
            event_type = getattr(event, 'event_type', 'other')
            
            # Adjust based on event type optimization
            if event_type == 'wedding':
                if allocation.get('photography', {}).get('percentage', 0) >= 12:
                    score += 5
                if allocation.get('decorations', {}).get('percentage', 0) >= 18:
                    score += 3
            elif event_type == 'corporate':
                if allocation.get('venue', {}).get('percentage', 0) >= 25:
                    score += 5
                if allocation.get('catering', {}).get('percentage', 0) >= 30:
                    score += 3
            
            # Adjust based on balance
            catering_pct = allocation.get('catering', {}).get('percentage', 0)
            if 30 <= catering_pct <= 40:
                score += 5
            
            return min(100.0, max(60.0, score))
            
        except Exception:
            return 75.0
    
    def _generate_detailed_breakdown(self, allocations: List, special_requirements: Dict, attendees: int, duration: int) -> Dict:
        """Generate detailed breakdown with requirement explanations"""
        breakdown = {}
        
        category_map = {
            'catering': ['cake', 'catering', 'food'],
            'decorations': ['decoration', 'balloon', 'flower', 'mandap'],
            'photography': ['photography', 'videography'],
            'entertainment': ['band', 'dj', 'music'],
            'venue': ['venue', 'hall', 'location']
        }
        
        for allocation in allocations:
            category = allocation['category']
            keywords = category_map.get(category, [])
            
            # Find matching requirements
            matching_reqs = []
            if special_requirements:
                for req_id, req_data in special_requirements.items():
                    if req_data.get('selected') and any(kw in req_id.lower() for kw in keywords):
                        # Get questions and format answers properly
                        questions = req_data.get('questions', [])
                        answers = req_data.get('answers', {})
                        
                        formatted_answers = {}
                        for question in questions:
                            question_id = str(question.get('id'))
                            if question_id in answers:
                                question_text = question.get('question_text', f'Question {question_id}')
                                answer_value = answers[question_id]
                                
                                # Format answer based on type
                                if isinstance(answer_value, list):
                                    formatted_answers[question_text] = ', '.join(answer_value)
                                else:
                                    formatted_answers[question_text] = str(answer_value)
                        
                        req_info = {
                            'name': req_id.replace('-', ' ').title(),
                            'answers': formatted_answers,
                            'raw_answers': answers,  # Keep original for compatibility
                            'questions': questions,  # Include questions for reference
                            'impact': self._determine_cost_impact(formatted_answers)
                        }
                        matching_reqs.append(req_info)
            
            breakdown[category] = {
                'allocation': allocation,
                'requirements': matching_reqs,
                'per_guest_cost': allocation['amount'] / attendees if attendees > 0 else 0,
                'per_hour_cost': allocation['amount'] / duration if duration > 0 else 0
            }
        
        return breakdown
    
    def _determine_cost_impact(self, answers: Dict) -> str:
        """Determine cost impact based on requirement answers"""
        high_cost_keywords = ['artistic', 'creative', '8-10 hours', 'full day', 'video highlights', 'raw footage', 'same day edit', 'cinematic', 'professional', 'luxury', 'premium']
        medium_cost_keywords = ['formal', 'posed', '4-6 hours', 'printed photos', 'digital gallery', 'live', 'grand']
        
        answer_text = ' '.join(str(v).lower() for v in answers.values())
        
        if any(keyword.lower() in answer_text for keyword in high_cost_keywords):
            return 'High Cost Impact'
        elif any(keyword.lower() in answer_text for keyword in medium_cost_keywords):
            return 'Medium Cost Impact'
        else:
            return 'Standard Cost'
    
    def _generate_budget_insights(self, allocations: List, event: Event) -> Dict:
        """Generate budget insights and recommendations"""
        highest_category = max(allocations, key=lambda x: x['percentage'])
        total_amount = sum(a['amount'] for a in allocations)
        
        insights = {
            'highest_allocation': {
                'category': highest_category['category'],
                'percentage': highest_category['percentage'],
                'reason': self._get_allocation_reason(highest_category['category'], event)
            },
            'recommendations': self._get_budget_recommendations(allocations, event),
            'cost_efficiency': {
                'per_guest': total_amount / getattr(event, 'attendees', 50) if getattr(event, 'attendees', 50) > 0 else 0,
                'per_hour': total_amount / getattr(event, 'duration', 4) if getattr(event, 'duration', 4) > 0 else 0
            }
        }
        
        return insights
    
    def _get_allocation_reason(self, category: str, event: Event) -> str:
        """Get reason for high allocation in a category"""
        reasons = {
            'catering': 'High allocation due to premium cake requirements and multi-cuisine catering',
            'photography': 'Increased for professional cinematic photography and videography',
            'decorations': 'Enhanced for luxury decorations and mandap setup',
            'venue': 'Premium venue requirements for large guest capacity',
            'entertainment': 'Live band and professional entertainment services'
        }
        return reasons.get(category, 'Standard allocation for this category')
    
    def _get_budget_recommendations(self, allocations: List, event: Event) -> List[str]:
        """Generate budget optimization recommendations"""
        recommendations = []
        
        catering_pct = next((a['percentage'] for a in allocations if a['category'] == 'catering'), 0)
        if catering_pct > 60:
            recommendations.append('Consider simplifying cake design or catering options to reduce costs')
        
        photography_pct = next((a['percentage'] for a in allocations if a['category'] == 'photography'), 0)
        event_type = getattr(event, 'event_type', 'other')
        if photography_pct < 8 and event_type == 'wedding':
            recommendations.append('Consider increasing photography budget for better wedding memories')
        
        if not recommendations:
            recommendations.append('Budget allocation looks well-balanced for your event requirements')
        
        return recommendations
    
    def _format_answers_for_display(self, special_requirements: Dict) -> Dict:
        """Format answers with question text for frontend display"""
        formatted_requirements = {}
        
        for req_id, req_data in special_requirements.items():
            if not req_data.get('selected'):
                continue
                
            questions = req_data.get('questions', [])
            answers = req_data.get('answers', {})
            
            formatted_answers = {}
            for question in questions:
                question_id = str(question.get('id'))
                if question_id in answers:
                    question_text = question.get('question_text', f'Question {question_id}')
                    answer_value = answers[question_id]
                    
                    if isinstance(answer_value, list):
                        formatted_answers[question_text] = ', '.join(answer_value)
                    else:
                        formatted_answers[question_text] = str(answer_value)
            
            formatted_requirements[req_id] = {
                'name': req_id.replace('-', ' ').title(),
                'selected': True,
                'formatted_answers': formatted_answers,
                'original_answers': answers,
                'questions': questions
            }
        
        return formatted_requirements

# Milestone API endpoints
from rest_framework.decorators import api_view

@api_view(['GET', 'POST', 'PUT'])
def event_milestones(request, event_id=None):
    if request.method == 'GET':
        try:
            milestone = EventMilestone.objects.get(event_id=event_id)
            serializer = EventMilestoneSerializer(milestone)
            return Response(serializer.data)
        except EventMilestone.DoesNotExist:
            return Response({'milestones': {}}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        try:
            event = Event.objects.get(id=event_id)
            milestone, created = EventMilestone.objects.get_or_create(
                event=event,
                defaults={'milestones': request.data.get('milestones', {})}
            )
            if not created:
                milestone.milestones = request.data.get('milestones', {})
                milestone.save()
            
            serializer = EventMilestoneSerializer(milestone)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'PUT':
        try:
            milestone = EventMilestone.objects.get(event_id=event_id)
            milestone.milestones = request.data.get('milestones', {})
            milestone.save()
            serializer = EventMilestoneSerializer(milestone)
            return Response(serializer.data)
        except EventMilestone.DoesNotExist:
            return Response({'error': 'Milestone not found'}, status=status.HTTP_404_NOT_FOUND)

class QuoteRequestViewSet(viewsets.ModelViewSet):
    queryset = QuoteRequest.objects.all().order_by('-created_at')
    serializer_class = QuoteRequestSerializer
    permission_classes = []
    
    def get_queryset(self):
        """Filter quote requests by authenticated user"""
        if self.request.user.is_authenticated:
            return QuoteRequest.objects.filter(user=self.request.user).order_by('-created_at')
        # For unauthenticated requests, filter by user ID 2 (saiku) since that's who's creating quotes
        return QuoteRequest.objects.filter(user_id=2).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Automatically assign the authenticated user and link to source event if provided"""
        save_kwargs = {}
        
        if self.request.user.is_authenticated:
            save_kwargs['user'] = self.request.user
        else:
            # Force use user ID 2 (saiku) for now since authentication isn't working properly
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(id=2)
                save_kwargs['user'] = user
            except User.DoesNotExist:
                pass
        
        # Link to source event if prefilled_event_id is provided
        prefilled_event_id = self.request.data.get('prefilled_event_id')
        if prefilled_event_id:
            try:
                source_event = Event.objects.get(id=prefilled_event_id)
                save_kwargs['source_event'] = source_event
            except Event.DoesNotExist:
                pass
        
        serializer.save(**save_kwargs)
    
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update quote request status"""
        try:
            quote_request = self.get_object()
            new_status = request.data.get('status')
            
            if new_status not in ['pending', 'in_progress', 'completed', 'cancelled']:
                return Response(
                    {'error': 'Invalid status'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            quote_request.status = new_status
            quote_request.save()
            
            serializer = self.get_serializer(quote_request)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='by-event')
    def get_quotes_by_event(self, request):
        """Get all quote requests for a specific event"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        quotes = self.get_queryset().filter(source_event_id=event_id)
        serializer = self.get_serializer(quotes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='targeted')
    def get_targeted_quotes(self, request):
        """Get all targeted quote requests"""
        quotes = self.get_queryset().filter(quote_type='targeted')
        serializer = self.get_serializer(quotes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='stats')
    def get_quote_stats(self, request):
        """Get quote request statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total_quotes': queryset.count(),
            'pending_quotes': queryset.filter(status='pending').count(),
            'completed_quotes': queryset.filter(status='completed').count(),
            'targeted_quotes': queryset.filter(quote_type='targeted').count(),
            'comprehensive_quotes': queryset.filter(quote_type='comprehensive').count(),
            'avg_vendor_count': queryset.aggregate(
                avg_vendors=models.Avg(
                    models.Case(
                        models.When(selected_vendors__isnull=False, then=models.Func(
                            'selected_vendors', function='JSON_LENGTH'
                        )),
                        default=0,
                        output_field=models.IntegerField()
                    )
                )
            )['avg_vendors'] or 0
        }
        
        return Response(stats)

import uuid
from django.utils import timezone

class RSVPViewSet(viewsets.ModelViewSet):
    queryset = RSVP.objects.all().order_by('-created_at')
    serializer_class = RSVPSerializer
    permission_classes = []
    
    def get_queryset(self):
        """Filter RSVPs by authenticated user"""
        if self.request.user.is_authenticated:
            return RSVP.objects.filter(user=self.request.user).order_by('-created_at')
        # For unauthenticated requests, filter by user ID 2 (saiku)
        return RSVP.objects.filter(user_id=2).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Generate unique invitation code and assign user"""
        # Generate unique invitation code
        while True:
            invitation_code = str(uuid.uuid4())[:8].upper()
            if not RSVP.objects.filter(invitation_code=invitation_code).exists():
                break
        
        save_kwargs = {'invitation_code': invitation_code}
        
        if self.request.user.is_authenticated:
            save_kwargs['user'] = self.request.user
        else:
            # Force use user ID 2 (saiku) for now
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(id=2)
                save_kwargs['user'] = user
            except User.DoesNotExist:
                pass
        
        serializer.save(**save_kwargs)
    
    @action(detail=False, methods=['get'], url_path='by-event')
    def get_rsvps_by_event(self, request):
        """Get all RSVPs for a specific event"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        rsvps = self.get_queryset().filter(event_id=event_id)
        serializer = self.get_serializer(rsvps, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], url_path='respond')
    def respond_to_invitation(self, request, pk=None):
        """Guest responds to RSVP invitation"""
        try:
            rsvp = self.get_object()
            response_status = request.data.get('response_status')
            plus_ones = request.data.get('plus_ones', 0)
            dietary_restrictions = request.data.get('dietary_restrictions', '')
            special_requests = request.data.get('special_requests', '')
            
            if response_status not in ['accepted', 'declined', 'maybe']:
                return Response(
                    {'error': 'Invalid response status'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            rsvp.response_status = response_status
            rsvp.response_date = timezone.now()
            rsvp.plus_ones = plus_ones if response_status == 'accepted' else 0
            rsvp.dietary_restrictions = dietary_restrictions
            rsvp.special_requests = special_requests
            rsvp.save()
            
            serializer = self.get_serializer(rsvp)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='by-invitation')
    def get_by_invitation_code(self, request):
        """Get RSVP by invitation code (for guest response)"""
        invitation_code = request.query_params.get('code')
        if not invitation_code:
            return Response({'error': 'invitation code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            rsvp = RSVP.objects.get(invitation_code=invitation_code)
            serializer = self.get_serializer(rsvp)
            return Response(serializer.data)
        except RSVP.DoesNotExist:
            return Response({'error': 'Invalid invitation code'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='stats')
    def get_rsvp_stats(self, request):
        """Get RSVP statistics for an event"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        rsvps = RSVP.objects.filter(event_id=event_id)
        
        stats = {
            'total_invitations': rsvps.count(),
            'accepted': rsvps.filter(response_status='accepted').count(),
            'declined': rsvps.filter(response_status='declined').count(),
            'maybe': rsvps.filter(response_status='maybe').count(),
            'pending': rsvps.filter(response_status='pending').count(),
            'total_attendees': sum(rsvp.total_attendees for rsvp in rsvps),
            'response_rate': (rsvps.exclude(response_status='pending').count() / rsvps.count() * 100) if rsvps.count() > 0 else 0
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['post'], url_path='bulk-invite')
    def bulk_invite(self, request):
        """Create multiple RSVP invitations at once"""
        try:
            event_id = request.data.get('event_id')
            guests = request.data.get('guests', [])
            
            if not event_id:
                return Response({'error': 'event_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
            
            created_rsvps = []
            for guest_data in guests:
                # Generate unique invitation code
                while True:
                    invitation_code = str(uuid.uuid4())[:8].upper()
                    if not RSVP.objects.filter(invitation_code=invitation_code).exists():
                        break
                
                rsvp_data = {
                    'event': event,
                    'guest_data': guest_data,
                    'invitation_code': invitation_code
                }
                
                if self.request.user.is_authenticated:
                    rsvp_data['user'] = self.request.user
                else:
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    try:
                        user = User.objects.get(id=2)
                        rsvp_data['user'] = user
                    except User.DoesNotExist:
                        pass
                
                rsvp = RSVP.objects.create(**rsvp_data)
                created_rsvps.append(rsvp)
            
            serializer = self.get_serializer(created_rsvps, many=True)
            return Response({
                'message': f'Created {len(created_rsvps)} invitations',
                'rsvps': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Removed _calculate_efficiency_score_from_allocations - not needed without database

