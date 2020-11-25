// @flow
import { Map } from 'immutable';

import { IntakeReduxConstants } from '../../../core/redux/constants';

const { SELECTED_INTAKE } = IntakeReduxConstants;

export default function reducer(state :Map, action :Object) {

  const { value } = action;
  const selectedForm :Map = value;
  return state
    .set(SELECTED_INTAKE, selectedForm);

}
