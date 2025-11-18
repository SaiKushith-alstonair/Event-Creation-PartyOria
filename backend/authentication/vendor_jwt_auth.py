from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from vendors.models import VendorAuth

User = get_user_model()

class VendorJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that handles both regular users and vendors
    """
    
    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        Handles both regular CustomUser and VendorAuth users.
        """
        try:
            user_id = validated_token.get('user_id')
            vendor_id = validated_token.get('vendor_id')
            
            # If it's a vendor token, get or create the corresponding CustomUser
            if vendor_id:
                try:
                    vendor = VendorAuth.objects.get(id=vendor_id)
                    # Get or create corresponding CustomUser
                    user, created = User.objects.get_or_create(
                        email=vendor.email,
                        user_type='vendor',
                        defaults={
                            'username': vendor.email,
                            'password': None  # Vendors authenticate through VendorAuth
                        }
                    )
                    return user
                except VendorAuth.DoesNotExist:
                    pass
            
            # Regular user authentication
            if user_id:
                try:
                    return User.objects.get(id=user_id)
                except User.DoesNotExist:
                    pass
                    
        except (KeyError, ValueError):
            pass
            
        raise InvalidToken('No valid user found for token')