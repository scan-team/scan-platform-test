module.exports = {
  env: {
    NEXT_PUBLIC_SCAN_API_PROXY_ROOT:
      process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};
