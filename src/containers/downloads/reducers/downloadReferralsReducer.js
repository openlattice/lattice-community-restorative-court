// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { DOWNLOAD_REFERRALS, downloadReferrals } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return downloadReferrals.reducer(state, action, {
    REQUEST: () => state
      .setIn([DOWNLOAD_REFERRALS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([DOWNLOAD_REFERRALS, action.id], action),
    SUCCESS: () => state.setIn([DOWNLOAD_REFERRALS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([DOWNLOAD_REFERRALS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([DOWNLOAD_REFERRALS, action.id]),
  });
}
