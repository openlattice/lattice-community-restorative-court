// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router';

import { useDispatch, useSelector } from './AppProvider';
import { INITIALIZE_APPLICATION, initializeApplication } from './actions'

import ProfileContainer from '../profile/src/ProfileContainer';
import { APP, REQUEST_STATE } from '../../core/redux/constants';
import { requestIsPending } from '../../utils/redux';
import { CenterWrapper } from '../profile/src/styled';

type Props = {
  match :Match;
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const HelplineSwitch = ({
  match,
  organizationId,
  personId,
  root,
} :Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApplication({ match, organizationId, root }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  const initializeRequestState = useSelector((state) => state.getIn([APP, INITIALIZE_APPLICATION, REQUEST_STATE]));
  if (requestIsPending(initializeRequestState)) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <Switch>
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default HelplineSwitch;
