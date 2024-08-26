const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

// Determine the target URL for the proxy based on environment variables
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:26417';

// Define the paths that should be proxied to the target server
const context = [
  "/api/user",
  "api/user",
];

module.exports = function (app) {
  // Create a proxy middleware for the specified context (routes)
  const appProxy = createProxyMiddleware(context, {
    target: target,  // The target server to which requests should be proxied
    secure: false,   // Disable SSL verification 
    changeOrigin: true,  // Update the origin of the host header to the target URL
    headers: {
      Connection: 'Keep-Alive'  // Keep the connection alive for multiple requests
    }
  });

  // Use the proxy middleware in the application
  app.use(appProxy);
};
