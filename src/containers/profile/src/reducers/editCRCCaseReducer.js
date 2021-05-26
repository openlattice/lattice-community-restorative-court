// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_CRC_CASE, editCRCCase } from '../actions';

const { PERSON_NEIGHBOR_MAP, SELECTED_CASE } = ProfileReduxConstants;
const { CRC_CASE } = AppTypes;
const { getEntityKeyId } = DataUtils;

export default function reducer(state :Map, action :SequenceAction) {
  return editCRCCase.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_CRC_CASE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_CRC_CASE, action.id], action),
    SUCCESS: () => {
      const { crcCaseEKID, newCRCCase } = action.value;
      const crcCaseIndex = state.getIn([PERSON_NEIGHBOR_MAP, CRC_CASE], List())
        .findIndex((crcCase :Map) => getEntityKeyId(crcCase) === crcCaseEKID);
      return state
        .set(SELECTED_CASE, state.get(SELECTED_CASE).merge(newCRCCase))
        .updateIn(
          [PERSON_NEIGHBOR_MAP, CRC_CASE, crcCaseIndex],
          (originalCRCCase :Map) => originalCRCCase.merge(newCRCCase)
        )
        .setIn([EDIT_CRC_CASE, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([EDIT_CRC_CASE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([EDIT_CRC_CASE, action.id]),
  });
}
