
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-eco-green/10 to-eco-blue/10 px-6 text-center">
      <div className="h-24 w-24 rounded-full eco-gradient flex items-center justify-center mb-6">
        <span className="text-white text-3xl font-bold">404</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
