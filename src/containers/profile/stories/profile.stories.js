import React from 'react';

import AppContainer from '../../app/AppContainer';

export default {
  title: 'App Container',
  component: AppContainer,
};

export const AppContainerStory = () => (
  <AppContainer />
);

AppContainerStory.story = {
  name: 'App Container'
};
