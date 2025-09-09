import { NextRequest, NextResponse } from 'next/server';
import { withAuth, authenticatedFetch } from '@/lib/auth';

// GET /api/permissions - 獲取所有權限
export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    try {
      const response = await authenticatedFetch('/api/permissions', token);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('獲取權限列表失敗:', error);
      return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
    }
  });
}

// POST /api/permissions - 創建新權限
export async function POST(request: NextRequest) {
  return withAuth(request, async (token) => {
    try {
      const body = await request.json();

      const response = await authenticatedFetch('/api/permissions', token, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error('創建權限失敗:', error);
      return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
    }
  });
}
