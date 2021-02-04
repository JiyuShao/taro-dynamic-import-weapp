/*
 * app.js 入口文件代码注入
 * 注入 eval5 到全局变量 + 引入全部 taro components
 * @Author: Jiyu Shao
 * @Date: 2021-01-30 15:26:27
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2021-02-04 14:11:32
 */
import stripIndent from 'strip-indent';

export default function EntryLoader(source) {
  return stripIndent(`
  import * as eval5 from 'eval5';
  import * as TaroComponents from '@tarojs/components';

  wx['eval5'] = eval5;
  Object.keys(TaroComponents);

  ${source}
  `);
}
