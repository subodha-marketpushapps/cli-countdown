import React, { type FC } from 'react';
import WidgetBuilder from './WidgetBuilder';
import { withProviders } from "../withProviders";
const Index: FC = () => {
  return <WidgetBuilder />;
};

export default withProviders(Index);

