import {View} from 'react-native';
import React from 'react';

interface IProp {
  width: number;
}

const ItemSepratorCompo = ({width}: IProp) => {
  return <View style={{width: width}}></View>;
};

export default ItemSepratorCompo;
