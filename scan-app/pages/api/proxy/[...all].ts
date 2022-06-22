//================================================================================================
// Project: SCAN - Searching Chemical Actions and Networks
//                 Hokkaido University (2021)
//________________________________________________________________________________________________
// Authors: Jun Fujima (Former Lead Developer) [2021]
//          Mikael Nicander Kuwahara (Current Lead Developer) [2022-]
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
      target: process.env.SCAN_API_ROOT,
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
