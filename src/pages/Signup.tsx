
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-eco-green/10 to-eco-blue/10">
      <AuthCard
        title="Join RecycleSmart"
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
  );
};

export default Signup;
