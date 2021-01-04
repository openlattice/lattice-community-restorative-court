// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_CASES :'DOWNLOAD_CASES' = 'DOWNLOAD_CASES';
const downloadCases :RequestSequence = newRequestSequence(DOWNLOAD_CASES);

const DOWNLOAD_REFERRALS_BY_AGENCY :'DOWNLOAD_REFERRALS_BY_AGENCY' = 'DOWNLOAD_REFERRALS_BY_AGENCY';
const downloadReferralsByAgency :RequestSequence = newRequestSequence(DOWNLOAD_REFERRALS_BY_AGENCY);

export {
  DOWNLOAD_CASES,
  DOWNLOAD_REFERRALS_BY_AGENCY,
  downloadCases,
  downloadReferralsByAgency,
};
