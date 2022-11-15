import { IncomingMessage, ServerResponse } from "http";

import express from "express";
import {
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { getPortPromise } from "portfinder";

export async function createProxyServer() {
  const port = await getPortPromise();

  const server = express();

  server.use(
    "/",
    createProxyMiddleware({
      target: "https://weread.qq.com",
      changeOrigin: true,
      secure: false,
      selfHandleResponse: true,
      onProxyRes: responseInterceptor(
        async (
          responseBuffer: Buffer,
          proxyRes: IncomingMessage,
          req: IncomingMessage,
          res: ServerResponse,
        ) => {
          // 解决跨域问题
          delete proxyRes.headers["x-frame-options"];
          delete proxyRes.headers["Content-Security-Policy"];
          proxyRes.headers["Access-Control-Allow-Origin"] = "*";

          // 解决跨站问题
          if (proxyRes.headers["set-cookie"]) {
            res.setHeader(
              "set-cookie",
              proxyRes.headers["set-cookie"].map((cookie) =>
                cookie.replace(
                  "Domain=.weread.qq.com;",
                  "Domain=localhost;secure;SameSite=None;",
                ),
              ),
            );
          }

          return responseBuffer;
        },
      ),
    }),
  );

  return {
    server: server.listen(port),
    port: port,
  };
}
