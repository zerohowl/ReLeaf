import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';

const Signup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Check if user is coming from login page (has fromLogin param)
  const fromLogin = new URLSearchParams(location.search).get('fromLogin') === 'true';

  useEffect(() => {
    // Check if user is authenticated, but skip this check if coming from login
    if (!fromLogin) {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    }
  }, [fromLogin]);

  useEffect(() => {
    if (isAuthenticated && !fromLogin) {
      // Only redirect to dashboard if authenticated and not coming from login
      setTimeout(() => navigate('/dashboard', { replace: true }), 250);
    }
  }, [isAuthenticated, fromLogin, navigate]);

  if (isAuthenticated) return null;

  return (
    <PageTransition>
      <BackgroundImage>
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>

        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <AuthCard
            title="Join Releaf"
            description="Create an account to start your recycling journey"
            footer={
              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Log in
                  </Link>
                </span>
              </div>
            }
          >
            <SignupForm />
          </AuthCard>
        </div>
      </BackgroundImage>
    </PageTransition>
  );
};

export default Signup;
