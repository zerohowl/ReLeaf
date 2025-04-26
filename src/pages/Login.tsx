
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
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
        title="Welcome back to RecycleSmart"
        description="Sign in to your account to track your recycling journey"
        footer={
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </span>
          </div>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
};

export default Login;
