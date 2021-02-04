import path from 'path';
import { Compiler, Stats } from 'webpack';

export default (compiler: Compiler, stats: Stats, asset: string) => {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;
  let data = '';

  try {
    // @ts-ignore
    data = usedFs.readFileSync(path.join(outputPath, asset)).toString();
  } catch (error) {
    data = error.toString();
  }

  return data;
};
