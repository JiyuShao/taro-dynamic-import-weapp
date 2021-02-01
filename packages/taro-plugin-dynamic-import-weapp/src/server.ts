/*
 * 开发时创建静态资源服务器
 * @Author: Jiyu Shao
 * @Date: 2021-01-30 15:29:13
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-02-01 14:05:23
 */
const http = require('http');

/**
 * 创建开发时静态资源服务器
 * @param {number} port 静态资源服务器端口
 * @param {string} distPath 静态资源所在目录绝对路径
 */
let isDevServerRunning = false;
export const createServer = (port: number, distPath: string): void => {
  const isParamsValid = port && distPath;
  if (isDevServerRunning || !isParamsValid) {
    if (!isParamsValid) {
      console.error('createServer 失败: 参数不正确');
    }
    return;
  }
  isDevServerRunning = true;
  http
    .createServer((req, res) => {
      require('fs').readFile(distPath + req.url, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });
    })
    .listen(port, () => {
      console.log(`动态加载开发服务器已启动, 地址: http://127.0.0.1:${port}`);
    });
};
