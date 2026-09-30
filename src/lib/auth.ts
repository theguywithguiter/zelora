import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const AUTH_COOKIE = "zelora_session";
export const ADMIN_AUTH_COOKIE = "zelora_admin_session";

type SessionPayload = JWTPayload & {
  userId: number;
  email: string;
  name: string;
  role: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set in .env and contain at least 32 characters."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(
  payload: Omit<SessionPayload, "iat" | "exp">
) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return token;
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;

    if (!token) return false;

    const { payload } = await jwtVerify(token, getSecret());

    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_AUTH_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
