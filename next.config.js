/** @type {import('next').NextConfig} */
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Cross-Origin-Opener-Policy",
  //           value: "same-origin", // "same-origin-allow-popups"
  //         },
  //       ],
  //     },
  //   ];
  // },
  images: {
    // domains: ["firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/figma-to-code-80e67.appspot.com/**",
      },
    ],
  },
};

module.exports = nextConfig;
