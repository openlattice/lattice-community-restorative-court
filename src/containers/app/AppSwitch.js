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

import AddPeopleToCaseForm from '../profile/src/caseparticipation/AddPeopleToCaseForm';
import CompletedIntakeForm from '../intake/CompletedIntakeForm';
import CompletedReferralForm from '../referral/CompletedReferralForm';
import CompletedRepairHarmAgreement from '../repairharm/CompletedRepairHarmAgreement';
import CompletedRestitutionReferral from '../restitutionreferral/CompletedRestitutionReferral';
import EditProfileContainer from '../profile/src/edit/EditProfileContainer';
import IntakeForm from '../intake/IntakeForm';
import PeacemakerInformationForm from '../peacemaker/PeacemakerInformationForm';
import ProfileContainer from '../profile/src/ProfileContainer';
import ReferralForm from '../referral/ReferralForm';
import RepairHarmAgreement from '../repairharm/RepairHarmAgreement';
import RestitutionReferral from '../restitutionreferral/RestitutionReferral';
import { APP, REQUEST_STATE } from '../../core/redux/constants';
import {
  ADD_PEOPLE_TO_CASE,
  COMPLETED_INTAKE_ROUTE_END,
  COMPLETED_REFERRAL_ROUTE_END,
  COMPLETED_REPAIR_HARM_AGREEMENT_ROUTE_END,
  COMPLETED_RESTITUTION_REFERRAL_ROUTE_END,
  EDIT_PROFILE_CONTAINER_ROUTE_END,
  INTAKE_ROUTE_END,
  PEACEMAKER_INFORMATION_ROUTE_END,
  REFERRAL_ROUTE_END,
  REPAIR_HARM_AGREEMENT_ROUTE_END,
  RESTITUTION_REFERRAL_ROUTE_END,
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
      <Route
          path={`${root}/${ADD_PEOPLE_TO_CASE}`}
          render={() => <AddPeopleToCaseForm />} />
      <Route
          path={`${root}/${COMPLETED_INTAKE_ROUTE_END}`}
          render={() => <CompletedIntakeForm />} />
      <Route path={`${root}/${INTAKE_ROUTE_END}`} render={() => <IntakeForm personId={personId} />} />
      <Route
          path={`${root}/${COMPLETED_RESTITUTION_REFERRAL_ROUTE_END}`}
          render={() => <CompletedRestitutionReferral />} />
      <Route
          path={`${root}/${RESTITUTION_REFERRAL_ROUTE_END}`}
          render={() => <RestitutionReferral personId={personId} />} />
      <Route
          path={`${root}/${COMPLETED_REPAIR_HARM_AGREEMENT_ROUTE_END}`}
          render={() => <CompletedRepairHarmAgreement />} />
      <Route
          path={`${root}/${REPAIR_HARM_AGREEMENT_ROUTE_END}`}
          render={() => <RepairHarmAgreement personId={personId} />} />
      <Route
          path={`${root}/${COMPLETED_REFERRAL_ROUTE_END}`}
          render={() => <CompletedReferralForm />} />
      <Route
          path={`${root}/${REFERRAL_ROUTE_END}`}
          render={() => <ReferralForm personId={personId} />} />
      <Route
          path={`${root}/${PEACEMAKER_INFORMATION_ROUTE_END}`}
          render={() => <PeacemakerInformationForm personId={personId} />} />
      <Route
          path={`${root}${EDIT_PROFILE_CONTAINER_ROUTE_END}`}
          render={() => <EditProfileContainer personId={personId} />} />
      <Route render={() => <ProfileContainer personId={personId} />} />
    </Switch>
  );
};

export default AppSwitch;
