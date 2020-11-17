// @flow
import { List, Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { PERSON_NEIGHBOR_MAP } from './constants';

import { AppTypes } from '../../../../core/edm/constants';
import { REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_CONTACT_ACTIVITY, addContactActivity } from '../actions';

const { CONTACT_ACTIVITY } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {

  return addContactActivity.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_CONTACT_ACTIVITY, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_CONTACT_ACTIVITY, action.id], action),
    SUCCESS: () => {
      const newContactActivity :Map = action.value;
      const personNeighborMap = state.get(PERSON_NEIGHBOR_MAP)
        .update(CONTACT_ACTIVITY, List(), (contactActivityList :List) => contactActivityList.push(newContactActivity));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([ADD_CONTACT_ACTIVITY, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_CONTACT_ACTIVITY, REQUEST_STATE], RequestStates.FAILURE),
  });
}
