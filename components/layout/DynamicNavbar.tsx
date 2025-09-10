"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Package2, LogOut, User, Settings, Home, Users, BarChart3, Shield, Package, ShoppingCart, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getNavItems } from "@/lib/navigationConfig";

// Icon 映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  BarChart3,
  Settings,
  Users,
  Shield,
  Package,
  ShoppingCart,
  FileText,
  TrendingUp,
};

// 定義導航項目的類型
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requireAuth: boolean;
  roles?: string[];
}

// 從統一配置生成導航項目
const generateNavItems = (): NavItem[] => {
  const configItems = getNavItems();
  return configItems.map(item => ({
    href: item.href,
    label: item.label,
    icon: iconMap[item.icon] || Settings, // 預設使用 Settings icon
    requireAuth: item.requireAuth,
    roles: item.roles,
  }));
};

// 動態生成導航項目
const navItems: NavItem[] = generateNavItems();

// 使用者相關的動態組件（僅在客戶端渲染）
function UserActions() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; level: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // 確保只在客戶端執行
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // 這裡可以解析 JWT token 獲取使用者資訊
    if (token) {
      // 暫時設定假資料，未來可以從 token 解析
      setUserInfo({ username: "admin", level: "admin" });
    }
  }, []);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleSystemManagement = () => {
    router.push('/settings/account-management');
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // 清除 cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    setUserInfo(null);
    setIsSettingsOpen(false);
    router.push('/login');
  };

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isSettingsOpen]);

  return (
    <div className="flex items-center gap-4 ml-auto">
      {isAuthenticated ? (
        <>
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span>{userInfo?.username}</span>
          </div>

          {/* Settings with dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Settings dropdown */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border-2 border-gray-200 bg-white p-2 text-gray-900 shadow-lg">
                <button
                  onClick={handleSystemManagement}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  系統管理
                </button>
                <div className="my-1 h-px bg-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  登出
                </button>
              </div>
            )}
          </div>


        </>
      ) : (
        <Link href="/login">
          <Button size="sm">登入</Button>
        </Link>
      )}
    </div>
  );
}

// 導航組件（包含認證相關的項目過濾）
function NavigationItems() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; level: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      setUserInfo({ username: "admin", level: "admin" });
    }
  }, []);

  // 過濾導航項目
  const visibleNavItems = navItems.filter(item => {
    // 如果需要認證但使用者未登入，不顯示
    if (item.requireAuth && !isAuthenticated) return false;

    // 如果有角色限制，檢查使用者角色（未來功能）
    if (item.roles && userInfo && !item.roles.includes(userInfo.level)) {
      return false;
    }

    return true;
  });

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 flex-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 transition-colors hover:text-foreground",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span>JasonTech ERP</span>
            </Link>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 hover:text-foreground",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function DynamicNavbar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果在登入頁面，不顯示 Navbar
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="hidden sm:inline">JasonTech ERP</span>
        </Link>
      </div>

      {/* Navigation Items */}
      {isClient && <NavigationItems />}

      {/* User Actions */}
      {isClient && <UserActions />}
    </header>
  );
}
