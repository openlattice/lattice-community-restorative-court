// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_CASES :'DOWNLOAD_CASES' = 'DOWNLOAD_CASES';
const downloadCases :RequestSequence = newRequestSequence(DOWNLOAD_CASES);

const DOWNLOAD_PEACEMAKERS :'DOWNLOAD_PEACEMAKERS' = 'DOWNLOAD_PEACEMAKERS';
const downloadPeacemakers :RequestSequence = newRequestSequence(DOWNLOAD_PEACEMAKERS);

const DOWNLOAD_REFERRALS :'DOWNLOAD_REFERRALS' = 'DOWNLOAD_REFERRALS';
const downloadReferrals :RequestSequence = newRequestSequence(DOWNLOAD_REFERRALS);

export {
  DOWNLOAD_CASES,
  DOWNLOAD_PEACEMAKERS,
  DOWNLOAD_REFERRALS,
  downloadCases,
  downloadPeacemakers,
  downloadReferrals,
};
