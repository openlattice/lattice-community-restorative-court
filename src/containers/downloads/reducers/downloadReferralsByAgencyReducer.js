// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { DOWNLOAD_REFERRALS_BY_AGENCY, downloadReferralsByAgency } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return downloadReferralsByAgency.reducer(state, action, {
    REQUEST: () => state
      .setIn([DOWNLOAD_REFERRALS_BY_AGENCY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([DOWNLOAD_REFERRALS_BY_AGENCY, action.id], action),
    SUCCESS: () => state.setIn([DOWNLOAD_REFERRALS_BY_AGENCY, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([DOWNLOAD_REFERRALS_BY_AGENCY, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([DOWNLOAD_REFERRALS_BY_AGENCY, action.id]),
  });
}
