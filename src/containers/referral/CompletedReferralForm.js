// @flow

import React from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { schema, uiSchema } from './schemas/CompletedReferralSchemas';
import { populateFormData } from './utils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { APP_PATHS, ProfileReduxConstants, ReferralReduxConstants } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useSelector } from '../app/AppProvider';

const { FORM_NEIGHBOR_MAP, PERSON_CASE_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP, SELECTED_REFERRAL_FORM } = ReferralReduxConstants;
const { getEntityKeyId } = DataUtils;

const CompletedReferralForm = () => {

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const selectedForm :Map = useSelector((store) => store.getIn([REFERRAL, SELECTED_REFERRAL_FORM]));
  const formEKID :?UUID = getEntityKeyId(selectedForm);
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP, formEKID], Map()));
  const personCaseNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const referralRequestNeighborMap :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP]));

  const formData = populateFormData(selectedForm, formNeighborMap, personCaseNeighborMap, referralRequestNeighborMap);
  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={relativeRoot}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Referral Information</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Referral Information</Typography>
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

export default CompletedReferralForm;
