// @flow
import { Map } from 'immutable';

import { ProfileReduxConstants } from '../../../../core/redux/constants';

const { SELECTED_CASE } = ProfileReduxConstants;

export default function reducer(state :Map, action :Object) {

  const { value } = action;
  const selectedCase :Map = value;
  return state
    .set(SELECTED_CASE, selectedCase);

}
