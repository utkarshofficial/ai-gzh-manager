import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React from 'react';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  console.log(initialState, 'initialState');

  return <PageContainer>欢迎👏🏻</PageContainer>;
};

export default Welcome;
