import authConfig from "@/auth.config";
import { siteConfig } from "@/config/site";
import { landingHosts } from "@/lib/landing-hosts";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

/**
 * https://www.youtube.com/watch?v=1MTyCvS05V4
 * Next Auth V5 - Advanced Guide (2024)
 */
const { auth } = NextAuth(authConfig);

// since we have put role in user session, so we can know the role of the user
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // dedicated GPT-6 Astra domains serve the landing page at the root, and send
  // every other page navigation (navbar, footer, etc.) back to the main site
  const host = req.headers.get("host")?.toLowerCase();
  if (host && landingHosts.has(host)) {
    const { pathname, search } = nextUrl;
    if (pathname === "/" || pathname.startsWith("/gpt-6-astra")) {
      return NextResponse.rewrite(new URL("/gpt-6-astra", nextUrl));
    }
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(
        new URL(`${siteConfig.url}${pathname}${search}`),
        307,
      );
    }
  }

  if (nextUrl.pathname === "/" && nextUrl.searchParams.has("page")) {
    const firstPageUrl = nextUrl.clone();
    firstPageUrl.searchParams.delete("page");
    return Response.redirect(firstPageUrl, 308);
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.some((route) =>
    new RegExp(`^${route}$`).test(nextUrl.pathname),
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // do nothing if on api auth routes
  if (isApiAuthRoute) {
    return null;
  }

  // redirect to dashboard if logged in and on auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log("middleware, redirecting to dashboard");
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // redirect to login if not logged in and not on public routes
  // https://github.com/javayhu/nextjs-14-auth-v5-tutorial/blob/main/middleware.ts#L32
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return null;
});

// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// https://clerk.com/docs/references/nextjs/auth-middleware#usage
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
