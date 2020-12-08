// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_CASE_STATUS :'ADD_CASE_STATUS' = 'ADD_CASE_STATUS';
const addCaseStatus :RequestSequence = newRequestSequence(ADD_CASE_STATUS);

const ADD_CONTACT_ACTIVITY :'ADD_CONTACT_ACTIVITY' = 'ADD_CONTACT_ACTIVITY';
const addContactActivity :RequestSequence = newRequestSequence(ADD_CONTACT_ACTIVITY);

const ADD_PERSON_TO_CASE :'ADD_PERSON_TO_CASE' = 'ADD_PERSON_TO_CASE';
const addPersonToCase :RequestSequence = newRequestSequence(ADD_PERSON_TO_CASE);

const CLEAR_SEARCHED_PEOPLE :'CLEAR_SEARCHED_PEOPLE' = 'CLEAR_SEARCHED_PEOPLE';
const clearSearchedPeople = () => ({
  type: CLEAR_SEARCHED_PEOPLE
});

const EDIT_CONTACT :'EDIT_CONTACT' = 'EDIT_CONTACT';
const editContact :RequestSequence = newRequestSequence(EDIT_CONTACT);

const EDIT_PERSON :'EDIT_PERSON' = 'EDIT_PERSON';
const editPerson :RequestSequence = newRequestSequence(EDIT_PERSON);

const EDIT_PERSON_DETAILS :'EDIT_PERSON_DETAILS' = 'EDIT_PERSON_DETAILS';
const editPersonDetails :RequestSequence = newRequestSequence(EDIT_PERSON_DETAILS);

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

const SEARCH_PEOPLE :'SEARCH_PEOPLE' = 'SEARCH_PEOPLE';
const searchPeople :RequestSequence = newRequestSequence(SEARCH_PEOPLE);

const SELECT_CASE :'SELECT_CASE' = 'SELECT_CASE';
const selectCase = (value :any) => ({
  type: SELECT_CASE,
  value
});

const SUBMIT_CONTACT :'SUBMIT_CONTACT' = 'SUBMIT_CONTACT';
const submitContact :RequestSequence = newRequestSequence(SUBMIT_CONTACT);

export {
  ADD_CASE_STATUS,
  ADD_CONTACT_ACTIVITY,
  ADD_PERSON_TO_CASE,
  CLEAR_SEARCHED_PEOPLE,
  EDIT_CONTACT,
  EDIT_PERSON,
  EDIT_PERSON_DETAILS,
  GET_PERSON,
  GET_PERSON_CASE_NEIGHBORS,
  GET_PERSON_NEIGHBORS,
  GET_STAFF,
  LOAD_PROFILE,
  SEARCH_PEOPLE,
  SELECT_CASE,
  SUBMIT_CONTACT,
  addCaseStatus,
  addContactActivity,
  addPersonToCase,
  clearSearchedPeople,
  editContact,
  editPerson,
  editPersonDetails,
  getPerson,
  getPersonCaseNeighbors,
  getPersonNeighbors,
  getStaff,
  loadProfile,
  searchPeople,
  selectCase,
  submitContact,
};
