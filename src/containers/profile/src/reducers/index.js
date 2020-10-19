// @flow

import { List, Map, fromJS } from 'immutable';

import getPersonCasesReducer from './getPersonCasesReducer';
import { PERSON, PERSON_CASES } from './constants';

import { RS_INITIAL_STATE } from '../../../../core/redux/constants';
import { GET_PERSON_CASES, getPersonCases } from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_PERSON_CASES]: RS_INITIAL_STATE,
  // data
  [PERSON]: Map(),
  [PERSON_CASES]: List(),
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case getPersonCases.case(action.type):
      return getPersonCasesReducer(state, action);

    default:
      return state;
  }
}
