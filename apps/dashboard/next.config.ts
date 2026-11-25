import path from "node:path"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  cacheComponents: true,
  partialPrefetching: true,
  // apps/dashboard is its own Git repository inside the monorepo — see apps/client.
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
  },
  reactCompiler: true,
  transpilePackages: ["@teleb/api-client", "@teleb/types", "@teleb/ui", "@teleb/utils", "@teleb/validations"],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  experimental: {
    turbopackGc: true,
    turbopackLazyDynamicImports: true,
    turbopackRustReactCompiler: true,
  },
  compiler: {
    removeConsole: true,
  },
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(nextConfig)
