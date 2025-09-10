"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { systemManagementConfig } from "@/components/layout/SidebarConfigs";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(systemManagementConfig.items.length === 0);

  return (
    <div className="flex flex-1 bg-gray-50">
      <Sidebar
        title={systemManagementConfig.title}
        titleIcon={systemManagementConfig.titleIcon}
        items={systemManagementConfig.items}
        showOnPaths={systemManagementConfig.showOnPaths}
        collapsible={true}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <main className={`overflow-auto flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16 ml-16' : 'lg:ml-64 ml-16'}`}>
        <div className="p-4 md:p-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
