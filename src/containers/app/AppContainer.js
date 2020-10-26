/*
 * @flow
 */

import React from 'react';

import type { Match } from 'react-router';

import AppProvider from './AppProvider';
import AppSwitch from './AppSwitch';

type Props = {
  match :Match;
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const AppContainer = (props :Props) => {
  const {
    match,
    organizationId,
    personId,
    root,
  } = props;

  return (
    <AppProvider>
      <AppSwitch
          match={match}
          organizationId={organizationId}
          personId={personId}
          root={root} />
    </AppProvider>
  );
};

export default AppContainer;
