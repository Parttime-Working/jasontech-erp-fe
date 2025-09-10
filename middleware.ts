import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getProtectedPaths } from '@/lib/navigationConfig';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    const protectedPaths = getProtectedPaths();

    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
        // 未來加 JWT 驗證，但現在簡單就好
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
