// @flow
import { Map } from 'immutable';

import { ProfileReduxConstants } from '../../../../core/redux/constants';

const { SELECTED_CASE } = ProfileReduxConstants;

export default function reducer(state :Map, action :Object) {

  return state.set(SELECTED_CASE, action.value);

}
