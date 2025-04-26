
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, description, className, trend }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <div
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    trend.isPositive
                      ? "bg-eco-green/20 text-eco-green"
                      : "bg-destructive/20 text-destructive"
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </div>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-primary/10 rounded-md">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
