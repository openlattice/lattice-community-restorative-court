// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_PERSON, getPerson } from '../actions';

const { PERSON } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getPerson.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_PERSON, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_PERSON, action.id], action),
    SUCCESS: () => state
      .set(PERSON, action.value)
      .setIn([GET_PERSON, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_PERSON, REQUEST_STATE], RequestStates.FAILURE),
  });
}
