export const WebSocketConfig = () => ({
    host: process.env.WS_HOST || 'localhost',
    port: parseInt(process.env.WS_PORT, 10) || 3001,
  });
  