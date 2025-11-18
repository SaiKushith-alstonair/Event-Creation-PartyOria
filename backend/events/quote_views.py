from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Event, QuoteRequest
from vendors.models import VendorAuth
from notifications.services import VendorNotifications, CustomerNotifications

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_quote_requests(request, event_id):
    """Send quote requests to matched vendors after budget completion"""
    try:
        event = get_object_or_404(Event, id=event_id, user=request.user)
        
        # Get matched vendors based on event requirements
        matched_vendors = match_vendors_to_event(event)
        
        if not matched_vendors:
            return Response({
                'success': False,
                'error': 'No matching vendors found for this event'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create quote request using existing model
        quote_request = QuoteRequest.objects.create(
            event_type=event.event_type,
            event_name=event.event_name,
            client_name=event.form_data.get('clientName', 'Customer'),
            client_email=event.form_data.get('clientEmail', ''),
            client_phone=event.form_data.get('clientPhone', ''),
            event_date=event.form_data.get('dateTime', timezone.now().date()),
            location=f"{event.form_data.get('city', '')}, {event.form_data.get('state', '')}",
            guest_count=event.attendees or 0,
            budget_range=f"₹{event.total_budget}",
            services=list(event.special_requirements.keys()) if event.special_requirements else [],
            description=event.form_data.get('description', ''),
            urgency='medium',
            user=request.user,
            prefilled_event_id=event.id,
            selected_vendors=[v.full_name for v in matched_vendors],
            is_targeted_quote=True,
            quote_type='targeted'
        )
        
        # Send notifications to vendors
        notifications_sent = 0
        for vendor in matched_vendors:
            if vendor.chat_user:
                VendorNotifications.new_quote_request(
                    vendor.chat_user,
                    event.form_data.get('clientName', 'Customer'),
                    event.event_type,
                    event.form_data.get('dateTime', 'TBD'),
                    quote_request.id
                )
                notifications_sent += 1
        
        return Response({
            'success': True,
            'quote_request_id': quote_request.id,
            'vendor_count': len(matched_vendors),
            'notifications_sent': notifications_sent
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_quote_requests(request):
    """Get pending quote requests for vendor"""
    try:
        vendor = get_object_or_404(VendorAuth, chat_user=request.user)
        
        quote_requests = QuoteRequest.objects.filter(
            selected_vendors__contains=[vendor.full_name],
            status__in=['pending', 'vendors_notified']
        ).order_by('-created_at')
        
        data = []
        for qr in quote_requests:
            data.append({
                'id': qr.id,
                'event_name': qr.event_name,
                'event_type': qr.event_type,
                'client_name': qr.client_name,
                'client_email': qr.client_email,
                'client_phone': qr.client_phone,
                'event_date': qr.event_date,
                'location': qr.location,
                'guest_count': qr.guest_count,
                'budget_range': qr.budget_range,
                'services': qr.services,
                'description': qr.description,
                'urgency': qr.urgency,
                'status': qr.status,
                'created_at': qr.created_at
            })
        
        return Response({
            'success': True,
            'quote_requests': data
        })
        
    except VendorAuth.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Vendor profile not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def quote_request_detail(request, quote_id):
    """Get detailed quote request information"""
    try:
        vendor = get_object_or_404(VendorAuth, chat_user=request.user)
        quote_request = get_object_or_404(QuoteRequest, id=quote_id, vendor=vendor)
        
        # Mark as viewed
        if quote_request.status == 'sent':
            quote_request.status = 'viewed'
            quote_request.viewed_at = timezone.now()
            quote_request.save()
        
        event = quote_request.event
        
        return Response({
            'success': True,
            'quote_request': {
                'id': quote_request.id,
                'event': {
                    'name': event.event_name,
                    'type': event.event_type,
                    'date': event.form_data.get('dateTime'),
                    'duration': event.form_data.get('duration'),
                    'location': f"{event.form_data.get('city', '')}, {event.form_data.get('state', '')}",
                    'attendees': event.attendees,
                    'description': event.form_data.get('description', ''),
                    'special_requirements': event.special_requirements
                },
                'client': {
                    'name': event.form_data.get('clientName', ''),
                    'email': event.form_data.get('clientEmail', ''),
                    'phone': event.form_data.get('clientPhone', '')
                },
                'requirement_category': quote_request.requirement_category,
                'budget_allocation': float(quote_request.budget_allocation),
                'expires_at': quote_request.expires_at,
                'has_responded': hasattr(quote_request, 'vendor_quote')
            }
        })
        
    except (VendorAuth.DoesNotExist, QuoteRequest.DoesNotExist):
        return Response({
            'success': False,
            'error': 'Quote request not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quote(request, quote_id):
    """Submit quote response"""
    try:
        vendor = get_object_or_404(VendorAuth, chat_user=request.user)
        quote_request = get_object_or_404(QuoteRequest, id=quote_id)
        
        # Check if vendor is in selected vendors
        if vendor.full_name not in quote_request.selected_vendors:
            return Response({
                'success': False,
                'error': 'Not authorized for this quote'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Validate input
        quote_amount = request.data.get('quote_amount')
        if not quote_amount or float(quote_amount) <= 0:
            return Response({
                'success': False,
                'error': 'Valid quote amount required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Store quote response in quote request
        vendor_responses = quote_request.vendor_responses or {}
        vendor_responses[vendor.full_name] = {
            'quote_amount': float(quote_amount),
            'message': request.data.get('message', ''),
            'includes': request.data.get('includes', []),
            'excludes': request.data.get('excludes', []),
            'terms': request.data.get('terms', ''),
            'submitted_at': timezone.now().isoformat(),
            'vendor_id': vendor.id,
            'vendor_business': vendor.business,
            'vendor_location': vendor.location
        }
        
        quote_request.vendor_responses = vendor_responses
        quote_request.status = 'responses_received'
        quote_request.save()
        
        # Notify customer
        if quote_request.user:
            CustomerNotifications.quote_received(
                quote_request.user,
                vendor.full_name,
                float(quote_amount),
                quote_request.event_type,
                quote_request.id
            )
        
        return Response({
            'success': True,
            'message': 'Quote submitted successfully'
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_quotes(request, event_id):
    """Get all quotes for an event (customer view)"""
    try:
        # Find quote requests for this user's events
        quote_requests = QuoteRequest.objects.filter(
            user=request.user,
            prefilled_event_id=event_id,
            status__in=['responses_received', 'completed']
        )
        
        data = []
        for qr in quote_requests:
            if qr.vendor_responses:
                for vendor_name, response in qr.vendor_responses.items():
                    data.append({
                        'id': f"{qr.id}_{vendor_name}",
                        'quote_request_id': qr.id,
                        'vendor': {
                            'name': vendor_name,
                            'business': response.get('vendor_business', ''),
                            'location': response.get('vendor_location', ''),
                            'experience': 'Professional'
                        },
                        'service_type': ', '.join(qr.services),
                        'quote_amount': response.get('quote_amount', 0),
                        'message': response.get('message', ''),
                        'includes': response.get('includes', []),
                        'excludes': response.get('excludes', []),
                        'terms': response.get('terms', ''),
                        'submitted_at': response.get('submitted_at', qr.created_at)
                    })
        
        return Response({
            'success': True,
            'quotes': data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_quote(request, quote_id):
    """Accept a vendor quote"""
    try:
        quote = get_object_or_404(VendorQuote, id=quote_id, quote_request__event__user=request.user)
        
        # Update quote status
        quote.status = 'accepted'
        quote.responded_at = timezone.now()
        quote.save()
        
        # Reject other quotes for same requirement
        VendorQuote.objects.filter(
            quote_request__event=quote.quote_request.event,
            quote_request__requirement_category=quote.quote_request.requirement_category
        ).exclude(id=quote_id).update(status='rejected')
        
        # Notify vendor
        if quote.quote_request.vendor.chat_user:
            VendorNotifications.quote_accepted(
                quote.quote_request.vendor.chat_user,
                quote.quote_request.event.form_data.get('clientName', 'Customer'),
                float(quote.quote_amount),
                quote.quote_request.event.event_type,
                quote.id
            )
        
        return Response({
            'success': True,
            'message': 'Quote accepted successfully'
        })
        
    except VendorQuote.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Quote not found'
        }, status=status.HTTP_404_NOT_FOUND)

# Helper functions
def match_vendors_to_event(event):
    """Simple vendor matching logic"""
    matched_vendors = []
    
    if not event.special_requirements:
        return matched_vendors
    
    # Get all categories from selected requirements
    categories = set()
    for req_id, req_data in event.special_requirements.items():
        if req_data.get('selected'):
            category = map_requirement_to_category(req_id)
            categories.add(category)
    
    # Find vendors matching any of the categories
    for category in categories:
        vendors = VendorAuth.objects.filter(
            city=event.form_data.get('city', ''),
            is_active=True,
            is_verified=True,
            services__contains=[category]
        )[:2]  # Limit to 2 vendors per category
        
        matched_vendors.extend(vendors)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_vendors = []
    for vendor in matched_vendors:
        if vendor.id not in seen:
            seen.add(vendor.id)
            unique_vendors.append(vendor)
    
    return unique_vendors[:5]  # Max 5 vendors total

def map_requirement_to_category(req_id):
    """Map requirement ID to vendor service category"""
    req_lower = req_id.lower()
    
    if any(word in req_lower for word in ['catering', 'food', 'menu']):
        return 'catering'
    elif any(word in req_lower for word in ['photo', 'camera']):
        return 'photography'
    elif any(word in req_lower for word in ['video', 'film']):
        return 'videography'
    elif any(word in req_lower for word in ['music', 'dj', 'band']):
        return 'music'
    elif any(word in req_lower for word in ['decor', 'decoration']):
        return 'decoration'
    elif any(word in req_lower for word in ['flower', 'floral']):
        return 'flowers'
    elif any(word in req_lower for word in ['transport', 'vehicle']):
        return 'transportation'
    elif any(word in req_lower for word in ['security', 'guard']):
        return 'security'
    else:
        return 'general'

def get_requirement_budget(event, requirement_id):
    """Get budget allocation for specific requirement"""
    if not event.budget_allocations:
        return Decimal('10000')  # Default budget
    
    category = map_requirement_to_category(requirement_id)
    
    # Map to budget categories
    budget_mapping = {
        'catering': 'catering',
        'photography': 'photography',
        'videography': 'videography',
        'music': 'entertainment',
        'decoration': 'decorations',
        'flowers': 'decorations',
        'transportation': 'transport',
        'security': 'security'
    }
    
    budget_category = budget_mapping.get(category, 'other_services')
    allocation = event.budget_allocations.get(budget_category, {})
    
    return Decimal(str(allocation.get('amount', 10000)))