import { Template, Compiler } from 'webpack';

const PLUGIN_NAME = 'DynamicImportWeappPlugin';

interface IProps {
  // 资源地址
  publicPath: string;
  // 开发模式下的配置
  devServer?: {
    // 端口
    port: number;
  };
}
export default class DynamicImportWeappPlugin {
  /**
   * 保留传入的参数
   * @type {IProps}
   * @memberof DynamicImportWeappPlugin
   */
  options: IProps;

  /**
   * devServer 是否运行
   * @memberof DynamicImportWeappPlugin
   */
  isDevServerRunning = false;

  constructor(props: IProps) {
    this.options = props;
  }

  /**
   * 接入 webpack, 并生成小程序动态加载代码
   * @param compiler
   */
  apply = (compiler: Compiler): void => {
    // TODO: webpack 5.0 可能会不兼容
    // 覆盖 mainTemplate.hooks.requireEnsure 和 mainTemplate.hooks.jsonpScript 来实现小程序内的动态加载
    compiler.hooks.afterPlugins.tap(PLUGIN_NAME, () => {
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
        const { mainTemplate } = compilation;
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
        if (mainTemplate.hooks.jsonpScript) {
          // 添加小程序请求/执行代码逻辑
          mainTemplate.hooks.jsonpScript.tap('JsonpMainTemplatePlugin', () => {
            const { chunkLoadTimeout } = mainTemplate.outputOptions;
            return Template.asString([
              `
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
                  var interpreter = new wx["eval5Interpreter"](rootContext, {
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
              })
            `,
            ]);
          });
        }

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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                mainTemplate.hooks.jsonpScript!.call('', chunk, hash),
              ]),
              '}',
            ]),
            '}',
          ]);
        });
      });
    });

    if (this.options.devServer) {
      compiler.hooks.afterEmit.tap(PLUGIN_NAME, () => {
        this.createServer(compiler.options.output?.path);
      });
    }
  };

  /**
   * 创建开发时静态资源服务器
   * @param distPath
   */
  createServer = (distPath?: string): void => {
    const { devServer } = this.options;
    if (this.isDevServerRunning || !devServer || !distPath) {
      return;
    }
    this.isDevServerRunning = true;
    require('http')
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
      .listen(devServer.port);
  };
}
