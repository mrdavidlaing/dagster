module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: "yaml-loader",
    });

    return config;
  },
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/latest",
        permanent: true,
      },
    ];
  },
  i18n: {
    locales: ["latest", "master", "0.9.20", "0.9.19", "0.9.18"],
    defaultLocale: "latest",
  },
};
