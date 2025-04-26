import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthCard = ({ title, description, children, footer }: AuthCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-bounce-in">
      <CardHeader>
        <div className="flex items-center justify-center mb-6">

        <img
            src="/newLogo.png"        
            alt="Releaf Logo"  
            className="h-16 w-auto"  
          />


        </div>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default AuthCard;
