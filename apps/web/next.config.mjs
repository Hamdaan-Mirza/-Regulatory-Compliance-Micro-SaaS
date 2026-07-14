/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@complystack/types", "@complystack/db"],
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
  const { setupDevPlatform } = await import("@cloudflare/next-on-pages/next-dev");
  await setupDevPlatform();
}