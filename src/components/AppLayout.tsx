
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
}

const SidebarExpander = () => {
  const { state, toggleSidebar } = useSidebar();
  
  if (state === 'expanded') return null;
  
  return (
    <Button
      onClick={toggleSidebar}
      variant="outline"
      size="icon"
      className="fixed left-2 top-4 z-50 bg-eco-green text-white hover:bg-eco-green/90 border-eco-green/30"
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Expand Sidebar</span>
    </Button>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarRail className="z-50 hover:bg-eco-green/20 after:bg-eco-green/30 after:hover:bg-eco-green" />
        <SidebarExpander />
        <SidebarInset className="p-6 pt-2 md:p-8">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
