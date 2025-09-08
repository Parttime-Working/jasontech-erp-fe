import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// GET /api/role-permissions/[roleId]/permissions - 獲取角色的權限
export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 這裡需要後端提供獲取角色權限的 API
    // 暫時返回空列表
    const data: any[] = [];
    return NextResponse.json(data);
  } catch (error) {
    console.error('獲取角色權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}

// POST /api/role-permissions/[roleId]/permissions - 為角色分配權限
export async function POST(
  request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const body = await request.json();
    const permissionId = body.permissionId;

    const response = await fetch(`${API_BASE_URL}/api/permissions/${permissionId}/roles/${params.roleId}`, {
      method: 'POST',
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
    console.error('分配角色權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}

// DELETE /api/role-permissions/[roleId]/permissions/[permissionId] - 移除角色權限
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roleId: string; permissionId: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/api/permissions/${params.permissionId}/roles/${params.roleId}`, {
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

    return NextResponse.json({ message: '權限已移除' });
  } catch (error) {
    console.error('移除角色權限失敗:', error);
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 });
  }
}
