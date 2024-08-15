// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

// next.config.mjs
// export default {
//   reactStrictMode: true,
//   webpack: (config, { dev, isServer }) => {
//     // You can add other webpack configurations here if needed
//     return config;
//   },
// };

// next.config.mjs
// export default {
//   reactStrictMode: true,
//   webpack: (config, { dev, isServer }) => {
//     // Ensure hot reloading is enabled without ESLint
//     return config;
//   },
// };
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
