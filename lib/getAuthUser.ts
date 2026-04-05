import { verifyToken } from "@/lib/auth";

export type AuthUser = {
  userId: string;
  role: "student" | "shop";
};

export function getAuthUser(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
