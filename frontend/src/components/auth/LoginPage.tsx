import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import RegistrationTypeModal from "../RegistrationTypeModal";
import { useAuthStore } from "../../stores/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'vendor' | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use appropriate endpoint based on user type
      const endpoint = userType === 'vendor' 
        ? 'http://localhost:8000/api/vendor/auth/login/'
        : 'http://localhost:8000/api/auth/login/';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: email,  // Backend expects username field
          password: password
        })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        alert('Server error. Please try again.');
        return;
      }
      
      if (!response.ok) {
        console.error('Login failed:', response.status, data);
        console.log('Full error response:', data);
        console.log('Error details:', JSON.stringify(data, null, 2));
        const errorMsg = data.error || data.non_field_errors?.[0] || data.detail || 'Login failed';
        alert(`Login failed: ${errorMsg}`);
        return;
      }
      
      // Clear any existing auth data first
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('partyoria_user');
      localStorage.removeItem('vendor_profile');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('partyoria_user');
      
      // Handle JWT-based authentication for both customer and vendor
      if (userType === 'vendor' && data.vendor && data.access) {
        // Vendor JWT login - store tokens and user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('vendor_profile', JSON.stringify(data.vendor));
        localStorage.setItem('vendorOnboarding', JSON.stringify(data.vendor));
        
        // Update auth store for RouteGuard using proper Zustand setState
        const { useAuthStore } = await import('../../stores/authStore');
        useAuthStore.setState({
          user: {
            id: data.vendor.id,
            email: data.vendor.email,
            username: data.vendor.email,
            first_name: data.vendor.full_name,
            last_name: '',
            user_type: 'vendor'
          },
          tokens: {
            access: data.access,
            refresh: data.refresh
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        console.log('Vendor login successful:', data.vendor);
        
        // Route based on onboarding status
        if (data.vendor.onboarding_completed) {
          window.location.href = '/vendor/dashboard';
        } else {
          window.location.href = '/vendor/onboarding';
        }
      } else if (data.user && data.access) {
        // Customer JWT login - store tokens in both storages
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('partyoria_user', JSON.stringify(data.user));
        
        const { setAuthData } = await import('../../utils/auth');
        setAuthData(data.user);
        
        // Update auth store
        const { useAuthStore } = await import('../../stores/authStore');
        useAuthStore.setState({
          user: {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            user_type: 'customer'
          },
          tokens: {
            access: data.access,
            refresh: data.refresh
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        console.log('Customer login successful:', data.user);
        // Use navigate instead of window.location.href to maintain React state
        setTimeout(() => navigate('/dashboard', { replace: true }), 100);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message || 'Please check your credentials.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 relative">
          <Button 
            variant="ghost" 
            className="absolute top-0 right-0 hover:bg-transparent bg-transparent text-black" 
            size="icon" 
            onClick={() => navigate("/")}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
          <CardTitle className="text-2xl font-bold text-center font-heading">Log In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userType ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600">Select your account type</p>
              <div className="space-y-3">
                <Button
                  onClick={() => setUserType('customer')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Login as Customer
                </Button>
                <Button
                  onClick={() => setUserType('vendor')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Login as Vendor
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {userType === 'vendor' ? 'Vendor Login' : 'Customer Login'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setUserType(null)}
                  className="text-sm"
                >
                  Change
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent bg-transparent text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </Button>
              </div>
              <div className="flex justify-end">
                <a className="text-sm text-purple-600 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>
            </div>
            
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a onClick={() => setShowRegistrationModal(true)} className="text-purple-600 hover:underline cursor-pointer">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
      
      <RegistrationTypeModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSelectCustomer={() => {
          setShowRegistrationModal(false);
          navigate('/signup');
        }}
        onSelectVendor={() => {
          setShowRegistrationModal(false);
          navigate('/signup?type=vendor');
        }}
      />
    </div>
  );
}