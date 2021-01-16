// @flow
import { OrderedMap } from 'immutable';

const STAFF_CASES_TABLE_HEADERS = OrderedMap({
  STAFF: 'STAFF',
  PENDING_INTAKE: 'PENDING INTAKE',
  PENDING_CIRCLE: 'PENDING CIRCLE',
  RH_AGREEMENT_COMPLETED: 'RH AGREEMENT COMPLETED',
  TOTAL_OPEN_CASES: 'TOTAL OPEN CASES',
  TOTAL_SUCCESSFUL_CASES: 'TOTAL SUCCESSFUL CASES',
  TOTAL_UNSUCCESSFUL_CASES: 'TOTAL UNSUCCESSFUL CASES',
});

const CASES_STATS_CONSTANTS = {
  NO_CONTACT: 'No Contact Made',
  OPEN_CASES: 'Open Cases',
  RESPONDENT_DECLINED: 'Respondent Declined',
  SUCCESSFUL: 'Successful Cases',
  TERMINATED: 'Terminated Cases',
  TOTAL_CASES: 'Total Cases',
};

export {
  CASES_STATS_CONSTANTS,
  STAFF_CASES_TABLE_HEADERS,
};
