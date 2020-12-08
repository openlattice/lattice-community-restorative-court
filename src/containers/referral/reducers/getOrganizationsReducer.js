// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { GET_ORGANIZATIONS, getOrganizations } from '../actions';

const { CRC_ORGANIZATIONS } = ReferralReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getOrganizations.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_ORGANIZATIONS, action.id], action),
    SUCCESS: () => state
      .set(CRC_ORGANIZATIONS, action.value)
      .setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_ORGANIZATIONS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_ORGANIZATIONS, action.id]),
  });
}
