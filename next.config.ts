import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${process.env.NEXT_PRIVATE_API_URL || "http://localhost:8080/api/v1"}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
