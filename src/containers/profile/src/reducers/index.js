// @flow

import { Map, fromJS } from 'immutable';

import getPersonNeighborsReducer from './getPersonNeighborsReducer';
import getPersonReducer from './getPersonReducer';
import loadProfileReducer from './loadProfileReducer';
import { PERSON, PERSON_NEIGHBOR_MAP } from './constants';

import { RS_INITIAL_STATE } from '../../../../core/redux/constants';
import {
  GET_PERSON,
  GET_PERSON_NEIGHBORS,
  LOAD_PROFILE,
  getPerson,
  getPersonNeighbors,
  loadProfile,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_PERSON]: RS_INITIAL_STATE,
  [GET_PERSON_NEIGHBORS]: RS_INITIAL_STATE,
  [LOAD_PROFILE]: RS_INITIAL_STATE,
  // data
  [PERSON]: Map(),
  [PERSON_NEIGHBOR_MAP]: Map(),
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getPerson.case(action.type):
      return getPersonReducer(state, action);

    case getPersonNeighbors.case(action.type):
      return getPersonNeighborsReducer(state, action);

    case loadProfile.case(action.type):
      return loadProfileReducer(state, action);

    default:
      return state;
  }
}
