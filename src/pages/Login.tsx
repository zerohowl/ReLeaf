import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard'; // Use AuthCard for both
import LoginForm from '@/components/auth/LoginForm';
import { supabase } from '@/integrations/supabase/client';
import BackgroundImage from '@/components/BackgroundImage';

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status using Supabase
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);


  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <BackgroundImage blurred={false}>
      {/* Main container */}
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-eco-green/10 to-eco-blue/10">

        {/* Login Card */}
        <AuthCard
          title="Welcome to Re-Leaf!"
          footer={ // Footer specific to the login card
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


        <div className="mt-8 w-full max-w-md"> 
          <AuthCard title="Project Description"> 
            <p className="text-sm text-card-foreground/80 leading-relaxed mb-3"> 
              Re-Leaf is a web platform that integrates AI to promote recycling practices. Users will be able to upload images of objects to the website, where the AI model (Gemini) will analyze the photo, identify the object, determine whether it is recyclable, and suggest nearby locations where it can be properly recycled. The platform will also maintain a history of previously identified objects for each user, allowing them to track their recycling habits over time.
            </p>
            <p className="text-sm text-card-foreground/80 leading-relaxed"> 
              Additionally, users will have the option to upload videos of themselves recycling. Gemini will review these videos, assign a recycling score based on their efforts, and encourage users to maintain streaks by rewarding consistent recycling behavior.
            </p>
          </AuthCard>
        </div>

      </div>
    </BackgroundImage>
  );
};

export default Login;