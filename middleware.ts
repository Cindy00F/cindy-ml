import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProtected(pathname: string) {
  return (
    pathname.startsWith("/essays/") ||
    pathname.startsWith("/articles/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/about")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();
  if (request.cookies.get("cindy-session")?.value) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  const next = `${pathname}${request.nextUrl.search}`;
  if (next && next !== "/login") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/essays/:path*", "/articles/:path*", "/dashboard", "/dashboard/:path*", "/about"],
};
