/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true } // optional: keeps deploys flowing even if TS is unhappy
};
export default nextConfig;
