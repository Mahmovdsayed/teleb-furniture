import path from "node:path"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  reactCompiler: true,
  transpilePackages: ["@teleb/api-client", "@teleb/types", "@teleb/ui", "@teleb/utils", "@teleb/validations"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp"],
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  experimental: {
    turbopackRustReactCompiler: true,
    agentFeedback: true,
    turbopackGc: true,
    turbopackLazyDynamicImports: true,
  },
  cacheComponents: true,
  compiler: {
    removeConsole: true,
  },
  partialPrefetching: true,
  turbopack: {
    root: path.resolve(process.cwd(), "..", ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")
export default withNextIntl(nextConfig)
