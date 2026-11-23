import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8001";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  let apiResponse: Response;
  try {
    apiResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Auth service is unreachable" },
      { status: 502 },
    );
  }

  if (!apiResponse.ok) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const data = (await apiResponse.json()) as { access_token?: string };
  if (!data.access_token) {
    return NextResponse.json(
      { error: "Auth service returned no token" },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
