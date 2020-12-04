// @flow
import React from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { schema, uiSchema } from './schemas/CompletedRestitutionReferralSchemas';
import { populateCompletedForm } from './utils/RestitutionReferralUtils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import {
  APP_PATHS,
  ProfileReduxConstants,
  ReferralReduxConstants,
  RestitutionReferralReduxConstants,
} from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useSelector } from '../app/AppProvider';

const {
  FORM_NEIGHBOR_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  PROFILE,
} = ProfileReduxConstants;
const { RESTITUTION_REFERRAL, SELECTED_RESTITUTION_REFERRAL } = RestitutionReferralReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const { getEntityKeyId } = DataUtils;

const CompletedRestitutionReferral = () => {

  const person :Map = useSelector(selectPerson());
  const personEKID :?UUID = getEntityKeyId(person);
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const selectedRequest :Map = useSelector((store) => store
    .getIn([RESTITUTION_REFERRAL, SELECTED_RESTITUTION_REFERRAL]));
  const formEKID :?UUID = getEntityKeyId(selectedRequest);
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP, formEKID], Map()));
  const personNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP]));
  const personCaseNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const referralRequestNeighborMap :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP]));
  const formData = populateCompletedForm(
    selectedRequest,
    formNeighborMap,
    person,
    personCaseNeighborMap,
    personNeighborMap,
    referralRequestNeighborMap,
    personEKID,
  );
  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={relativeRoot}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Restitution Referral</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Restitution Referral</Typography>
      </CardSegment>
      <Form
          disabled
          formData={formData}
          hideSubmit
          readOnly
          schema={schema}
          uiSchema={uiSchema} />
    </>
  );
};

export default CompletedRestitutionReferral;
