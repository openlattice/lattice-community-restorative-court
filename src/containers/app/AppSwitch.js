// @flow
import React, { useEffect } from 'react';

import { Spinner } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { Route, Switch } from 'react-router-dom';
import type { UUID } from 'lattice';
import type { Match } from 'react-router';
import type { RequestState } from 'redux-reqseq';

import { useDispatch, useSelector } from './AppProvider';
import { INITIALIZE_APPLICATION, initializeApplication } from './actions';

import ProfileContainer from '../profile/src/ProfileContainer';
import { APP, REQUEST_STATE } from '../../core/redux/constants';
import { CenterWrapper } from '../profile/src/styled';

const { isPending } = ReduxUtils;

type Props = {
  match :Match;
  organizationId :UUID;
  personId :UUID;
  root :string;
};

const AppSwitch = ({
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

  const initializeRequestState :?RequestState = useSelector((store) => store
    .getIn([APP, INITIALIZE_APPLICATION, REQUEST_STATE]));
  if (isPending(initializeRequestState)) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <Switch>
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default AppSwitch;
