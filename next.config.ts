import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    localPatterns: [
      { pathname: "/placeholders/**" },
      { pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
