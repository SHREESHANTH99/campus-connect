import withPWA from "next-pwa";

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
  reactCompiler: true,
});

export default nextConfig;
