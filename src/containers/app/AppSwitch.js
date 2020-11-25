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

import CompletedReferralForm from '../referral/CompletedReferralForm';
import IntakeForm from '../intake/IntakeForm';
import PeacemakerInformationForm from '../peacemaker/PeacemakerInformationForm';
import ProfileContainer from '../profile/src/ProfileContainer';
import ReferralForm from '../referral/ReferralForm';
import { APP, REQUEST_STATE } from '../../core/redux/constants';
import {
  COMPLETED_REFERRAL_ROUTE_END,
  INTAKE,
  PEACEMAKER_INFORMATION_ROUTE_END,
  PERSON_ID,
  REFERRAL_ROUTE_END,
} from '../../core/router/Routes';
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
      <Route path={`${root}/${PERSON_ID}/${INTAKE}`} render={() => <IntakeForm personId={personId} />} />
      <Route
          path={`${root}/${COMPLETED_REFERRAL_ROUTE_END}`}
          render={() => <CompletedReferralForm personId={personId} />} />
      <Route path={`${root}/${REFERRAL_ROUTE_END}`} render={() => <ReferralForm personId={personId} />} />
      <Route
          path={`${root}/${PEACEMAKER_INFORMATION_ROUTE_END}`}
          render={() => <PeacemakerInformationForm personId={personId} />} />
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default AppSwitch;
