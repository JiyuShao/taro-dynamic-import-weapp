/*
 * Taro 微信小程序动态加载插件入口
 * @Author: Jiyu Shao
 * @Date: 2021-01-27 19:03:51
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-02-01 13:57:51
 */
import { IPluginContext } from '@tarojs/service';
import * as getPort from 'get-port';
import WebpackDynamicImportWeappPlugin from 'webpack-dynamic-import-weapp-plugin';
import { createServer } from './server';

const path = require('path');
const fs = require('fs');

export interface TaroPluginDynamicImportWeappOptions {
  // 指定一个子目录为动态加载的目录名称, 方便区分静态代码和动态代码, 默认 'dynamic-import'
  dynamicImportFolderName?: string;
  // 指定动态加载链接 prefix
  publicPath?: string;
  // 开发模式下启动的开发服务器端口
  port?: number;
}

export default async (
  ctx: IPluginContext,
  pluginOpts: TaroPluginDynamicImportWeappOptions
): Promise<void> => {
  const { runOpts } = ctx;

  // 插件只在 weapp 环境下生效
  if (runOpts.platform !== 'weapp') {
    return;
  }

  // 获取有效的端口
  let finalPort = pluginOpts.port;
  const tempPort = await getPort({ port: finalPort });
  if (finalPort !== tempPort) {
    // 如果没指定端口的情况下, 自动分配端口
    if (!pluginOpts.port) {
      finalPort = tempPort;
    } else {
      throw new Error(`指定的端口已被占用(${pluginOpts.port}), 请配置其他端口`);
    }
    finalPort = tempPort;
  }

  // 添加 pluginOpts 默认值
  const finalPluginOpts: Required<TaroPluginDynamicImportWeappOptions> = {
    dynamicImportFolderName: 'dynamic-import',
    publicPath: `http://127.0.0.1:${finalPort}/`,
    port: finalPort,
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

  // 编译结束
  ctx.onBuildFinish(() => {
    // 修改 packOptions.ignore
    const ignoreConfig = {
      type: 'glob',
      value: `${finalPluginOpts.dynamicImportFolderName}/**`,
    };
    try {
      const packageConfigJsonPath = path.resolve(
        ctx.paths.outputPath,
        'project.config.json'
      );
      let packageConfig = fs.readFileSync(packageConfigJsonPath, 'utf8');
      packageConfig = JSON.parse(packageConfig);
      packageConfig.packOptions = packageConfig.packOptions || {};
      packageConfig.packOptions.ignore = packageConfig.packOptions.ignore || [];
      const isIgnoreConfigAdded = packageConfig.packOptions.ignore.reduce(
        (prev, current) => {
          if (prev) {
            return true;
          }
          return JSON.stringify(current) === JSON.stringify(ignoreConfig);
        },
        false
      );
      if (!isIgnoreConfigAdded) {
        packageConfig.packOptions.ignore.push(ignoreConfig);
      }
      fs.writeFileSync(
        packageConfigJsonPath,
        JSON.stringify(packageConfig, null, 2)
      );
    } catch (err) {
      console.error(
        '修改项目配置 packOptions.ignore 失败, 开发者可自行配置',
        JSON.stringify({ packOptions: { ignore: [ignoreConfig] } }, null, 2),
        '\n',
        err
      );
    }

    // 只有在监听模式下开启 dev-server
    if (runOpts.isWatch) {
      createServer(finalPluginOpts.port, ctx.paths.outputPath);
    }
  });
};
