import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * 從請求中提取 token
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // 先嘗試從 Authorization 標頭獲取 token
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 如果 Authorization 標頭沒有 token，嘗試從 cookie 獲取
  return request.cookies.get('token')?.value || null;
}

/**
 * 驗證 token 的有效性
 */
export async function verifyToken(token: string): Promise<{ valid: boolean; user?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return { valid: true, user: userData.user };
    } else {
      const errorData = await response.json().catch(() => ({ error: '驗證失敗' }));
      return { valid: false, error: errorData.error || '認證失敗' };
    }
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return { valid: false, error: '內部伺服器錯誤' };
  }
}

/**
 * 創建帶有身份驗證的 fetch 請求
 */
export async function authenticatedFetch(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
}

/**
 * 統一的身份驗證中間件函數
 * 返回 token 如果驗證成功，否則返回錯誤回應
 */
export async function withAuth(
  request: NextRequest,
  handler: (token: string, user: any) => Promise<Response>
): Promise<Response> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return new Response(
      JSON.stringify({ error: '未提供認證令牌' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  const verification = await verifyToken(token);

  if (!verification.valid) {
    return new Response(
      JSON.stringify({ error: verification.error || '認證失敗' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  return handler(token, verification.user);
}
