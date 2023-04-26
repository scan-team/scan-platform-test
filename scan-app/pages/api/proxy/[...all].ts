//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//          Hokkaido University (2021)
//          Last Update: Q2 2023
//________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2022-]
//          Jun Fujima (Former Lead Developer) [2021]
//________________________________________________________________________________________________
// Description: This is the auth0 re-routes API handler managed by next to make sure the user is 
//              properly logged in.
//------------------------------------------------------------------------------------------------
// Notes: 
//------------------------------------------------------------------------------------------------
// References: nextjs and auth0 
//================================================================================================

//------------------------------------------------------------------------------------------------
// Load required libraries
//------------------------------------------------------------------------------------------------
import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import httpProxyMiddleware from 'next-http-proxy-middleware';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()

//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Global Next API Route Config
//------------------------------------------------------------------------------------------------
export const config = {
  api: {
    externalResolver: true,
  },
};
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// With API Auth Required
//------------------------------------------------------------------------------------------------
export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);

    return httpProxyMiddleware(req, res, {
      target: publicRuntimeConfig.SCAN_API_ROOT,
      pathRewrite: [
        {
          patternStr: '^/api/proxy',
          replaceStr: '',
        },
      ],
    });
  }
);
//------------------------------------------------------------------------------------------------
