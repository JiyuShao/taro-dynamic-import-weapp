/*
 * 小程序动态加载 webpack 插件
 * 更改 jsonpScript 方法, 使用 eval5 + wx.request 替代
 * @Author: Jiyu Shao
 * @Date: 2021-01-30 15:22:12
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-02-04 14:10:07
 */
import { Template, Compiler, compilation } from 'webpack';
import stripIndent from 'strip-indent';

const path = require('path');

const PLUGIN_NAME = 'DynamicImportWeappPlugin';

export interface DynamicImportWeappPluginOptions {
  // 指定一个子目录为动态加载的目录绝对地址, 方便区分静态代码和动态代码
  dynamicImportFolderPath: string;
  // 指定动态加载链接 prefix
  publicPath: string;
  // 验证是否为 entry module, 用于注入全局变量到入口文件
  isEntryModule?: (module: compilation.Module) => boolean;
}

export default class DynamicImportWeappPlugin {
  /**
   * 保留传入的参数
   * @type {DynamicImportWeappPluginOptions}
   * @memberof DynamicImportWeappPlugin
   */
  options: Required<DynamicImportWeappPluginOptions>;

  constructor(props: DynamicImportWeappPluginOptions) {
    this.options = {
      isEntryModule: () => false,
      ...props,
    };
  }

  /**
   * 接入 webpack, 并生成小程序动态加载代码
   * @param compiler
   */
  apply = (compiler: Compiler): void => {
    // TODO: webpack 5.0 可能会不兼容
    // 覆盖 mainTemplate.hooks.requireEnsure 和 mainTemplate.hooks.jsonpScript 来实现小程序内的动态加载
    compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {
      compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
        const { mainTemplate } = compilation;

        // 更改动态导入输出文件目录
        compilation.hooks.afterOptimizeChunkIds.tap(PLUGIN_NAME, chunks => {
          const dynamicOutputFolderName = path.basename(
            this.options.dynamicImportFolderPath
          );
          const dynamicEntryList: Record<string, any> = [];
          chunks.forEach(currentChunk => {
            if (!currentChunk.name) {
              const currentModules = currentChunk.getModules();
              const currentEntryModule =
                currentModules[currentModules.length - 1];

              // @ts-ignore
              const currentResource = currentEntryModule.resource;
              if (
                currentResource.startsWith(this.options.dynamicImportFolderPath)
              ) {
                const currentEntryName = currentResource
                  .substring(this.options.dynamicImportFolderPath.length + 1)
                  .split('.')
                  .slice(0, -1)
                  .join('.');
                dynamicEntryList.push({
                  dynamicOutputFolderName,
                  currentEntryName,
                });
                currentChunk.name = `${dynamicOutputFolderName}/${currentEntryName}`;
                // @ts-ignore
                currentChunk.id = currentChunk.name;
                // @ts-ignore
                currentChunk.ids = [currentChunk.id];
              }
            }
          });
          if (dynamicEntryList.length !== 0) {
            console.log('\n');
            dynamicEntryList.forEach(currentEntry => {
              console.log(
                `编译  发现动态入口 ${currentEntry.dynamicOutputFolderName}/${currentEntry.currentEntryName}`
              );
            });
          }
        });

        /**
         *  向 Entry 中插入自定义的 loader, 来注入全局变量和引入所有的 components
         */
        compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (_, module) => {
          const isEntryModule = this.options.isEntryModule(module);
          if (isEntryModule) {
            const entryLoaderPath = path.resolve(
              __dirname,
              '../lib/entry-loader.js'
            );
            if (
              // @ts-ignore
              !module.loaders.some(item => item.loader === entryLoaderPath)
            ) {
              // @ts-ignore
              module.loaders.push({
                loader: entryLoaderPath,
              });
            }
          }
        });

        // 注入代码 PUPLIC_PATH
        mainTemplate.hooks.requireExtensions.tap(PLUGIN_NAME, source => {
          const newSource: string[] = [];
          newSource.push(source);
          newSource.push('');
          newSource.push(
            `__webpack_require__.p = "${this.options.publicPath}";`
          );
          return newSource.join('\n');
        });

        // 替换 jsonpScriptSrc 方法
        mainTemplate.hooks.localVars.tap(PLUGIN_NAME, source => {
          const replaceRegex = /function jsonpScriptSrc\(chunkId\) \{\n(.*)\n\}/;
          source = source.replace(
            replaceRegex,
            stripIndent(`
              var jsonpScriptSrc = function (chunkId) {
                return __webpack_require__.p + "" + chunkId + ".js"
              }
            `)
          );
          return source;
        });

        // 添加小程序请求/执行代码逻辑
        mainTemplate.hooks.jsonpScript?.tap('JsonpMainTemplatePlugin', () => {
          const { chunkLoadTimeout } = mainTemplate.outputOptions;
          return stripIndent(`
          var onScriptComplete;
          // create error before stack unwound to get useful stacktrace later
          var error = new Error();
          onScriptComplete = function (event) {
            clearTimeout(timeout);
            var chunk = installedChunks[chunkId];
            if(chunk !== 0) {
              if(chunk) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message = 'Loading chunk ' + chunkId + ' failed.n(' + errorType + ': ' + realSrc + ')';
                error.name = 'ChunkLoadError';
                error.type = errorType;
                error.request = realSrc;
                chunk[1](error);
              }
              installedChunks[chunkId] = undefined;
            }
          };
          var timeout = setTimeout(function(){
            onScriptComplete({ type: 'timeout'});
          }, ${chunkLoadTimeout});

          // 使用微信请求代码
          var failCallback = function() {
              onScriptComplete({
                type: "request:fail",
                target: {
                  src: jsonpScriptSrc(chunkId)
                }
              })
            }
          var successCallback = function(res) {
              if (res.statusCode !== 200) {
                failCallback()
                return;
              }
              try {
                var rootContext = {
                  wx,
                  console,
                  setTimeout,
                  clearTimeout,
                  setInterval,
                  clearInterval,
                }
                // 执行代码
                var interpreter = new wx["eval5"].Interpreter(rootContext, {
                  rootContext,
                });
                interpreter.evaluate(res.data)
              } catch (error) {
                console.trace(error)
              }
            }

            wx.request({
              url: jsonpScriptSrc(chunkId),
              timeout: ${chunkLoadTimeout},
              success: successCallback,
              fail: failCallback,
            })`);
        });

        // 删除 append $script 的语句
        mainTemplate.hooks.requireEnsure.tap(PLUGIN_NAME, (_, chunk, hash) => {
          return Template.asString([
            '// JSONP chunk loading for javascript',
            '',
            'var installedChunkData = installedChunks[chunkId];',
            'if(installedChunkData !== 0) { // 0 means "already installed".',
            Template.indent([
              '',
              '// a Promise means "currently loading".',
              'if(installedChunkData) {',
              Template.indent(['promises.push(installedChunkData[2]);']),
              '} else {',
              Template.indent([
                '// setup Promise in chunk cache',
                'var promise = new Promise(function(resolve, reject) {',
                Template.indent([
                  'installedChunkData = installedChunks[chunkId] = [resolve, reject];',
                ]),
                '});',
                'promises.push(installedChunkData[2] = promise);',
                '',
                '// start chunk loading',
                // @ts-ignore
                mainTemplate.hooks.jsonpScript.call('', chunk, hash),
              ]),
              '}',
            ]),
            '}',
          ]);
        });
      });
    });
  };
}
