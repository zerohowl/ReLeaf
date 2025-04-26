
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock user database
const MOCK_USERS = [
  { email: 'user@example.com', password: 'password123', name: 'Demo User' },
  { email: 'admin@recyclesmart.com', password: 'admin123', name: 'Admin User' }
];

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Find matching user in our mock database
    const user = MOCK_USERS.find(
      user => user.email === email && user.password === password
    );
    
    setTimeout(async () => {
      if (user) {
        // Valid login
        localStorage.setItem('user', JSON.stringify({ email, name: user.name }));
        
        // Also set up Supabase session for proper auth state management
        try {
          // This is just for demonstration, using a fake JWT since we're not doing real auth
          // In a real app, this would be handled by Supabase's real authentication
          const fakeSession = { 
            access_token: 'fake-jwt-token',
            refresh_token: 'fake-refresh-token',
            expires_in: 3600,
            user: { id: '123', email, name: user.name }
          };
          
          // Set auth cookie for Supabase
          await supabase.auth.setSession(fakeSession);
          
          setIsLoading(false);
          toast({
            title: "Login successful!",
            description: "Welcome back to RecycleSmart.",
          });
          
          navigate('/');
        } catch (error) {
          console.error("Error setting Supabase session:", error);
          setIsLoading(false);
          setError('Authentication error. Please try again.');
        }
      } else {
        // Invalid login
        setIsLoading(false);
        setError('Invalid email or password. Please try again.');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password.",
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Demo credentials:</p>
        <p>Email: user@example.com</p>
        <p>Password: password123</p>
      </div>
    </form>
  );
};

export default LoginForm;
