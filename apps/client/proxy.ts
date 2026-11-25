import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)
const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(/|$)`)

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname !== "/" && !LOCALE_PREFIX.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${routing.defaultLocale}${pathname}`
    return NextResponse.redirect(url, 308)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
