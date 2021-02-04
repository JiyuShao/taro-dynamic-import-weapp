import path from 'path';
import getCompiler from './helpers/getCompiler';
import compile from './helpers/compile';
import getPlugins, { isEntryModule } from './helpers/getPlugins';
import readAssets from './helpers/readAssets';
import getModuleSource from './helpers/getModuleSource';

describe('DynamicImportWeappPlugin options', () => {
  it('"publicPath" should override __webpack_require__.p', async () => {
    const publicPath = 'https://fake.com/';
    const compiler = getCompiler('./index.js', {
      plugins: getPlugins({
        publicPath,
        dynamicImportFolderPath: path.resolve(
          __dirname,
          './fixtures/dynamic-import'
        ),
      }),
    });
    const stats = await compile(compiler);
    const assets = readAssets(compiler, stats);

    expect(assets['index.js']).toBeTruthy();
    expect(assets['dynamic-import/async-add.js']).toBeTruthy();
    expect(
      assets['runtime.js'].includes(`__webpack_require__.p = "${publicPath}";`)
    ).toBe(true);
  });

  it('"invalid dynamicImportFolderPath" should output wrong assets', async () => {
    const publicPath = 'https://fake.com/';
    const compiler = getCompiler('./index.js', {
      plugins: getPlugins({
        publicPath,
        dynamicImportFolderPath: path.resolve(
          __dirname,
          './fixtures/wrong-dynamic-import'
        ),
      }),
    });
    const stats = await compile(compiler);
    const assets = readAssets(compiler, stats);

    expect(assets['index.js']).toBeTruthy();
    expect(assets['dynamic-import/async-add.js']).toBeFalsy();
    expect(
      assets['runtime.js'].includes(`__webpack_require__.p = "${publicPath}";`)
    ).toBe(true);
  });

  it('"isEntryModule" should work', async () => {
    const publicPath = 'https://fake.com/';
    const compiler = getCompiler('./index.js', {
      plugins: getPlugins({
        publicPath,
        dynamicImportFolderPath: path.resolve(
          __dirname,
          './fixtures/dynamic-import'
        ),
        isEntryModule,
      }),
    });
    const stats = await compile(compiler);
    const indexModuleSource = getModuleSource(stats, 'fixtures/index.js');

    expect(indexModuleSource).toMatchSnapshot();
  });
});
