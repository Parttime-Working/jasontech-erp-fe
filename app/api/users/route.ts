import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    // 從請求標頭獲取 Authorization
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    // 呼叫後端 API Server，使用 Docker 內部網路
    const response = await axios.get(`${process.env.BACKEND_URL}/api/users/`, {
      headers: {
        Authorization: authorization,
      },
    });

    // 將後端 API 回應結果返回給前端
    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Users API error:", error);

    if (axios.isAxiosError(error)) {
      // 如果是 Axios 錯誤，返回更詳細的錯誤信息
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred while fetching users" },
        { status: error.response?.status || 500 }
      );
    } else {
      // 其他類型的錯誤
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const body = await req.json();

    const response = await axios.post(`${process.env.BACKEND_URL}/api/users/`, body, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Create user API error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred while creating user" },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
