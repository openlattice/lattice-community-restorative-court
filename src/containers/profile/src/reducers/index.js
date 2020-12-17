// @flow

import { List, Map, fromJS } from 'immutable';

import addCaseStatusReducer from './addCaseStatusReducer';
import addContactActivityReducer from './addContactActivityReducer';
import addPeacemakerInformationReducer from './addPeacemakerInformationReducer';
import addPersonToCaseReducer from './addPersonToCaseReducer';
import clearSearchedPeopleReducer from './clearSearchedPeopleReducer';
import editAddressReducer from './editAddressReducer';
import editContactReducer from './editContactReducer';
import editPeacemakerInformationReducer from './editPeacemakerInformationReducer';
import editPersonDetailsReducer from './editPersonDetailsReducer';
import editPersonReducer from './editPersonReducer';
import getPersonCaseNeighborsReducer from './getPersonCaseNeighborsReducer';
import getPersonNeighborsReducer from './getPersonNeighborsReducer';
import getPersonReducer from './getPersonReducer';
import getStaffReducer from './getStaffReducer';
import loadProfileReducer from './loadProfileReducer';
import searchOrganizationsReducer from './searchOrganizationsReducer';
import searchPeopleReducer from './searchPeopleReducer';
import selectCaseReducer from './selectCaseReducer';
import submitAddressReducer from './submitAddressReducer';
import submitContactReducer from './submitContactReducer';

import { RESET_REQUEST_STATE } from '../../../../core/redux/actions';
import { ProfileReduxConstants, RS_INITIAL_STATE } from '../../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../../core/redux/reducers';
import {
  ADD_PEACEMAKER_INFORMATION,
  EDIT_PEACEMAKER_INFORMATION,
  addPeacemakerInformation,
  editPeacemakerInformation,
} from '../../../peacemaker/actions';
import {
  ADD_CASE_STATUS,
  ADD_CONTACT_ACTIVITY,
  ADD_PERSON_TO_CASE,
  CLEAR_SEARCHED_PEOPLE,
  EDIT_ADDRESS,
  EDIT_CONTACT,
  EDIT_PERSON,
  EDIT_PERSON_DETAILS,
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  GET_STAFF,
  LOAD_PROFILE,
  SEARCH_ORGANIZATIONS,
  SEARCH_PEOPLE,
  SELECT_CASE,
  SUBMIT_ADDRESS,
  SUBMIT_CONTACT,
  addCaseStatus,
  addContactActivity,
  addPersonToCase,
  editAddress,
  editContact,
  editPerson,
  editPersonDetails,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  getStaff,
  loadProfile,
  searchOrganizations,
  searchPeople,
  submitAddress,
  submitContact,
} from '../actions';

const {
  PERSON,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  SEARCHED_ORGANIZATIONS,
  SEARCHED_PEOPLE,
  SELECTED_CASE,
  STAFF_MEMBERS,
  STAFF_MEMBER_BY_STATUS_EKID,
  TOTAL_HITS,
} = ProfileReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [ADD_CASE_STATUS]: RS_INITIAL_STATE,
  [ADD_CONTACT_ACTIVITY]: RS_INITIAL_STATE,
  [ADD_PEACEMAKER_INFORMATION]: RS_INITIAL_STATE,
  [ADD_PERSON_TO_CASE]: RS_INITIAL_STATE,
  [EDIT_PEACEMAKER_INFORMATION]: RS_INITIAL_STATE,
  [EDIT_ADDRESS]: RS_INITIAL_STATE,
  [EDIT_CONTACT]: RS_INITIAL_STATE,
  [EDIT_PERSON]: RS_INITIAL_STATE,
  [EDIT_PERSON_DETAILS]: RS_INITIAL_STATE,
  [GET_PERSON]: RS_INITIAL_STATE,
  [GET_PERSON_CASE_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_PERSON_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_STAFF]: RS_INITIAL_STATE,
  [LOAD_PROFILE]: RS_INITIAL_STATE,
  [SEARCH_ORGANIZATIONS]: RS_INITIAL_STATE,
  [SEARCH_PEOPLE]: RS_INITIAL_STATE,
  [SUBMIT_ADDRESS]: RS_INITIAL_STATE,
  [SUBMIT_CONTACT]: RS_INITIAL_STATE,
  // data
  [PERSON]: Map(),
  [PERSON_CASE_NEIGHBOR_MAP]: Map(),
  [PERSON_NEIGHBOR_MAP]: Map(),
  [SEARCHED_ORGANIZATIONS]: List(),
  [SEARCHED_PEOPLE]: List(),
  [SELECTED_CASE]: Map(),
  [STAFF_MEMBERS]: List(),
  [STAFF_MEMBER_BY_STATUS_EKID]: Map(),
  [TOTAL_HITS]: 0,
});

export default function profileReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case CLEAR_SEARCHED_PEOPLE: {
      return clearSearchedPeopleReducer(state);
    }

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case SELECT_CASE: {
      return selectCaseReducer(state, action);
    }

    case addCaseStatus.case(action.type):
      return addCaseStatusReducer(state, action);

    case addContactActivity.case(action.type):
      return addContactActivityReducer(state, action);

    case addPeacemakerInformation.case(action.type):
      return addPeacemakerInformationReducer(state, action);

    case addPersonToCase.case(action.type):
      return addPersonToCaseReducer(state, action);

    case editPeacemakerInformation.case(action.type):
      return editPeacemakerInformationReducer(state, action);

    case editAddress.case(action.type):
      return editAddressReducer(state, action);

    case editContact.case(action.type):
      return editContactReducer(state, action);

    case editPerson.case(action.type):
      return editPersonReducer(state, action);

    case editPersonDetails.case(action.type):
      return editPersonDetailsReducer(state, action);

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

    case searchOrganizations.case(action.type):
      return searchOrganizationsReducer(state, action);

    case searchPeople.case(action.type):
      return searchPeopleReducer(state, action);

    case submitAddress.case(action.type):
      return submitAddressReducer(state, action);

    case submitContact.case(action.type):
      return submitContactReducer(state, action);

    default:
      return state;
  }
}
