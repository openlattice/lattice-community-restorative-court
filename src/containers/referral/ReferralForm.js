// @flow
import React, { useCallback, useEffect } from 'react';

import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Button, CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { SUBMIT_REFERRAL_FORM, getCRCPeople, submitReferralForm } from './actions';
import { schema, uiSchema } from './schemas/ReferralFormSchemas';
import {
  addCRCCaseNumberToFormData,
  getOptionalAssociations,
  getStaffInformation,
  getVictimAssociations,
  getVictimInformation,
} from './utils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { SubmissionFieldsGrid } from '../../components/forms';
import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { resetRequestState } from '../../core/redux/actions';
import {
  APP,
  APP_PATHS,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
  REQUEST_STATE,
  ReferralReduxConstants,
} from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { goToRoute } from '../../core/router/RoutingActions';
import { hydrateSchema, updateFormWithDateAsDateTime } from '../../utils/form';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useDispatch, useSelector } from '../app/AppProvider';
import { RoleConstants } from '../profile/src/constants';

const { getEntityKeyId } = DataUtils;
const { isPending, isSuccess } = ReduxUtils;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { RESPONDENT } = RoleConstants;
const { CRC_PEOPLE, REFERRAL } = ReferralReduxConstants;
const { PROFILE, STAFF_MEMBERS } = ProfileReduxConstants;
const {
  APPEARS_IN,
  CRC_CASE,
  DA_CASE,
  FORM,
  HAS,
  PEOPLE,
  RECORDED_BY,
  REFERRAL_REQUEST,
  REGISTERED_FOR,
  RELATED_TO,
  RESULTS_IN,
  SCREENED_WITH,
  STAFF,
  STATUS,
  SUBJECT_OF,
} = AppTypes;
const {
  DATETIME_COMPLETED,
  GENERAL_DATETIME,
  GIVEN_NAME,
  ROLE,
  SURNAME,
} = PropertyTypes;

type Props = {
  personId :UUID;
};

const ReferralForm = ({ personId } :Props) => {

  const dispatch = useDispatch();

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) dispatch(getCRCPeople());
  }, [appConfig, dispatch, personId]);

  const crcPeople :List = useSelector((store) => store.getIn([REFERRAL, CRC_PEOPLE], List()));
  let hydratedSchema = hydrateSchema(
    schema,
    crcPeople,
    [GIVEN_NAME, SURNAME],
    ['properties', getPageSectionKey(1, 2), 'properties', getEntityAddressKey(0, PEOPLE, OPENLATTICE_ID_FQN), 'items']
  );
  const staffMembers :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS]));
  hydratedSchema = hydrateSchema(
    hydratedSchema,
    staffMembers,
    [GIVEN_NAME, SURNAME],
    ['properties', getPageSectionKey(1, 4), 'properties', getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
  );

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));

  const person :Map = useSelector(selectPerson());
  const personEKID :?UUID = getEntityKeyId(person);
  const personName :string = getPersonName(person);

  const onSubmit = ({ formData } :Object) => {

    const dateOfReferralPath = [getPageSectionKey(1, 1), getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)];
    const dateOfIncidentPath = [getPageSectionKey(1, 1), getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)];

    let updatedFormData = updateFormWithDateAsDateTime(formData, dateOfReferralPath);
    updatedFormData = updateFormWithDateAsDateTime(updatedFormData, dateOfIncidentPath);

    updatedFormData = addCRCCaseNumberToFormData(updatedFormData);

    const { existingVictimEKIDs, formDataWithoutVictimsArray } = getVictimInformation(updatedFormData);
    const { selectedStaffEKID, formDataWithoutStaff } = getStaffInformation(formDataWithoutVictimsArray);

    const entityData = processEntityData(formDataWithoutStaff, entitySetIds, propertyTypeIds);

    let associations = [
      // $FlowFixMe
      [APPEARS_IN, personEKID, PEOPLE, 0, CRC_CASE, { [ROLE]: [RESPONDENT] }],
      [APPEARS_IN, 0, DA_CASE, 0, REFERRAL_REQUEST, {}],
      [RESULTS_IN, 0, REFERRAL_REQUEST, 0, CRC_CASE, {}],
      [SUBJECT_OF, personEKID, PEOPLE, 0, REFERRAL_REQUEST, {}],
      [REGISTERED_FOR, 0, STATUS, 0, REFERRAL_REQUEST, {}],
      [SCREENED_WITH, personEKID, PEOPLE, 0, FORM, {}],
      [RELATED_TO, 0, FORM, 0, REFERRAL_REQUEST, {}],
      [RELATED_TO, 0, FORM, 0, CRC_CASE, {}],
      [RECORDED_BY, 0, FORM, selectedStaffEKID, STAFF, {}],
      [RECORDED_BY, 0, STATUS, selectedStaffEKID, STAFF, {}],
      [HAS, personEKID, PEOPLE, 0, STATUS, {}],
      [HAS, 0, CRC_CASE, 0, STATUS, {}],
    ];
    associations = associations.concat(getVictimAssociations(formDataWithoutStaff, existingVictimEKIDs));
    associations = associations.concat(getOptionalAssociations(formDataWithoutStaff));

    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(submitReferralForm({ associationEntityData, entityData }));
  };

  const submitRequestState = useSelector((store :Map) => store.getIn([REFERRAL, SUBMIT_REFERRAL_FORM, REQUEST_STATE]));
  const submitSuccessful = isSuccess(submitRequestState);

  const clearSubmitState = useCallback(() => {
    dispatch(resetRequestState([SUBMIT_REFERRAL_FORM]));
  }, [dispatch]);

  useEffect(() => clearSubmitState, [clearSubmitState]);

  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const goToProfile = () => {
    dispatch(goToRoute(relativeRoot));
  };

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
        <Typography>
          Enter the respondent and victim information below to add a new referral for this person.
        </Typography>
      </CardSegment>
      <Form
          hideSubmit={submitSuccessful}
          isSubmitting={isPending(submitRequestState)}
          onSubmit={onSubmit}
          schema={hydratedSchema}
          uiSchema={uiSchema} />
      {submitSuccessful && (
        <CardSegment>
          <SubmissionFieldsGrid>
            <Typography>Submitted!</Typography>
            <Button color="success" onClick={goToProfile} variant="outlined">Back to Profile</Button>
          </SubmissionFieldsGrid>
        </CardSegment>
      )}
    </>
  );
};

export default ReferralForm;
