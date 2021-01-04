// @flow
import React, { useEffect } from 'react';

import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import { useDispatch } from '../app/AppProvider';
import { initializeApplication } from '../app/actions';

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const Dashboard = ({ match, organizationId, root } :Props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApplication({ match, organizationId, root }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  return (
    <div>Dashboard</div>
  );
};

export default Dashboard;
