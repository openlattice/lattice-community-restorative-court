// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PERSON_CASES :'GET_PERSON_CASES' = 'GET_PERSON_CASES';
const getPersonCases :RequestSequence = newRequestSequence(GET_PERSON_CASES);

export {
  GET_PERSON_CASES,
  getPersonCases,
};
