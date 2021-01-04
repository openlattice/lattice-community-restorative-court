// @flow
import React from 'react';

import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import Dashboard from './Dashboard';

import AppProvider from '../app/AppProvider';

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const DashboardContainer = ({ match, organizationId, root } :Props) => (
  <AppProvider>
    <Dashboard
        match={match}
        organizationId={organizationId}
        root={root} />
  </AppProvider>
);

export default DashboardContainer;
