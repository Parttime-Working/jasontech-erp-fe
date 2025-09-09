import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// GET /api/auth/verify - 驗證用戶 token 並獲取用戶資訊
export async function GET(request: NextRequest) {
  try {
    // 嘗試從 Authorization 標頭獲取 token
    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 如果 Authorization 標頭沒有 token，嘗試從 cookie 獲取
    if (!token) {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json({ error: '未提供認證令牌' }, { status: 401 });
    }

    // 呼叫後端 API 驗證 token
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '認證失敗' }));
      return NextResponse.json(errorData, { status: response.status });
    }

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}
