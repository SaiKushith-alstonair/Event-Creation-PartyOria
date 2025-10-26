from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
import logging
from .models import Event, TraditionStyle, EventSection, EventSubsection, EventImage, EventRequirement, RequirementQuestion, EventRequirementImages, VendorCategory, HeroVideo
from .serializers import EventSerializer, TraditionStyleSerializer, EventSectionSerializer, EventImageSerializer, EventRequirementSerializer, RequirementQuestionSerializer, VendorCategorySerializer, HeroVideoSerializer

logger = logging.getLogger(__name__)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Creating event with data: {request.data}")
            
            # Validate required fields
            if not request.data.get('event_name'):
                return Response(
                    {'error': 'event_name is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Ensure form_data is a dict
            if 'form_data' not in request.data:
                request.data['form_data'] = {}
            
            # Ensure special_requirements is a dict
            if 'special_requirements' not in request.data:
                request.data['special_requirements'] = {}
            
            # Ensure selected_services is a list
            if 'selected_services' not in request.data:
                request.data['selected_services'] = []
            
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import traceback
            logger.error(f"Error creating event: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            logger.error(f"Request data: {request.data}")
            return Response(
                {'error': str(e), 'traceback': traceback.format_exc()}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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

    @action(detail=False, methods=['get'], url_path='states')
    def get_states(self, request):
        """Get all unique states from locations table"""
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT DISTINCT state FROM locations ORDER BY state")
            states = cursor.fetchall()
            states_list = [{"name": state[0]} for state in states]
            return Response({"states": states_list})
        except Exception as e:
            return Response({"states": []})

    @action(detail=False, methods=['get'], url_path='cities')
    def get_cities(self, request):
        """Get cities for a specific state from locations table"""
        state_name = request.query_params.get('state')
        if not state_name:
            return Response({"cities": []})
        
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT city FROM locations WHERE state = %s ORDER BY city", [state_name])
            cities = cursor.fetchall()
            cities_list = [{"name": city[0]} for city in cities]
            return Response({"cities": cities_list})
        except Exception as e:
            return Response({"cities": []})

    @action(detail=False, methods=['get'], url_path='traditions/by_event_type')
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

    @action(detail=False, methods=['get'], url_path='requirements')
    def get_event_requirements(self, request):
        """Get event requirements by event_id"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response([])
        
        try:
            requirements = EventRequirement.objects.filter(event_id=event_id)
            serializer = EventRequirementSerializer(requirements, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])
    
    @action(detail=False, methods=['get'], url_path='dynamic-requirements')
    def get_dynamic_requirements(self, request):
        """Get dynamic requirements for an event type, with fallback to default"""
        event_type = request.query_params.get('event_type')
        subsection_id = request.query_params.get('subsection_id')
        
        if not event_type and not subsection_id:
            return Response({})
        
        try:
            # Event mappings for fallback
            event_mappings = {
                'seminar': 'seminar',
                'award-ceremony': 'corporate-party',
                'trade-show': 'conference',
                'networking-mixer': 'corporate-party',
                'webinar': 'online-webinar',
                'anniversary': 'wedding',
                'baby-shower': 'birthday',
                'housewarming': 'birthday',
                'bachelor-party': 'corporate-party',
                'retirement': 'corporate-party',
                'farewell': 'corporate-party',
                'graduation-party': 'birthday',
                'reunion-party': 'corporate-party',
                'kitty-party': 'birthday',
                'pre-wedding-bash': 'wedding',
                'bridal-shower': 'birthday',
                'gender-reveal-party': 'birthday',
                'milestone-birthday': 'birthday',
                'family-reunion': 'corporate-party',
                'friendship-day-event': 'birthday',
                'valentines-day-celebration': 'birthday',
                'adoption-celebration': 'birthday',
                'eid-al-fitr': 'eid-celebration',
                'eid-al-adha': 'eid-celebration',
                'christmas-celebration': 'christmas-celebration',
                'new-years-party': 'new-years-party',
                'navratri-garba': 'navratri-garba',
                'ganesh-chaturthi': 'ganesh-chaturthi',
                'raksha-bandhan': 'raksha-bandhan',
                'janmashtami': 'janmashtami',
                'onam': 'onam',
                'durga-puja': 'durga-puja',
                'baisakhi': 'baisakhi',
                'gurupurab': 'gurupurab',
                'makar-sankranti': 'makar-sankranti',
                'easter-celebration': 'easter-celebration'
            }
            
            # Try to find requirements in this order:
            # 1. Exact subsection_id match
            # 2. Event mapping match
            # 3. Event type match
            # 4. Default requirements
            
            requirements = None
            search_ids = []
            
            if subsection_id:
                search_ids.append(subsection_id)
                if subsection_id in event_mappings:
                    search_ids.append(event_mappings[subsection_id])
            
            if event_type:
                search_ids.append(event_type)
                if event_type in event_mappings:
                    search_ids.append(event_mappings[event_type])
            
            search_ids.append('default')
            
            # Find first matching requirements
            for search_id in search_ids:
                requirements = EventRequirement.objects.filter(event_id=search_id)
                if requirements.exists():
                    break
            
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
            # Return default requirements if error
            default_requirements = {
                'Essential Services': [
                    {'id': 'event-photography', 'label': 'Event Photography', 'category': 'photography'},
                    {'id': 'event-coordination', 'label': 'Event Coordination', 'category': 'coordination'},
                    {'id': 'basic-decoration', 'label': 'Basic Decoration', 'category': 'decoration', 'unit': 'setups', 'placeholder': 'How many decoration setups?'},
                    {'id': 'sound-system', 'label': 'Sound System', 'category': 'music_dj'}
                ],
                'Catering Services': [
                    {'id': 'event-catering', 'label': 'Event Catering', 'category': 'catering', 'unit': 'meals', 'placeholder': 'How many meals?'},
                    {'id': 'refreshments', 'label': 'Refreshments', 'category': 'catering', 'unit': 'servings', 'placeholder': 'How many servings?'}
                ]
            }
            return Response(default_requirements)

    @action(detail=False, methods=['get'], url_path='vendor-categories')
    def get_vendor_categories(self, request):
        """Get vendor categories"""
        try:
            categories = VendorCategory.objects.all()
            serializer = VendorCategorySerializer(categories, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response([])

    @action(detail=False, methods=['get'], url_path='hero-video')
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


    
    @action(detail=False, methods=['get'], url_path='requirement-questions')
    def get_requirement_questions(self, request):
        """Get dynamic questions for a specific requirement"""
        requirement_id = request.query_params.get('requirement_id')
        event_id = request.query_params.get('event_id')
        
        if not requirement_id:
            return Response({'error': 'requirement_id is required'}, status=400)
        
        try:
            # Find the requirement
            requirement_filter = {'requirement_id': requirement_id}
            if event_id:
                requirement_filter['event_id'] = event_id
            
            requirement = EventRequirement.objects.filter(**requirement_filter).first()
            
            if not requirement:
                return Response({'questions': []})
            
            # Get questions for this requirement
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
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['get'], url_path='requirement-images')
    def get_requirement_images(self, request):
        """Get images for a specific requirement"""
        requirement_name = request.query_params.get('requirement_name')
        event_name = request.query_params.get('event_name')
        
        if not requirement_name:
            return Response({'error': 'requirement_name is required'}, status=400)
        
        try:
            # Filter by requirement_name and optionally by event_name
            filter_params = {'requirement_name': requirement_name}
            if event_name:
                filter_params['event_name'] = event_name
            
            images = EventRequirementImages.objects.filter(
                **filter_params
            ).order_by('event_name', 'image_number')
            
            image_urls = [img.image_url for img in images]
            
            return Response({
                'requirement_name': requirement_name,
                'event_name': event_name,
                'images': image_urls
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)