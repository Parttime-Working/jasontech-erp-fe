"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { getSidebarConfigById } from "@/lib/navigationConfig";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 獲取 dashboard 的 sidebar 配置
  const dashboardSidebarConfig = getSidebarConfigById('dashboard');

  // 如果沒有 sidebar 配置，則不顯示 sidebar
  if (!dashboardSidebarConfig) {
    return (
      <div className="flex flex-1 bg-gray-50">
        <main className="overflow-auto flex-1 transition-all duration-300">
          <div className="p-4 md:p-8 h-full">
            {children}
          </div>
        </main>
      </div>
    );
  }

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(dashboardSidebarConfig.items.length === 0);

  return (
    <div className="flex flex-1 bg-gray-50">
      <Sidebar
        title={dashboardSidebarConfig.title}
        titleIcon={dashboardSidebarConfig.titleIcon}
        items={dashboardSidebarConfig.items}
        showOnPaths={dashboardSidebarConfig.showOnPaths}
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
