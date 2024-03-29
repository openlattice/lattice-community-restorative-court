// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  List,
  Map,
  get,
  getIn,
  remove,
  removeIn,
  updateIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Button, CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { SUBMIT_RESTITUTION_REFERRAL, submitRestitutionReferral } from './actions';
import { schema, uiSchema } from './schemas/RestitutionReferralFormSchemas';

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
  RestitutionReferralReduxConstants,
} from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { goToRoute } from '../../core/router/RoutingActions';
import { formatCasesForDropdown, hydrateSchema, updateFormWithDateAsDateTime } from '../../utils/form';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useDispatch, useSelector } from '../app/AppProvider';
import { EMPTY_VALUE, RoleConstants } from '../profile/src/constants';

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isPending, isSuccess } = ReduxUtils;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { VICTIM } = RoleConstants;
const {
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBERS,
} = ProfileReduxConstants;
const {
  CRC_CASE,
  FORM,
  PEOPLE,
  RECORDED_BY,
  REFERRAL_REQUEST,
  RELATED_TO,
  SCREENED_WITH,
  STAFF,
  SUBJECT_OF,
} = AppTypes;
const {
  DUE_DATE,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NOTES,
  ORGANIZATION_NAME,
  ROLE,
  SURNAME,
} = PropertyTypes;
const { RESTITUTION_REFERRAL } = RestitutionReferralReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;

const RestitutionReferral = () => {

  const referralRequestsByCRCCaseEKID :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, REFERRAL_REQUEST], Map()));
  const referralRequestNeighborMap :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP], Map()));

  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, CRC_CASE], List()));
  const caseRoleMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE], Map()));
  const personCasesWithRespondentName = formatCasesForDropdown(
    personCases,
    caseRoleMap,
    referralRequestsByCRCCaseEKID,
    referralRequestNeighborMap,
  );

  let hydratedSchema = hydrateSchema(
    schema,
    personCasesWithRespondentName,
    [NOTES, SURNAME],
    ['properties', getPageSectionKey(1, 2), 'properties', getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]
  );

  const staffMembers :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS]));
  hydratedSchema = hydrateSchema(
    hydratedSchema,
    staffMembers,
    [GIVEN_NAME, SURNAME],
    ['properties', getPageSectionKey(1, 2), 'properties', getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
  );

  // victims could be either a person or an organization:
  const victims = caseRoleMap.valueSeq().toList().map((roleMap :Map) => roleMap.get(VICTIM, List())).flatten(1);
  const victimPeople :List = victims.filter((victim :Map) => !victim.has(ORGANIZATION_NAME));
  const victimOrgs :List = victims.filter((victim :Map) => victim.has(ORGANIZATION_NAME));
  const victimSchemaPath = [
    'properties',
    getPageSectionKey(1, 3),
    'properties',
    getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)
  ];
  hydratedSchema = hydrateSchema(hydratedSchema, victimPeople, [GIVEN_NAME, SURNAME], victimSchemaPath);
  const victimOrgEnum = [];
  const victimOrgEnumNames = [];
  victimOrgs.forEach((victimOrg :Map) => {
    victimOrgEnumNames.push(getPropertyValue(victimOrg, [ORGANIZATION_NAME, 0]));
    victimOrgEnum.push(getEntityKeyId(victimOrg));
  });
  hydratedSchema = updateIn(
    hydratedSchema,
    victimSchemaPath.concat(['enum']),
    (victimOptions) => victimOptions.concat(victimOrgEnum),
  );
  hydratedSchema = updateIn(
    hydratedSchema,
    victimSchemaPath.concat(['enumNames']),
    (victimOptions) => victimOptions.concat(victimOrgEnumNames)
  );

  const person :Map = useSelector(selectPerson());
  const prepopulatedFormData = useMemo(() => {
    const personFirstName :string = getPropertyValue(person, [GIVEN_NAME, 0], EMPTY_VALUE);
    const personMiddleName :string = getPropertyValue(person, [MIDDLE_NAME, 0], EMPTY_VALUE);
    const personLastName :string = getPropertyValue(person, [SURNAME, 0], EMPTY_VALUE);
    return {
      [getPageSectionKey(1, 1)]: {
        [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: personFirstName,
        [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: personMiddleName,
        [getEntityAddressKey(0, PEOPLE, SURNAME)]: personLastName,
      }
    };
  }, [person]);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(prepopulatedFormData);
  }, [prepopulatedFormData]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const personEKID :?UUID = getEntityKeyId(person);
  const dispatch = useDispatch();

  const onSubmit = () => {
    const page1Section2 = getPageSectionKey(1, 2);
    let formDataForSubmit = { [page1Section2]: get(formData, page1Section2) };
    const staffEKIDPath = [page1Section2, getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)];
    const staffEKID = getIn(formDataForSubmit, staffEKIDPath);
    formDataForSubmit = removeIn(formDataForSubmit, staffEKIDPath);

    const crcCaseEKIDPath = [page1Section2, getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)];
    const crcCaseEKID = getIn(formDataForSubmit, crcCaseEKIDPath);
    formDataForSubmit = removeIn(formDataForSubmit, crcCaseEKIDPath);

    formDataForSubmit = updateFormWithDateAsDateTime(formDataForSubmit, [
      getPageSectionKey(1, 2),
      getEntityAddressKey(0, FORM, GENERAL_DATETIME)
    ]);

    const victimEKID = getIn(
      formData,
      [getPageSectionKey(1, 3), getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)]
    );
    formDataForSubmit = remove(formDataForSubmit, getPageSectionKey(1, 3));

    formDataForSubmit = updateFormWithDateAsDateTime(formDataForSubmit, [
      page1Section2,
      getEntityAddressKey(0, FORM, DUE_DATE)
    ]);

    const entityData = processEntityData(formDataForSubmit, entitySetIds, propertyTypeIds);
    const associations :any[][] = [
      [SCREENED_WITH, personEKID, PEOPLE, 0, FORM, {}],
      [RELATED_TO, 0, FORM, crcCaseEKID, CRC_CASE, {}],
      [RECORDED_BY, 0, FORM, staffEKID, STAFF, {}],
      [SUBJECT_OF, victimEKID, PEOPLE, 0, FORM, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(submitRestitutionReferral({ associationEntityData, entityData }));
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([RESTITUTION_REFERRAL, SUBMIT_RESTITUTION_REFERRAL, REQUEST_STATE]));
  const submitSuccessful = isSuccess(submitRequestState);

  const clearSubmitState = useCallback(() => {
    dispatch(resetRequestState([SUBMIT_RESTITUTION_REFERRAL]));
  }, [dispatch]);

  useEffect(() => clearSubmitState, [clearSubmitState]);

  const personName :string = getPersonName(person);

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
            <Typography color="inherit" variant="body2">Restitution Referral</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Restitution Referral</Typography>
        <Typography>
          Enter the information below to create a new restitution referral.
        </Typography>
      </CardSegment>
      <Form
          hideSubmit={submitSuccessful}
          isSubmitting={isPending(submitRequestState)}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          schema={hydratedSchema}
          uiSchema={uiSchema} />
      {submitSuccessful && (
        <CardSegment>
          <SubmissionFieldsGrid>
            <Typography gutterBottom>Submitted!</Typography>
            <Button
                arialabelledby="restitutionReferral backToProfile"
                color="success"
                onClick={goToProfile}
                variant="outlined">
              Back to Profile
            </Button>
          </SubmissionFieldsGrid>
        </CardSegment>
      )}
    </>
  );
};

export default RestitutionReferral;
