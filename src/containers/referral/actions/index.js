// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_AGENCIES :'GET_AGENCIES' = 'GET_AGENCIES';
const getAgencies :RequestSequence = newRequestSequence(GET_AGENCIES);

const GET_CHARGES :'GET_CHARGES' = 'GET_CHARGES';
const getCharges :RequestSequence = newRequestSequence(GET_CHARGES);

const GET_CRC_PEOPLE :'GET_CRC_PEOPLE' = 'GET_CRC_PEOPLE';
const getCRCPeople :RequestSequence = newRequestSequence(GET_CRC_PEOPLE);

const GET_ORGANIZATIONS :'GET_ORGANIZATIONS' = 'GET_ORGANIZATIONS';
const getOrganizations :RequestSequence = newRequestSequence(GET_ORGANIZATIONS);

const GET_REFERRAL_REQUEST_NEIGHBORS :'GET_REFERRAL_REQUEST_NEIGHBORS' = 'GET_REFERRAL_REQUEST_NEIGHBORS';
const getReferralRequestNeighbors :RequestSequence = newRequestSequence(GET_REFERRAL_REQUEST_NEIGHBORS);

const SELECT_REFERRAL_FORM :'SELECT_REFERRAL_FORM' = 'SELECT_REFERRAL_FORM';
const selectReferralForm = (value :any) => ({
  type: SELECT_REFERRAL_FORM,
  value
});

const SUBMIT_REFERRAL_FORM :'SUBMIT_REFERRAL_FORM' = 'SUBMIT_REFERRAL_FORM';
const submitReferralForm :RequestSequence = newRequestSequence(SUBMIT_REFERRAL_FORM);

export {
  GET_AGENCIES,
  GET_CHARGES,
  GET_CRC_PEOPLE,
  GET_ORGANIZATIONS,
  GET_REFERRAL_REQUEST_NEIGHBORS,
  SELECT_REFERRAL_FORM,
  SUBMIT_REFERRAL_FORM,
  getAgencies,
  getCRCPeople,
  getCharges,
  getOrganizations,
  getReferralRequestNeighbors,
  selectReferralForm,
  submitReferralForm,
};
