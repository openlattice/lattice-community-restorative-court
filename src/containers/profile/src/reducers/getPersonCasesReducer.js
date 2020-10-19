// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { PERSON_CASES } from './constants';

import { REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_PERSON_CASES, getPersonCases } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return getPersonCases.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_PERSON_CASES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_PERSON_CASES, action.id], action),
    SUCCESS: () => state
      .setIn([GET_PERSON_CASES, REQUEST_STATE], RequestStates.SUCCESS)
      .set(PERSON_CASES, action.value),
    FAILURE: () => state.setIn([GET_PERSON_CASES, REQUEST_STATE], RequestStates.FAILURE),
  });
}
