import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 在這裡添加您的 middleware 邏輯
  // 例如：身份驗證檢查、重定向等

  // 目前只是簡單地繼續請求
  return NextResponse.next();
}

// 配置 middleware 應該在哪些路徑上運行
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
