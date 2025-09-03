import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const response = await axios.get(`${process.env.BACKEND_URL}/api/users/${params.id}`, {
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Get user by ID API error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred while fetching user" },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const body = await req.json();

    const response = await axios.put(`${process.env.BACKEND_URL}/api/users/${params.id}`, body, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Update user API error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred while updating user" },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const authorization = req.headers.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
    }

    const response = await axios.delete(`${process.env.BACKEND_URL}/api/users/${params.id}`, {
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    console.error("Delete user API error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || "An error occurred while deleting user" },
        { status: error.response?.status || 500 }
      );
    } else {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
