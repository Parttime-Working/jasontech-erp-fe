import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // 解析請求體
    const body = await req.json();

    // 驗證輸入
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const { username, password } = body;

    // 呼叫後端 API Server，使用環境變數來避免硬編碼 URL
    const response = await axios.post(`${process.env.BACKEND_URL}/api/auth/login`, {
      username,
      password,
    });

    // 將後端 API 回應結果返回給前端
    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Authentication error:", error);

    if (axios.isAxiosError(error)) {
      // 如果是 Axios 錯誤，返回更詳細的錯誤信息
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred during authentication" },
        { status: error.response?.status || 500 }
      );
    } else {
      // 其他類型的錯誤
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
