const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://15.165.14.7",
      changeOrigin: true,
    })
  );
  app.use(
    // "/ws-stomp",
    "/ws-edit",
    createProxyMiddleware({ target: "http://15.165.14.7", ws: true })
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
