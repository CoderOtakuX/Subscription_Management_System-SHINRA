import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/dashboard", destination: "/admin/dashboard" },
      { source: "/staff", destination: "/admin/staff" },
      { source: "/discounts", destination: "/admin/discounts" },
      { source: "/taxes", destination: "/admin/taxes" },
    ];
  },
};

export default nextConfig;
