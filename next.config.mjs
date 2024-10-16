/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "hakffmpeswkxuaqagoix.supabase.co",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
        pathname: "/50qf9guk0eznyh1w/publicImages/_public/**",
      },
    ],
  },
};

export default nextConfig;
