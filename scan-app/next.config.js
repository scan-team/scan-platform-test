/* 
=================================================================================================
 Project: SCAN - Searching Chemical Actions and Networks
          Hokkaido University (2021)
          Last Update: Q2 2023
________________________________________________________________________________________________
 Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
          Jun Fujima (Former Lead Developer) [2021]
________________________________________________________________________________________________
 Description: This is the NEXT Config file for server side build for some more advanced Next 
              features.
------------------------------------------------------------------------------------------------
 Notes: 
------------------------------------------------------------------------------------------------
 References: 
=================================================================================================
*/

module.exports = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_SCAN_API_PROXY_ROOT: process.env.NEXT_PUBLIC_SCAN_API_PROXY_ROOT,
    SCAN_API_ROOT: process.env.SCAN_API_ROOT,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
};
