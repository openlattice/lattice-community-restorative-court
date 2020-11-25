// @flow
import { Map, fromJS } from 'immutable';

import submitIntakeReducer from './submitIntakeReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { SUBMIT_INTAKE, submitIntake } from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [SUBMIT_INTAKE]: RS_INITIAL_STATE,
  // data
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case submitIntake.case(action.type): {
      return submitIntakeReducer(state, action);
    }

    default:
      return state;
  }
}
