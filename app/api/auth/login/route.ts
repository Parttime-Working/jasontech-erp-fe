import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // 解析請求體
    const body = await req.json();
    console.log(body);
    const { username, password } = body;

    // 呼叫後端 API Server
    const response = await axios.post("http://app:8000/auth/login", {
      username,
      password,
    });

    // 將後端 API 回應結果返回給前端
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    // 處理後端 API 的錯誤
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
