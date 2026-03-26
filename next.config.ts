import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  experimental: {
    swcPlugins: [["@lingui/swc-plugin", {}]],
  },
  webpack(config) {
    // Lingui .po loader
    config.module.rules.push({
      test: /\.po$/,
      use: { loader: "@lingui/loader" },
    })

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      "fs/promises": false,
      path: false,
    }

    return config
  },
}

export default nextConfig
