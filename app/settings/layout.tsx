import { Sidebar } from "@/components/layout/Sidebar";
import { systemManagementConfig } from "@/components/layout/SidebarConfigs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 bg-gray-50">
      <Sidebar {...systemManagementConfig} collapsible={true} defaultCollapsed={false} />
      <main className="overflow-auto flex-1 transition-all duration-300 lg:ml-64 ml-16">
        <div className="p-4 md:p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
