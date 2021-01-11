// @flow
import React from 'react';

import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import Downloads from './Downloads';

import AppProvider from '../app/AppProvider';

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const DownloadsContainer = ({ match, organizationId, root } :Props) => (
  <AppProvider>
    <Downloads
        match={match}
        organizationId={organizationId}
        root={root} />
  </AppProvider>
);

export default DownloadsContainer;
