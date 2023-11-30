import {ActivityIndicator} from 'react-native';
import React from 'react';

const AppLoader = () => {
  return <ActivityIndicator style={{flex: 1}} color={'blue'} size={'large'} />;
};

export default AppLoader;
