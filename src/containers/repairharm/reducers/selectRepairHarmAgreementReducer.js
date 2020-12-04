// @flow
import { Map } from 'immutable';

import { RepairHarmReduxConstants } from '../../../core/redux/constants';

const { SELECTED_REPAIR_HARM_AGREEMENT } = RepairHarmReduxConstants;

export default function reducer(state :Map, action :Object) {

  const { value } = action;
  const selectedForm :Map = value;
  return state
    .set(SELECTED_REPAIR_HARM_AGREEMENT, selectedForm);

}
