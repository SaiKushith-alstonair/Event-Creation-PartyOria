from django.urls import path
from . import views
from django.views.decorators.csrf import csrf_exempt

# Authentication endpoints without CSRF protection
urlpatterns = [
    # Public authentication endpoints (CSRF exempt)
    path('register/', csrf_exempt(views.RegisterView.as_view()), name='register'),
    path('login/', csrf_exempt(views.LoginView.as_view()), name='login'),
    
    # Protected endpoints
    path('logout/', views.logout_user, name='logout'),
    path('profile/', views.get_user_profile, name='profile'),
    path('sessions/', views.get_user_sessions, name='sessions'),
    
    # JWT token refresh (CSRF exempt)
    path('token/refresh/', csrf_exempt(views.refresh_token), name='token_refresh'),
]