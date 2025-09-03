"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Package2, LogOut, User, Settings, Home, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// 定義導航項目的類型
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requireAuth: boolean;
  roles?: string[]; // 未來可以加入角色控制
}

// 導航項目配置
const navItems: NavItem[] = [
  {
    href: "/",
    label: "首頁",
    icon: Home,
    requireAuth: false,
  },
  {
    href: "/dashboard",
    label: "主控台",
    icon: BarChart3,
    requireAuth: true,
  },
  {
    href: "/dashboard/account-management",
    label: "帳號管理",
    icon: Users,
    requireAuth: true,
    roles: ["admin"], // 未來可以用來限制權限
  },
  // 未來可以擴展更多功能
  // {
  //   href: "/inventory",
  //   label: "庫存管理",
  //   icon: Package,
  //   requireAuth: true,
  // },
  // {
  //   href: "/reports",
  //   label: "報表",
  //   icon: FileText,
  //   requireAuth: true,
  // },
];

// 用戶相關的動態組件（僅在客戶端渲染）
function UserActions() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    // 確保只在客戶端執行
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // 這裡可以解析 JWT token 獲取用戶資訊
    if (token) {
      // 暫時設定假資料，未來可以從 token 解析
      setUserInfo({ username: "admin", role: "admin" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // 清除 cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
    setUserInfo(null);
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-4 ml-auto">
      {isAuthenticated ? (
        <>
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            <span>{userInfo?.username}</span>
          </div>

          {/* Settings (未來功能) */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">登出</span>
          </Button>
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
  const [userInfo, setUserInfo] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      setUserInfo({ username: "admin", role: "admin" });
    }
  }, []);

  // 過濾導航項目
  const visibleNavItems = navItems.filter(item => {
    // 如果需要認證但用戶未登入，不顯示
    if (item.requireAuth && !isAuthenticated) return false;

    // 如果有角色限制，檢查用戶角色（未來功能）
    if (item.roles && userInfo && !item.roles.includes(userInfo.role)) {
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
