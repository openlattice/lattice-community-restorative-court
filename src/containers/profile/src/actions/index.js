// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_CASE_STATUS :'ADD_CASE_STATUS' = 'ADD_CASE_STATUS';
const addCaseStatus :RequestSequence = newRequestSequence(ADD_CASE_STATUS);

const ADD_CONTACT_ACTIVITY :'ADD_CONTACT_ACTIVITY' = 'ADD_CONTACT_ACTIVITY';
const addContactActivity :RequestSequence = newRequestSequence(ADD_CONTACT_ACTIVITY);

const GET_FORM_NEIGHBORS :'GET_FORM_NEIGHBORS' = 'GET_FORM_NEIGHBORS';
const getFormNeighbors :RequestSequence = newRequestSequence(GET_FORM_NEIGHBORS);

const GET_PERSON :'GET_PERSON' = 'GET_PERSON';
const getPerson :RequestSequence = newRequestSequence(GET_PERSON);

const GET_PERSON_CASE_NEIGHBORS :'GET_PERSON_CASE_NEIGHBORS' = 'GET_PERSON_CASE_NEIGHBORS';
const getPersonCaseNeighbors :RequestSequence = newRequestSequence(GET_PERSON_CASE_NEIGHBORS);

const GET_PERSON_NEIGHBORS :'GET_PERSON_NEIGHBORS' = 'GET_PERSON_NEIGHBORS';
const getPersonNeighbors :RequestSequence = newRequestSequence(GET_PERSON_NEIGHBORS);

const GET_STAFF :'GET_STAFF' = 'GET_STAFF';
const getStaff :RequestSequence = newRequestSequence(GET_STAFF);

const LOAD_PROFILE :'LOAD_PROFILE' = 'LOAD_PROFILE';
const loadProfile :RequestSequence = newRequestSequence(LOAD_PROFILE);

export {
  ADD_CASE_STATUS,
  ADD_CONTACT_ACTIVITY,
  GET_FORM_NEIGHBORS,
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  GET_STAFF,
  LOAD_PROFILE,
  addCaseStatus,
  addContactActivity,
  getFormNeighbors,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  getStaff,
  loadProfile,
};
