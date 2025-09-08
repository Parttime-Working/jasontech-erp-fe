import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// GET /api/roles - 獲取所有角色
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
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('獲取角色列表失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}

// POST /api/roles - 創建新角色
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('創建角色失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}
