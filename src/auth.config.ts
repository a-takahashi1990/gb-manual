import type { NextAuthConfig } from "next-auth";

/**
 * エッジ(middleware)でも読み込める認証設定。
 * ここには bcrypt / Prisma など Node 専用モジュールを含めないこと。
 * Credentials プロバイダ本体は auth.ts 側で追加する。
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    // middleware から呼ばれる。未ログインは /login へ、ログイン済みは保護ページへ。
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/projects", nextUrl));
        }
        return true;
      }

      // それ以外（保護対象）はログイン必須
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "member";
      }
      return session;
    },
  },
  providers: [], // auth.ts で Credentials を注入
} satisfies NextAuthConfig;
