
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarRail className="z-50 hover:bg-eco-green/20 after:bg-eco-green/30 after:hover:bg-eco-green after:!w-[4px]" />
        <SidebarInset className="p-6 pt-2 md:p-8">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
