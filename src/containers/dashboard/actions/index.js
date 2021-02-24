// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_STAFF :'ADD_STAFF' = 'ADD_STAFF';
const addStaff :RequestSequence = newRequestSequence(ADD_STAFF);

const GET_CASES_STATS :'GET_CASES_STATS' = 'GET_CASES_STATS';
const getCasesStats :RequestSequence = newRequestSequence(GET_CASES_STATS);

const GET_STAFF_CASES_DATA :'GET_STAFF_CASES_DATA' = 'GET_STAFF_CASES_DATA';
const getStaffCasesData :RequestSequence = newRequestSequence(GET_STAFF_CASES_DATA);

const SEARCH_CASES :'SEARCH_CASES' = 'SEARCH_CASES';
const searchCases :RequestSequence = newRequestSequence(SEARCH_CASES);

export {
  ADD_STAFF,
  GET_CASES_STATS,
  GET_STAFF_CASES_DATA,
  SEARCH_CASES,
  addStaff,
  getCasesStats,
  getStaffCasesData,
  searchCases,
};
