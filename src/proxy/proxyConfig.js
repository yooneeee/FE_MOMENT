const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL,
      changeOrigin: true,
    })
  );
  app.use(
    // "/ws-stomp",
    "/ws-edit",
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL,
      ws: true,
    })
  );
};

// const apiProxy = createProxyMiddleware({
//     target: "REACT_APP_SERVER_URL",
//     changeOrigin: true,
//   });

//   const wsProxy = createProxyMiddleware({
//     target: "REACT_APP_SERVER_URL",
//     ws: true,
//   });

//   module.exports = {
//     apiProxy,
//     wsProxy,
//   };
