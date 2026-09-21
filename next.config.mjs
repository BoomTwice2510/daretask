/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Production builds must fail on type errors. Never ship a DApp while hiding them.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
