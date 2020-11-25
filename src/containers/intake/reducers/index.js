// @flow
import { Map, fromJS } from 'immutable';

import selectIntakeReducer from './selectIntakeReducer';
import submitIntakeReducer from './submitIntakeReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { IntakeReduxConstants, RS_INITIAL_STATE } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { SELECT_INTAKE, SUBMIT_INTAKE, submitIntake } from '../actions';

const { SELECTED_INTAKE } = IntakeReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [SUBMIT_INTAKE]: RS_INITIAL_STATE,
  // data
  [SELECTED_INTAKE]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case SELECT_INTAKE: {
      return selectIntakeReducer(state, action);
    }

    case submitIntake.case(action.type): {
      return submitIntakeReducer(state, action);
    }

    default:
      return state;
  }
}
