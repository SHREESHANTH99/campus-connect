import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  reactCompiler: true,
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},
});

export default nextConfig;
