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
  removeIn,
  setIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import {
  Button,
  CardSegment,
  Select,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { SUBMIT_INTAKE, submitIntake } from './actions';
import { schema, uiSchema } from './schemas/IntakeFormSchemas';
import { populateFormData } from './utils/IntakeUtils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { SubmissionFieldsGrid } from '../../components/forms';
import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { resetRequestState } from '../../core/redux/actions';
import {
  APP,
  APP_PATHS,
  APP_REDUX_CONSTANTS,
  EDM,
  IntakeReduxConstants,
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
import { getCharges } from '../referral/actions';

const { INTAKE } = IntakeReduxConstants;
const {
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBERS,
} = ProfileReduxConstants;
const { AGENCIES, REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const {
  AGENCY,
  CHARGES,
  CRC_CASE,
  DA_CASE,
  FORM,
  HAS,
  PEOPLE,
  RECORDED_BY,
  REFERRAL_REQUEST,
  RELATED_TO,
  SCREENED_WITH,
  STAFF,
  STATUS,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DA_CASE_NUMBER,
  EFFECTIVE_DATE,
  GIVEN_NAME,
  NAME,
  NOTES,
  ROLE,
  SURNAME,
} = PropertyTypes;
const { RESPONDENT } = RoleConstants;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isPending, isSuccess } = ReduxUtils;
const { isNonEmptyString } = LangUtils;

const IntakeForm = () => {

  const dispatch = useDispatch();

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) {
      dispatch(getCharges());
    }
  }, [appConfig, dispatch]);

  const [selectedCase, selectCase] = useState('');
  const [formData, setFormData] = useState({});

  const person :Map = useSelector(selectPerson());
  const personNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP]));
  const personCaseNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const referralRequest = personCaseNeighborMap.getIn([REFERRAL_REQUEST, selectedCase, 0], Map());
  const referralRequestNeighborMap :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP]));
  const daCasesByReferralRequestEKID :Map = referralRequestNeighborMap.get(DA_CASE, Map());

  const crcCases :List = personNeighborMap.get(CRC_CASE, List());
  const crcOptions = crcCases.map((crcCase :Map) => {
    const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
    const crcCaseNumber :string = getPropertyValue(crcCase, [NOTES, 0]);
    const respondent :Map = personCaseNeighborMap.getIn([ROLE, crcCaseEKID, RESPONDENT, 0], Map());
    const respondentName :string = getPersonName(respondent);
    const caseReferralRequest :Map = personCaseNeighborMap.getIn([REFERRAL_REQUEST, crcCaseEKID, 0], Map());
    const caseReferralRequestEKID :?UUID = getEntityKeyId(caseReferralRequest);
    const daCase :Map = daCasesByReferralRequestEKID.getIn([caseReferralRequestEKID, 0], Map());
    const daCaseNumber :string = getPropertyValue(daCase, [DA_CASE_NUMBER, 0]);
    const caseIdentifier = `${daCaseNumber || crcCaseNumber} - ${respondentName}`;
    return {
      label: caseIdentifier,
      value: crcCaseEKID,
    };
  }).toJS();

  const staffMembers :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS]));
  let hydratedSchema = hydrateSchema(
    schema,
    staffMembers,
    [GIVEN_NAME, SURNAME],
    ['properties', getPageSectionKey(1, 6), 'properties', getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
  );
  const charges :List = useSelector((store) => store.getIn([REFERRAL, ReferralReduxConstants.CHARGES], List()));
  hydratedSchema = hydrateSchema(
    hydratedSchema,
    charges,
    [NAME],
    ['properties', getPageSectionKey(1, 5), 'properties', getEntityAddressKey(0, CHARGES, NAME)]
  );
  const agencies :List = useSelector((store) => store.getIn([REFERRAL, AGENCIES], List()));
  hydratedSchema = hydrateSchema(
    hydratedSchema,
    agencies,
    [NAME],
    ['properties', getPageSectionKey(1, 5), 'properties', getEntityAddressKey(0, AGENCY, NAME)]
  );

  const prepopulatedFormData = useMemo(() => populateFormData(
    person,
    selectedCase,
    referralRequest,
    personCaseNeighborMap,
    referralRequestNeighborMap,
  ), [person, selectedCase, referralRequest, personCaseNeighborMap, referralRequestNeighborMap]);

  useEffect(() => {
    setFormData(prepopulatedFormData);
  }, [prepopulatedFormData]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const personEKID :?UUID = getEntityKeyId(person);

  const onSubmit = () => {
    const page1Section1 = getPageSectionKey(1, 1);
    const page1Section6 = getPageSectionKey(1, 6);
    const page1Section7 = getPageSectionKey(1, 7);
    let formDataForSubmit = {
      [page1Section1]: get(formData, page1Section1),
      [page1Section6]: get(formData, page1Section6),
      [page1Section7]: get(formData, page1Section7),
    };
    const staffEKIDPath = [page1Section6, getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)];
    const staffEKID = getIn(formDataForSubmit, staffEKIDPath);
    formDataForSubmit = removeIn(formDataForSubmit, staffEKIDPath);

    formDataForSubmit = updateFormWithDateAsDateTime(formDataForSubmit, [
      page1Section1,
      getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)
    ]);
    const formDateTimeISO = getIn(formDataForSubmit, [
      page1Section1,
      getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)
    ]);

    formDataForSubmit = setIn(
      formDataForSubmit,
      [page1Section7, getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)],
      formDateTimeISO
    );

    const entityData = processEntityData(formDataForSubmit, entitySetIds, propertyTypeIds);
    const associations :any[][] = [
      [SCREENED_WITH, personEKID, PEOPLE, 0, FORM, {}],
      [RELATED_TO, 0, FORM, selectedCase, CRC_CASE, {}],
      [RECORDED_BY, 0, FORM, staffEKID, STAFF, {}],
      [RECORDED_BY, 0, STATUS, staffEKID, STAFF, {}],
      [HAS, personEKID, PEOPLE, 0, STATUS, {}],
      [HAS, selectedCase, CRC_CASE, 0, STATUS, {}],
      [RELATED_TO, 0, FORM, getEntityKeyId(referralRequest), REFERRAL_REQUEST, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(submitIntake({ associationEntityData, entityData }));
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([INTAKE, SUBMIT_INTAKE, REQUEST_STATE]));
  const submitSuccessful = isSuccess(submitRequestState);

  const clearSubmitState = useCallback(() => {
    dispatch(resetRequestState([SUBMIT_INTAKE]));
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
          <CrumbItem>
            <CrumbLink to={relativeRoot}>
              <Typography color="inherit" variant="body2">{ personName }</Typography>
            </CrumbLink>
          </CrumbItem>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Intake Form</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Intake Form</Typography>
        <Typography variant="body1">
          Submit the information below to add a new intake for this person.
        </Typography>
      </CardSegment>
      <CardSegment>
        <Typography gutterBottom>Choose the CRC case:</Typography>
        <Select onChange={(option) => selectCase(option.value)} options={crcOptions} />
      </CardSegment>
      {isNonEmptyString(selectedCase) && (
        <Form
            hideSubmit={submitSuccessful}
            isSubmitting={isPending(submitRequestState)}
            formData={formData}
            onChange={onChange}
            onSubmit={onSubmit}
            schema={hydratedSchema}
            uiSchema={uiSchema} />
      )}
      {submitSuccessful && (
        <CardSegment>
          <SubmissionFieldsGrid>
            <Typography gutterBottom>Submitted!</Typography>
            <Button
                arialabelledby="intake backToProfile"
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

export default IntakeForm;
