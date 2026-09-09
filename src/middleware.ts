import authConfig from "@/auth.config";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// dedicated domains that 301 to the GPT-6 Astra subpage on the main site,
// so search ranking and link equity accrue to findryai.com
const landingHosts = new Set([
  "gpt-6.findryai.com",
  "gpt-6-astra.findryai.com",
  "astra.findryai.com",
]);

/**
 * https://www.youtube.com/watch?v=1MTyCvS05V4
 * Next Auth V5 - Advanced Guide (2024)
 */
const { auth } = NextAuth(authConfig);

const authHandler = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // redirect to dashboard if logged in and on auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // redirect to login if not logged in and on protected routes
  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return NextResponse.next();
});

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // dedicated GPT-6 Astra domains permanently redirect to the subpage on the
  // main site (301 keeps ranking signals consolidating on findryai.com)
  const host = req.headers.get("host")?.toLowerCase();
  if (host && landingHosts.has(host) && !nextUrl.pathname.startsWith("/api")) {
    const target = new URL("/gpt-6-astra", siteConfig.url);
    target.search = nextUrl.search;
    return NextResponse.redirect(target, 301);
  }

  if (nextUrl.pathname === "/" && nextUrl.searchParams.has("page")) {
    const firstPageUrl = nextUrl.clone();
    firstPageUrl.searchParams.delete("page");
    return Response.redirect(firstPageUrl, 308);
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route}$`).test(nextUrl.pathname),
  );

  // For public routes (excluding auth pages), bypass NextAuth session handlers completely
  // so response headers remain purely static and cacheable on Vercel/Cloudflare Edge CDN.
  if (isPublicRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Delegate authentication & protection to authHandler for auth and protected routes
  // @ts-expect-error NextAuth v5 middleware type integration
  return authHandler(req);
}

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
