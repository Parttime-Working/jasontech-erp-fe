import { NextRequest, NextResponse } from "next/server";
import { withAuth, authenticatedFetch } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (token) => {
    try {
      const response = await authenticatedFetch(`/api/users/${params.id}`, token);

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("獲取使用者失敗:", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (token) => {
    try {
      const body = await request.json();

      const response = await authenticatedFetch(`/api/users/${params.id}`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("更新使用者失敗:", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (token) => {
    try {
      const response = await authenticatedFetch(`/api/users/${params.id}`, token, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("刪除使用者失敗:", error);
      return NextResponse.json({ error: "內部伺服器錯誤" }, { status: 500 });
    }
  });
}
