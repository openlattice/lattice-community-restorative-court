// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_PERSON, editPerson } from '../actions';

const { PERSON } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {
  return editPerson.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_PERSON, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_PERSON, action.id], action),
    SUCCESS: () => state
      .set(PERSON, state.get(PERSON).merge(action.value))
      .setIn([EDIT_PERSON, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([EDIT_PERSON, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([EDIT_PERSON, action.id]),
  });
}
