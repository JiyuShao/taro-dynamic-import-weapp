/*
 * Taro 微信小程序动态加载插件入口
 * @Author: Jiyu Shao
 * @Date: 2021-01-27 19:03:51
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-01-30 15:29:09
 */
import WebpackDynamicImportWeappPlugin from 'webpack-dynamic-import-weapp-plugin';
import { createServer } from './server';

const path = require('path');

export interface TaroPluginDynamicImportWeappOptions {
  // 指定一个子目录为动态加载的目录名称, 方便区分静态代码和动态代码, 默认 'dynamic-import'
  dynamicImportFolderName?: string;
  // 指定动态加载链接 prefix
  publicPath?: string;
  // 开发模式下启动的开发服务器端口
  port?: number;
}

export default (
  ctx: Record<string, any>,
  pluginOpts: TaroPluginDynamicImportWeappOptions
): void => {
  const { runOpts } = ctx;

  // 插件只在 weapp 环境下生效
  if (runOpts.platform !== 'weapp') {
    return;
  }

  // 添加 pluginOpts 默认值
  const finalPluginOpts: Required<TaroPluginDynamicImportWeappOptions> = {
    dynamicImportFolderName: 'dynamic-import',
    publicPath: 'http://localhost:5000/',
    port: 5000,
    ...pluginOpts,
  };

  // 校验输入参数
  ctx.addPluginOptsSchema(joi => {
    return joi.object().keys({
      dynamicImportFolderName: joi.string(),
      port: joi.number(),
      publicPath: joi.string(),
    });
  });

  ctx.modifyWebpackChain(({ chain }) => {
    // 使用 webpack-dynamic-import-weapp-plugin 插件
    // 添加小程序动态加载插件
    chain
      .plugin('DynamicImportWeappPlugin')
      .use(WebpackDynamicImportWeappPlugin, [
        {
          dynamicImportFolderPath: path.resolve(
            ctx.paths.sourcePath,
            finalPluginOpts.dynamicImportFolderName
          ),
          publicPath: finalPluginOpts.publicPath,
        },
      ]);

    // 更改 optimization 命名方式, 防止意外更改
    chain.merge({
      optimization: {
        chunkIds: 'named',
        // 实现不更改其他代码的情况下的动态加载, 或者尝试使用 HashedModuleIdsPlugin
        moduleIds: 'named',
      },
    });
  });

  ctx.onBuildFinish(() => {
    // 只有在监听模式下开启 dev-server
    if (runOpts.isWatch) {
      createServer(finalPluginOpts.port, ctx.paths.outputPath);
    }
  });
};
