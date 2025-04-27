import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';
import PageTransition from '@/components/PageTransition';
import BackgroundImage from '@/components/BackgroundImage';

const Signup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => navigate('/', { replace: true }), 250);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return null;

  return (
    <PageTransition>
      <BackgroundImage>
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
