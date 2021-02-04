import DynamicImportWeappPlugin from '../src/index';

describe('DynamicImportWeappPlugin module export', () => {
  it('"DynamicImportWeappPlugin" should export class with apply', async () => {
    expect(typeof DynamicImportWeappPlugin === 'function').toBe(true);
    expect(
      new DynamicImportWeappPlugin({
        publicPath: 'publicPath',
        dynamicImportFolderPath: 'dynamicImportFolderPath',
      }).apply
    ).toBeTruthy();
  });
});
