import { NextRequest, NextResponse } from "next/server";
import { withAuth, authenticatedFetch } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return withAuth(request, async (token) => {
    try {
      const response = await authenticatedFetch('/api/users/', token);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("獲取使用者列表失敗:", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (token) => {
    try {
      const body = await request.json();

      const response = await authenticatedFetch('/api/users/', token, {
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
      console.error("創建使用者失敗:", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  });
}
