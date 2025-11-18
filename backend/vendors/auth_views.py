from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from authentication.models import CustomUser
from authentication.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import VendorAuth
import jwt
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class VendorRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Register a new vendor using VendorAuth model"""
        try:
            data = request.data
            print(f"Vendor registration data: {data}")
            
            # Check if email already exists
            if VendorAuth.objects.filter(email=data['email']).exists():
                return Response({'error': 'Email already exists'}, status=400)
            
            # Create vendor with minimal data - rest comes from onboarding
            vendor = VendorAuth.objects.create(
                email=data['email'],
                full_name=data['full_name'],
                mobile=data.get('mobile', ''),
                business=data.get('business', ''),
                experience_level=data.get('experience_level', ''),
                city=data.get('city', ''),
                state=data.get('state', ''),
                pincode=data.get('pincode', ''),
                location=data.get('location', ''),
                services=data.get('services', []),
                onboarding_completed=False  # New vendors need onboarding
            )
            vendor.set_password(data['password'])
            vendor.save()
            print(f"Vendor created successfully: {vendor.id}")
            
            # Generate JWT tokens using DRF SimpleJWT format
            from rest_framework_simplejwt.tokens import RefreshToken
            from authentication.models import CustomUser
            
            # Create corresponding CustomUser for JWT compatibility
            user, created = CustomUser.objects.get_or_create(
                email=vendor.email,
                user_type='vendor',
                defaults={
                    'username': vendor.email,
                    'password': None
                }
            )
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Create chat user for new vendor
            chat_user = vendor.get_or_create_chat_user()
            
            return Response({
                'message': 'Vendor registered successfully',
                'vendor': {
                    'id': vendor.id,
                    'email': vendor.email,
                    'full_name': vendor.full_name,
                    'mobile': vendor.mobile,
                    'business': vendor.business,
                    'experience_level': vendor.experience_level,
                    'city': vendor.city,
                    'state': vendor.state,
                    'pincode': vendor.pincode,
                    'location': vendor.location,
                    'services': vendor.services,
                    'is_verified': vendor.is_verified,
                    'onboarding_completed': vendor.onboarding_completed,
                    'user_type': 'vendor',
                    'chat_user_id': chat_user.id,
                    'access_token': access_token
                },
                'access': access_token,
                'refresh': refresh_token
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Vendor registration error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Keep function-based view as backup
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def vendor_register(request):
    """Register a new vendor"""
    try:
        data = request.data
        
        # Create user
        user = CustomUser.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data['password'],
            user_type='vendor'
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Return vendor data
        vendor_data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'user_type': user.user_type,
            'is_verified': user.is_verified
        }
        
        return Response({
            'vendor': vendor_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class VendorLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Vendor login using VendorAuth model"""
        try:
            print(f"Login attempt - Request data: {request.data}")
            email = request.data.get('email') or request.data.get('username')
            password = request.data.get('password')
            print(f"Login attempt - Email: {email}, Password provided: {bool(password)}")
            
            if not email or not password:
                print("Login failed - Missing email or password")
                return Response({'non_field_errors': ['Email and password are required']}, status=400)
            
            try:
                print(f"Looking for vendor with email: {email}")
                vendor = VendorAuth.objects.get(email=email)
                print(f"Found vendor: {vendor.full_name}")
                print(f"Checking password...")
                if vendor.check_password(password):
                    print("Password check passed")
                    # Generate JWT tokens using DRF SimpleJWT format
                    from rest_framework_simplejwt.tokens import RefreshToken
                    from authentication.models import CustomUser
                    
                    # Create or get corresponding CustomUser for JWT compatibility
                    user, created = CustomUser.objects.get_or_create(
                        email=vendor.email,
                        user_type='vendor',
                        defaults={
                            'username': vendor.email,
                            'password': None
                        }
                    )
                    
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    refresh_token = str(refresh)
                    
                    # Ensure chat user exists for this vendor
                    chat_user = vendor.get_or_create_chat_user()
                    
                    return Response({
                        'message': 'Login successful',
                        'vendor': {
                            'id': vendor.id,
                            'email': vendor.email,
                            'full_name': vendor.full_name,
                            'mobile': vendor.mobile,
                            'business': vendor.business,
                            'experience_level': vendor.experience_level,
                            'city': vendor.city,
                            'state': vendor.state,
                            'pincode': vendor.pincode,
                            'location': vendor.location,
                            'services': vendor.services,
                            'is_verified': vendor.is_verified,
                            'onboarding_completed': vendor.onboarding_completed,
                            'user_type': 'vendor',
                            'chat_user_id': chat_user.id,
                            'access_token': access_token  # Store for chat system
                        },
                        'access': access_token,
                        'refresh': refresh_token
                    }, status=200)
                else:
                    print("Password check failed")
                    return Response({'non_field_errors': ['Invalid credentials']}, status=400)
            except VendorAuth.DoesNotExist:
                print(f"Vendor not found with email: {email}")
                return Response({'non_field_errors': ['Invalid credentials']}, status=400)
            
        except Exception as e:
            print(f"Login exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': 'Login failed'}, status=500)

# Keep function-based view as backup
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def vendor_login(request):
    """Vendor login using existing CustomUser authentication"""
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)
        
        # Try to authenticate with username first
        user = authenticate(username=username, password=password)
        
        # If that fails, try to find user by email and authenticate
        if not user:
            try:
                user_obj = CustomUser.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except CustomUser.DoesNotExist:
                pass
        
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)
        
        if user.user_type != 'vendor':
            return Response({'error': 'Access denied. Vendor account required.'}, status=403)
        
        login(request, user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type
            },
            'redirect_url': '/vendor/dashboard'
        }, status=200)
        
    except Exception as e:
        return Response({'error': 'Login failed'}, status=500)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def vendor_profile(request):
    """Get or update vendor profile using DRF authentication"""
    try:
        print(f"Profile request - User: {request.user.email}, Type: {request.user.user_type}")
        
        if request.user.user_type != 'vendor':
            return Response({'error': 'Vendor access required'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get vendor from VendorAuth table
        try:
            vendor = VendorAuth.objects.get(email=request.user.email)
        except VendorAuth.DoesNotExist:
            return Response({'error': 'Vendor profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get or create vendor profile
        from .models import VendorProfile
        profile, created = VendorProfile.objects.get_or_create(
            user=vendor,
            defaults={'profile_data': {}}
        )
        
        if request.method == 'GET':
            return Response({
                'id': vendor.id,
                'email': vendor.email,
                'full_name': vendor.full_name,
                'mobile': vendor.mobile,
                'business': vendor.business,
                'experience_level': vendor.experience_level,
                'city': vendor.city,
                'state': vendor.state,
                'pincode': vendor.pincode,
                'location': vendor.location,
                'services': vendor.services,
                'is_verified': vendor.is_verified,
                'onboarding_completed': vendor.onboarding_completed,
                'user_type': 'vendor',
                'profile_data': profile.profile_data,
                'profile_completed': profile.is_completed
            }, status=200)
        
        elif request.method == 'PUT':
            # Update vendor profile
            data = request.data
            
            # Update VendorAuth fields
            for field in ['full_name', 'mobile', 'business', 'experience_level', 'city', 'state', 'pincode', 'location', 'services']:
                if field in data:
                    setattr(vendor, field, data[field])
            
            vendor.save()
            
            # Update VendorProfile data
            if 'profile_data' in data:
                profile.profile_data.update(data['profile_data'])
                profile.is_completed = data.get('profile_completed', profile.is_completed)
                profile.save()
            
            return Response({
                'message': 'Profile updated successfully',
                'vendor': {
                    'id': vendor.id,
                    'email': vendor.email,
                    'full_name': vendor.full_name,
                    'mobile': vendor.mobile,
                    'business': vendor.business,
                    'experience_level': vendor.experience_level,
                    'city': vendor.city,
                    'state': vendor.state,
                    'pincode': vendor.pincode,
                    'location': vendor.location,
                    'services': vendor.services,
                    'is_verified': vendor.is_verified,
                    'onboarding_completed': vendor.onboarding_completed,
                    'user_type': 'vendor',
                    'profile_data': profile.profile_data,
                    'profile_completed': profile.is_completed
                }
            }, status=200)
            
    except Exception as e:
        print(f"Profile error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': 'Profile operation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['GET'])
def vendor_dashboard_stats(request):
    """Get vendor dashboard statistics"""
    # Return mock data for now
    return Response({
        'total_revenue': 23800,
        'total_bookings': 45,
        'pending_bookings': 8,
        'in_progress_bookings': 12,
        'completed_bookings': 25
    }, status=200)

@csrf_exempt
@api_view(['POST'])
def vendor_token_refresh(request):
    """Refresh vendor JWT token"""
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token required'}, status=400)
    
    try:
        import jwt
        from django.conf import settings
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        
        # Generate new access token
        import time
        now = int(time.time())
        
        new_payload = {
            'user_id': payload['vendor_id'],  # Django expects user_id
            'vendor_id': payload['vendor_id'],
            'email': payload['email'],
            'user_type': 'vendor',
            'token_type': 'access',
            'iat': now,
            'exp': now + 3600  # 1 hour
        }
        
        access_token = jwt.encode(new_payload, settings.SECRET_KEY, algorithm='HS256')
        
        return Response({
            'access': access_token
        }, status=200)
    except:
        return Response({'error': 'Invalid refresh token'}, status=401)

@csrf_exempt
@api_view(['POST'])
def complete_onboarding(request):
    """Mark vendor onboarding as completed"""
    print(f"Complete onboarding called - Headers: {dict(request.headers)}")
    auth_header = request.headers.get('Authorization', '')
    print(f"Auth header: {auth_header}")
    
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        print(f"Token: {token[:20]}...")
        try:
            import jwt
            from django.conf import settings
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"Token payload: {payload}")
            vendor_id = payload.get('vendor_id')
            print(f"Vendor ID from token: {vendor_id}")
            
            if vendor_id:
                vendor = VendorAuth.objects.get(id=vendor_id)
                print(f"Found vendor: {vendor.full_name}, current onboarding_completed: {vendor.onboarding_completed}")
                vendor.onboarding_completed = True
                vendor.save()
                print(f"Updated onboarding_completed to: {vendor.onboarding_completed}")
                
                return Response({
                    'message': 'Onboarding completed successfully',
                    'vendor': {
                        'id': vendor.id,
                        'onboarding_completed': vendor.onboarding_completed
                    }
                }, status=200)
        except Exception as e:
            print(f"Complete onboarding error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=400)
    
    print("No valid auth header found")
    return Response({'error': 'Authentication required'}, status=401)