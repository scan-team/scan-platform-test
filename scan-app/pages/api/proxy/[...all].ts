import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import httpProxyMiddleware from 'next-http-proxy-middleware';

// if the api needs multipart/form-data like file uploading, set bodyParser: false.
export const config = {
  api: {
    // bodyParser: false,
    externalResolver: true,
  },
};

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);

    return httpProxyMiddleware(req, res, {
      // You can use the `http-proxy` option
      target: process.env.SCAN_API_ROOT,
      // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
      pathRewrite: [
        {
          patternStr: '^/api/proxy',
          replaceStr: '',
        },
      ],
      // headers: {
      //   authorization: `Bearer ${session?.idToken}`,
      // },
    });
  }
);
