// @flow

import { List, Map } from 'immutable';

import { ProfileReduxConstants } from '../../../../core/redux/constants';

const { SEARCHED_PEOPLE } = ProfileReduxConstants;

export default function reducer(state :Map) {
  return state
    .set(SEARCHED_PEOPLE, List());
}
