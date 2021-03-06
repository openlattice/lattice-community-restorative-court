// @flow
import { List, Map, fromJS } from 'immutable';

import getAgenciesReducer from './getAgenciesReducer';
import getCRCPeopleReducer from './getCRCPeopleReducer';
import getChargesReducer from './getChargesReducer';
import getOrganizationsReducer from './getOrganizationsReducer';
import getReferralRequestNeighborsReducer from './getReferralRequestNeighborsReducer';
import selectReferralFormReducer from './selectReferralFormReducer';
import submitReferralFormReducer from './submitReferralFormReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import {
  GET_AGENCIES,
  GET_CHARGES,
  GET_CRC_PEOPLE,
  GET_ORGANIZATIONS,
  GET_REFERRAL_REQUEST_NEIGHBORS,
  SELECT_REFERRAL_FORM,
  SUBMIT_REFERRAL_FORM,
  getAgencies,
  getCRCPeople,
  getCharges,
  getOrganizations,
  getReferralRequestNeighbors,
  submitReferralForm,
} from '../actions';

const {
  AGENCIES,
  CHARGES,
  CRC_ORGANIZATIONS,
  CRC_PEOPLE,
  REFERRAL_REQUEST_NEIGHBOR_MAP,
  SELECTED_REFERRAL_FORM,
} = ReferralReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_AGENCIES]: RS_INITIAL_STATE,
  [GET_CHARGES]: RS_INITIAL_STATE,
  [GET_CRC_PEOPLE]: RS_INITIAL_STATE,
  [GET_ORGANIZATIONS]: RS_INITIAL_STATE,
  [GET_REFERRAL_REQUEST_NEIGHBORS]: RS_INITIAL_STATE,
  [SUBMIT_REFERRAL_FORM]: RS_INITIAL_STATE,
  // data
  [AGENCIES]: List(),
  [CHARGES]: List(),
  [CRC_ORGANIZATIONS]: List(),
  [CRC_PEOPLE]: List(),
  [REFERRAL_REQUEST_NEIGHBOR_MAP]: Map(),
  [SELECTED_REFERRAL_FORM]: Map(),
});

export default function profileReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case SELECT_REFERRAL_FORM: {
      return selectReferralFormReducer(state, action);
    }

    case getAgencies.case(action.type):
      return getAgenciesReducer(state, action);

    case getCharges.case(action.type):
      return getChargesReducer(state, action);

    case getCRCPeople.case(action.type):
      return getCRCPeopleReducer(state, action);

    case getOrganizations.case(action.type):
      return getOrganizationsReducer(state, action);

    case getReferralRequestNeighbors.case(action.type):
      return getReferralRequestNeighborsReducer(state, action);

    case submitReferralForm.case(action.type):
      return submitReferralFormReducer(state, action);

    default:
      return state;
  }
}
