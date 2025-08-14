"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 確保只在客戶端執行
    setIsClient(true);

    const token = localStorage.getItem('token');
    if (token) {
      // 如果已登入，跳轉到 dashboard
      router.push('/dashboard');
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [router]);

  // 在客戶端 hydration 完成前，顯示載入狀態
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8" style={{ fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif' }}>
      <main className="flex flex-col gap-8 items-center text-center max-w-md">
        <div>
          <h1 className="text-4xl font-bold mb-4">JasonTech ERP 系統</h1>
          <p className="text-lg text-muted-foreground mb-8">企業資源規劃管理系統</p>
        </div>

        <div className="w-full">
          <Link href="/login" className="w-full">
            <Button
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              登入系統
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
