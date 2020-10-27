// @flow

import { Map, fromJS } from 'immutable';

import getPersonCaseNeighborsReducer from './getPersonCaseNeighborsReducer';
import getPersonNeighborsReducer from './getPersonNeighborsReducer';
import getPersonReducer from './getPersonReducer';
import loadProfileReducer from './loadProfileReducer';
import {
  PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
  PERSON,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
} from './constants';

import { RS_INITIAL_STATE } from '../../../../core/redux/constants';
import {
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  LOAD_PROFILE,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  loadProfile,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_PERSON]: RS_INITIAL_STATE,
  [GET_PERSON_CASE_NEIGHBORS]: RS_INITIAL_STATE,
  [GET_PERSON_NEIGHBORS]: RS_INITIAL_STATE,
  [LOAD_PROFILE]: RS_INITIAL_STATE,
  // data
  [PEOPLE_IN_CASE_BY_ROLE_EKID_MAP]: Map(),
  [PERSON]: Map(),
  [PERSON_CASE_NEIGHBOR_MAP]: Map(),
  [PERSON_NEIGHBOR_MAP]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getPerson.case(action.type):
      return getPersonReducer(state, action);

    case getPersonCaseNeighbors.case(action.type):
      return getPersonCaseNeighborsReducer(state, action);

    case getPersonNeighbors.case(action.type):
      return getPersonNeighborsReducer(state, action);

    case loadProfile.case(action.type):
      return loadProfileReducer(state, action);

    default:
      return state;
  }
}
