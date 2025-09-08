import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// GET /api/permissions/[id] - 獲取特定權限
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`${API_BASE_URL}/api/permissions/${params.id}`, {
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
    console.error('獲取權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}

// PUT /api/permissions/[id] - 更新權限
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`${API_BASE_URL}/api/permissions/${params.id}`, {
      method: 'PUT',
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('更新權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}

// DELETE /api/permissions/[id] - 刪除權限
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`${API_BASE_URL}/api/permissions/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    return NextResponse.json({ message: '權限已刪除' });
  } catch (error) {
    console.error('刪除權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}
