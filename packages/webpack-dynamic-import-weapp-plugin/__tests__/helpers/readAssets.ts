import { Compiler, Stats } from 'webpack';
import readAsset from './readAsset';

export default function readAssets(compiler: Compiler, stats: Stats) {
  const assets = {};

  Object.keys(stats.compilation.assets).forEach(asset => {
    assets[asset] = readAsset(compiler, stats, asset);
  });

  return assets;
}
