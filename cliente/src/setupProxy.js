const {createProxyMiddleware} = require('http-proxy-middleware');

const target = process.env.REACT_APP_MODE == 'PRODUCTION' ?
  'http://servidor:8080' :
  'http://localhost:8080';

module.exports = function(app) {
  app.use(
      '/api/',
      createProxyMiddleware({
        target: target,
        // changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api/': '',
        },
        // onProxyReq: (proxyReq, req, res) => {
        //   proxyReq.setHeader('host', 'localhost:8080');
        // },
      }),
  );
};
