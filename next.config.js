module.exports = {
  transpilePackages: [
    '@udecode/plate-core',
    '@udecode/plate-common',
    'nanoid',
  ],
  experimental: {
    esmExternals: 'loose',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },
};
