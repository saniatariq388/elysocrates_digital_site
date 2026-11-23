import { NextResponse, type NextRequest } from "next/server";

import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8001";

type AdminRouteContext = { params: Promise<{ path: string[] }> };

async function forward(request: NextRequest, context: AdminRouteContext) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await context.params;
  const search = request.nextUrl.search;
  const target = `${API_URL}/${path.join("/")}${search}`;

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.startsWith("multipart/form-data");
  const body = hasBody
    ? isMultipart
      ? await request.arrayBuffer()
      : await request.text()
    : undefined;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  if (isMultipart) {
    headers["Content-Type"] = contentType;
  } else {
    headers["Content-Type"] = "application/json";
  }

  let apiResponse: Response;
  try {
    apiResponse = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Content service is unreachable" },
      { status: 502 },
    );
  }

  if (apiResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const payload = await apiResponse.text();
  return new NextResponse(payload, {
    status: apiResponse.status,
    headers: {
      "Content-Type":
        apiResponse.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: NextRequest, context: AdminRouteContext) {
  return forward(request, context);
}

export async function POST(request: NextRequest, context: AdminRouteContext) {
  return forward(request, context);
}

export async function PUT(request: NextRequest, context: AdminRouteContext) {
  return forward(request, context);
}

export async function PATCH(request: NextRequest, context: AdminRouteContext) {
  return forward(request, context);
}

export async function DELETE(request: NextRequest, context: AdminRouteContext) {
  return forward(request, context);
}
