const withMarkdoc = require("@markdoc/next.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "md"],
  async redirects() {
    return [
      {
        source: "/dapp",
        destination: "/deployer",
        permanent: false,
      },
    ];
  },
};

module.exports = withMarkdoc()(nextConfig);
