// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SELECT_RESTITUTION_REFERRAL :'SELECT_RESTITUTION_REFERRAL' = 'SELECT_RESTITUTION_REFERRAL';
const selectRestitutionReferral = (value :any) => ({
  type: SELECT_RESTITUTION_REFERRAL,
  value
});

const SUBMIT_RESTITUTION_REFERRAL :'SUBMIT_RESTITUTION_REFERRAL' = 'SUBMIT_RESTITUTION_REFERRAL';
const submitRestitutionReferral :RequestSequence = newRequestSequence(SUBMIT_RESTITUTION_REFERRAL);

export {
  SELECT_RESTITUTION_REFERRAL,
  SUBMIT_RESTITUTION_REFERRAL,
  selectRestitutionReferral,
  submitRestitutionReferral,
};
