import { Plugin, Compiler } from 'webpack';
import SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency';
import NormalModule from 'webpack/lib/NormalModule';
import DynamicImportWeappPlugin, {
  DynamicImportWeappPluginOptions,
} from '../../src/index';

const ENTRY_MINI_TYPE = 'ENTRY';

class EntryNormalModule extends NormalModule {
  miniType: string;

  constructor(data) {
    super(data);
    this.miniType = data.miniType;
  }
}

class FakeTaroEntryPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'FakeTaroEntryPlugin',
      (_, { normalModuleFactory }) => {
        normalModuleFactory.hooks.createModule.tap(
          'FakeTaroEntryPlugin',
          data => {
            const dependency = data.dependencies[0];
            if (dependency.constructor === SingleEntryDependency) {
              return new EntryNormalModule({
                ...data,
                miniType: ENTRY_MINI_TYPE,
              });
            }
          }
        );
      }
    );
  }
}

export default (options: DynamicImportWeappPluginOptions): Plugin[] => {
  const finalPlugins: Plugin[] = [
    new DynamicImportWeappPlugin(options),
    new FakeTaroEntryPlugin(),
  ];
  return finalPlugins;
};

export const isEntryModule = module => {
  return module.miniType === ENTRY_MINI_TYPE;
};
