// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_CRC_PEOPLE :'GET_CRC_PEOPLE' = 'GET_CRC_PEOPLE';
const getCRCPeople :RequestSequence = newRequestSequence(GET_CRC_PEOPLE);

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
  GET_CRC_PEOPLE,
  GET_REFERRAL_REQUEST_NEIGHBORS,
  SELECT_REFERRAL_FORM,
  SUBMIT_REFERRAL_FORM,
  getCRCPeople,
  getReferralRequestNeighbors,
  selectReferralForm,
  submitReferralForm,
};
