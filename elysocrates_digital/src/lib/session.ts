import { jwtVerify } from "jose";

export const SESSION_COOKIE = "elys_session";

export async function isValidSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}
