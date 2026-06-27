import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["dev.lostinvirtual.world", "43.133.55.157"],
  devIndicators: false,
};

export default nextConfig;
