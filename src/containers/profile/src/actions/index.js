// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PERSON :'GET_PERSON' = 'GET_PERSON';
const getPerson :RequestSequence = newRequestSequence(GET_PERSON);

const GET_PERSON_CASE_NEIGHBORS :'GET_PERSON_CASE_NEIGHBORS' = 'GET_PERSON_CASE_NEIGHBORS';
const getPersonCaseNeighbors :RequestSequence = newRequestSequence(GET_PERSON_CASE_NEIGHBORS);

const GET_PERSON_NEIGHBORS :'GET_PERSON_NEIGHBORS' = 'GET_PERSON_NEIGHBORS';
const getPersonNeighbors :RequestSequence = newRequestSequence(GET_PERSON_NEIGHBORS);

const LOAD_PROFILE :'LOAD_PROFILE' = 'LOAD_PROFILE';
const loadProfile :RequestSequence = newRequestSequence(LOAD_PROFILE);

export {
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  LOAD_PROFILE,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  loadProfile,
};
