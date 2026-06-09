import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// エッジ実行。bcrypt/Prisma を含まない authConfig のみ使用。
export default NextAuth(authConfig).auth;

export const config = {
  // 静的アセット・API auth・画像最適化を除く全ルートを保護対象に
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.html$).*)"],
};
