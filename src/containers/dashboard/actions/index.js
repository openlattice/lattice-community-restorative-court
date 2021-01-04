// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_STAFF_CASES_DATA :'GET_STAFF_CASES_DATA' = 'GET_STAFF_CASES_DATA';
const getStaffCasesData :RequestSequence = newRequestSequence(GET_STAFF_CASES_DATA);

export {
  GET_STAFF_CASES_DATA,
  getStaffCasesData,
};
