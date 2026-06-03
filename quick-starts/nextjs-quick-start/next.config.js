/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };
    // wagmi v3 optional peer — not used by Web3Auth WagmiProvider (injected only)
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^accounts$/ }),
    );
    return config;
  },
};
module.exports = nextConfig
