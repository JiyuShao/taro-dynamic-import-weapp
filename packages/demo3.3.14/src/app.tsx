import React, { Component } from 'react';
import { View } from '@tarojs/components';

import './tailwind.css';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  // componentDidMount() {}

  // componentDidShow() {}

  // componentDidHide() {}

  // componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <View>{this.props.children}</View>;
  }
}

export default App;
