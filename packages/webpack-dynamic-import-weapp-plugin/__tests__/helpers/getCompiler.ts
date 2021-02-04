import path from 'path';

import webpack, { Configuration } from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture: string, config: Configuration = {}) => {
  const { plugins = [], ...restConfig } = config;
  const fullConfig: Configuration = {
    mode: 'development',
    entry: {
      index: path.resolve(__dirname, '../fixtures', fixture),
    },
    output: {
      path: path.resolve(__dirname, '../outputs'),
    },
    plugins: [...plugins],
    optimization: {
      minimize: false,
      chunkIds: 'named',
      moduleIds: 'named',
      runtimeChunk: {
        name: 'runtime',
      },
    },
    ...restConfig,
  };

  const compiler = webpack(fullConfig);

  // @ts-ignore
  if (!config.outputFileSystem) {
    const outputFileSystem = createFsFromVolume(new Volume());
    // @ts-ignore
    // Todo remove when we drop webpack@4 support
    outputFileSystem.join = path.join.bind(path);
    // @ts-ignore
    compiler.outputFileSystem = outputFileSystem;
  }

  return compiler;
};
