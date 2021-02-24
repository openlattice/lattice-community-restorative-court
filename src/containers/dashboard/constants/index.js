// @flow
import { OrderedMap } from 'immutable';

import { RoleConstants } from '../../profile/src/constants';

const { CASE_MANAGER, RESPONDENT } = RoleConstants;

const STAFF_CASES_TABLE_HEADERS = OrderedMap({
  STAFF: 'STAFF',
  PENDING_INTAKE: 'PENDING INTAKE',
  PENDING_CIRCLE: 'PENDING CIRCLE',
  RH_AGREEMENT_ESTABLISHED: 'RH AGREEMENT ESTABLISHED',
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

const CASE_RESULT_NUMBER :'Case Number' = 'Case Number';

const CASES_RESULT_LABELS = OrderedMap({
  [CASE_RESULT_NUMBER]: CASE_RESULT_NUMBER,
  [RESPONDENT]: RESPONDENT,
  [CASE_MANAGER]: CASE_MANAGER,
});

export {
  CASES_RESULT_LABELS,
  CASES_STATS_CONSTANTS,
  CASE_RESULT_NUMBER,
  STAFF_CASES_TABLE_HEADERS,
};
