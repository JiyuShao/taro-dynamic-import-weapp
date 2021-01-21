import React from 'react';
import * as components from '@tarojs/components';

const InitComponent = () => {
  return Object.keys(components).map(cmpType => {
    const Component = components[cmpType];
    return <Component />;
  });
};

export default InitComponent;
