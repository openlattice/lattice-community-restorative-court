// @flow
import React, { useEffect, useState } from 'react';

import {
  List,
  Map,
  getIn,
  removeIn,
  setIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Modal, ModalFooter } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { resetRequestState } from '../../../../core/redux/actions';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  REQUEST_STATE
} from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { hydrateSchema } from '../../../../utils/form';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { ADD_CASE_STATUS, addCaseStatus } from '../actions';
import { PERSON, PROFILE, STAFF_MEMBERS } from '../reducers/constants';
import { schema, uiSchema } from '../schemas/AddStatusSchemas';

const { getEntityKeyId } = DataUtils;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { isPending, isSuccess } = ReduxUtils;
const {
  CASE,
  HAS,
  PEOPLE,
  RECORDED_BY,
  STAFF,
  STATUS,
} = AppTypes;
const { EFFECTIVE_DATE, GIVEN_NAME, SURNAME } = PropertyTypes;
const { OPENLATTICE_ID_FQN } = Constants;
const { ENTITY_SET_IDS } = APP_REDUX_CONSTANTS;

type Props = {
  caseEKID :?UUID;
  isVisible :boolean;
  onClose :() => void;
};

const CaseDetailsModal = ({
  caseEKID,
  isVisible,
  onClose,
} :Props) => {

  const [formData, setFormData] = useState({});

  const staff :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS]));
  const hydratedSchema = hydrateSchema(
    schema,
    staff,
    [GIVEN_NAME, SURNAME],
    ['properties', getPageSectionKey(1, 1), 'properties', getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
  );

  const person :Map = useSelector(selectPerson);
  const personEKID :?UUID = getEntityKeyId(person);

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const dispatch = useDispatch();

  const onSubmit = () => {
    const staffMemberPath = [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)];
    const effectiveDatePath = [getPageSectionKey(1, 1), getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)];
    const selectedStaffEKID = getIn(formData, staffMemberPath);
    const associations = [
      [RECORDED_BY, 0, STATUS, selectedStaffEKID, STAFF, {}],
      [HAS, personEKID, PEOPLE, 0, STATUS, {}],
      [HAS, caseEKID, CASE, 0, STATUS, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    let updatedFormData = removeIn(formData, staffMemberPath);
    const date = getIn(updatedFormData, effectiveDatePath);
    const now = DateTime.local();
    updatedFormData = setIn(
      updatedFormData,
      effectiveDatePath,
      DateTime.fromSQL(date.concat(' ', now.toISOTime())).toISO()
    );
    const entityData = processEntityData(updatedFormData, entitySetIds, propertyTypeIds);

    dispatch(addCaseStatus({
      associationEntityData,
      caseEKID,
      entityData,
      selectedStaffEKID,
    }));
  };

  const submitRequestState = useSelector((store :Map) => store.getIn([PROFILE, ADD_CASE_STATUS, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(submitRequestState)) {
      dispatch(resetRequestState([ADD_CASE_STATUS]));
      onClose();
    }
  }, [dispatch, onClose, submitRequestState]);

  const withFooter = (
    <ModalFooter
        isPendingPrimary={isPending(submitRequestState)}
        onClickPrimary={onSubmit}
        onClickSecondary={onClose}
        textPrimary="Submit"
        textSecondary="Discard" />
  );
  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Add Case Status"
        viewportScrolling
        withFooter={withFooter}>
      <div>To record status of Referral or Intake, please complete form first.</div>
      <Form
          formData={formData}
          hideSubmit
          noPadding
          onChange={onChange}
          onSubmit={onSubmit}
          schema={hydratedSchema}
          uiSchema={uiSchema} />
    </Modal>
  );
};

export default CaseDetailsModal;
