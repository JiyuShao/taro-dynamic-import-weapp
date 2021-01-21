import React from 'react';
import { Button, Text } from '@tarojs/components';
import config from '../../utils/config';

const AsyncButton = () => {
  return (
    <Button className="async-button-component">
      <Text>Async Button</Text>
      <Text>Async Button{config.configId}</Text>
    </Button>
  );
};

export default AsyncButton;
