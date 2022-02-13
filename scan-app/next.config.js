module.exports = {
  env: {
    NEXT_PUBLIC_SCAN_API_PROXY_ROOT:
      process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};
