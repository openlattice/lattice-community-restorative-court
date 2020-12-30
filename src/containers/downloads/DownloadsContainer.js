// @flow
import React from 'react';

import Downloads from './Downloads';

import AppProvider from '../app/AppProvider';

const DownloadsContainer = (props :Props) => {
  const {
    match,
    organizationId,
    root,
  } = props;

  return (
    <AppProvider>
      <Downloads
          match={match}
          organizationId={organizationId}
          root={root} />
    </AppProvider>
  );
};

export default DownloadsContainer;
