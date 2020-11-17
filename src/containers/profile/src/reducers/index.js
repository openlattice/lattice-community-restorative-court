// @flow

import { List, Map, fromJS } from 'immutable';

import addCaseStatusReducer from './addCaseStatusReducer';
import getFormNeighborsReducer from './getFormNeighborsReducer';
import getPersonCaseNeighborsReducer from './getPersonCaseNeighborsReducer';
import getPersonNeighborsReducer from './getPersonNeighborsReducer';
import getPersonReducer from './getPersonReducer';
import getStaffReducer from './getStaffReducer';
import loadProfileReducer from './loadProfileReducer';
import {
  FORM_NEIGHBOR_MAP,
  PERSON,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  STAFF_MEMBERS,
  STAFF_MEMBER_BY_STATUS_EKID,
} from './constants';

import { RESET_REQUEST_STATE } from '../../../../core/redux/actions';
import { RS_INITIAL_STATE } from '../../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../../core/redux/reducers';
import {
  ADD_CASE_STATUS,
  GET_FORM_NEIGHBORS,
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  GET_STAFF,
  LOAD_PROFILE,
  addCaseStatus,
  getFormNeighbors,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  getStaff,
  loadProfile,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [ADD_CASE_STATUS]: RS_INITIAL_STATE,
  [GET_FORM_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_PERSON]: RS_INITIAL_STATE,
  [GET_PERSON_CASE_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_PERSON_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_STAFF]: RS_INITIAL_STATE,
  [LOAD_PROFILE]: RS_INITIAL_STATE,
  // data
  [FORM_NEIGHBOR_MAP]: Map(),
  [PERSON]: Map(),
  [PERSON_CASE_NEIGHBOR_MAP]: Map(),
  [PERSON_NEIGHBOR_MAP]: Map(),
  [STAFF_MEMBERS]: List(),
  [STAFF_MEMBER_BY_STATUS_EKID]: Map(),
});

export default function profileReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case addCaseStatus.case(action.type):
      return addCaseStatusReducer(state, action);

    case getFormNeighbors.case(action.type):
      return getFormNeighborsReducer(state, action);

    case getPerson.case(action.type):
      return getPersonReducer(state, action);

    case getPersonCaseNeighbors.case(action.type):
      return getPersonCaseNeighborsReducer(state, action);

    case getPersonNeighbors.case(action.type):
      return getPersonNeighborsReducer(state, action);

    case getStaff.case(action.type):
      return getStaffReducer(state, action);

    case loadProfile.case(action.type):
      return loadProfileReducer(state, action);

    default:
      return state;
  }
}
