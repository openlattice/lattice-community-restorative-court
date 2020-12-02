// @flow
import { Map, fromJS } from 'immutable';

import selectRepairHarmAgreementReducer from './selectRepairHarmAgreementReducer';
import submitRepairHarmAgreementReducer from './submitRepairHarmAgreementReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE, RepairHarmReduxConstants } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { SELECT_REPAIR_HARM_AGREEMENT, SUBMIT_REPAIR_HARM_AGREEMENT, submitRepairHarmAgreement } from '../actions';

const { SELECTED_REPAIR_HARM_AGREEMENT } = RepairHarmReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [SUBMIT_REPAIR_HARM_AGREEMENT]: RS_INITIAL_STATE,
  // data
  [SELECTED_REPAIR_HARM_AGREEMENT]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case SELECT_REPAIR_HARM_AGREEMENT: {
      return selectRepairHarmAgreementReducer(state, action);
    }

    case submitRepairHarmAgreement.case(action.type): {
      return submitRepairHarmAgreementReducer(state, action);
    }

    default:
      return state;
  }
}
