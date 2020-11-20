// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_CRC_PEOPLE :'GET_CRC_PEOPLE' = 'GET_CRC_PEOPLE';
const getCRCPeople :RequestSequence = newRequestSequence(GET_CRC_PEOPLE);

const SUBMIT_REFERRAL_FORM :'SUBMIT_REFERRAL_FORM' = 'SUBMIT_REFERRAL_FORM';
const submitReferralForm :RequestSequence = newRequestSequence(SUBMIT_REFERRAL_FORM);

export {
  GET_CRC_PEOPLE,
  SUBMIT_REFERRAL_FORM,
  getCRCPeople,
  submitReferralForm,
};
