import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  webpack(config) {
    // Lingui .po loader
    config.module.rules.push({
      test: /\.po$/,
      use: { loader: "@lingui/loader" },
    });

    // Prevent Node.js-only deps from entering the browser bundle
    // (pulled in transitively by @lingui/babel-plugin-lingui-macro)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lingui/babel-plugin-lingui-macro": false,
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      "fs/promises": false,
      path: false,
    };

    return config;
  },
};

export default nextConfig;
