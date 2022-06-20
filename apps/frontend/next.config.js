/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/dapp",
        destination: "/dapp/deployer",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
