// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { DashboardReduxConstants, REQUEST_STATE } from '../../../core/redux/constants';
import { getPersonName } from '../../../utils/people';
import { ADD_STAFF, addStaff } from '../actions';
import { STAFF_CASES_TABLE_HEADERS } from '../constants';

const { STAFF_CASES_DATA } = DashboardReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return addStaff.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_STAFF, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_STAFF, action.id], action),
    SUCCESS: () => {
      const newStaffMemberName = getPersonName(action.value);
      const tableRow = Map({
        [STAFF_CASES_TABLE_HEADERS.get('STAFF')]: newStaffMemberName,
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_INTAKE')]: 0,
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_CIRCLE')]: 0,
        [STAFF_CASES_TABLE_HEADERS.get('RH_AGREEMENT_COMPLETED')]: 0,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_OPEN_CASES')]: 0,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_SUCCESSFUL_CASES')]: 0,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_UNSUCCESSFUL_CASES')]: 0,
      });
      let staffCasesData = state.get(STAFF_CASES_DATA);
      staffCasesData = staffCasesData.insert(staffCasesData.count() - 2, tableRow);
      return state
        .set(STAFF_CASES_DATA, staffCasesData)
        .setIn([ADD_STAFF, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_STAFF, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_STAFF, action.id]),
  });
}
