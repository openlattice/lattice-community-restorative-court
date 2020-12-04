// @flow

import React from 'react';

import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils, LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { schema, uiSchema } from './schemas/CompletedIntakeSchemas';
import { populateFormData } from './utils/IntakeUtils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import {
  APP_PATHS,
  IntakeReduxConstants,
  ProfileReduxConstants,
  ReferralReduxConstants,
} from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useSelector } from '../app/AppProvider';
import { EMPTY_VALUE } from '../profile/src/constants';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  CRC_CASE,
  FORM,
  REFERRAL_REQUEST,
  STAFF,
} = AppTypes;
const { DATETIME_ADMINISTERED } = PropertyTypes;
const { INTAKE, SELECTED_INTAKE } = IntakeReduxConstants;
const { FORM_NEIGHBOR_MAP, PERSON_CASE_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const CompletedIntakeForm = () => {

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const selectedForm :Map = useSelector((store) => store.getIn([INTAKE, SELECTED_INTAKE]));
  const formEKID :?UUID = getEntityKeyId(selectedForm);
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP, formEKID], Map()));
  const crcCaseList :List = formNeighborMap.get(CRC_CASE, List());
  const crcCase :Map = crcCaseList.get(0, Map());
  const crcCaseEKID :?UUID = getEntityKeyId(crcCase);

  const personCaseNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const referralRequest = personCaseNeighborMap.getIn([REFERRAL_REQUEST, crcCaseEKID, 0], Map());

  const referralRequestNeighborMap :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP]));

  const formData = populateFormData(
    person,
    crcCaseEKID,
    referralRequest,
    personCaseNeighborMap,
    referralRequestNeighborMap,
  );

  const staffList :List = formNeighborMap.get(STAFF, List());
  const staffMember :Map = staffList.get(0, Map());
  const staffMemberName :string = getPersonName(staffMember);
  formData[getPageSectionKey(1, 4)] = {
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: staffMemberName,
  };

  const datetimeAdministered :string = getPropertyValue(selectedForm, [DATETIME_ADMINISTERED, 0]);
  const dateAdministered = isDefined(datetimeAdministered)
    ? DateTime.fromISO(datetimeAdministered).toISODate()
    : EMPTY_VALUE;
  formData[getPageSectionKey(1, 5)] = {
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: dateAdministered,
  };

  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={relativeRoot}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Intake Form</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Intake Form</Typography>
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

export default CompletedIntakeForm;
