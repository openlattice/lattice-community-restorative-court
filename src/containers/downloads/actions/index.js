// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const DOWNLOAD_REFERRALS_BY_AGENCY :'DOWNLOAD_REFERRALS_BY_AGENCY' = 'DOWNLOAD_REFERRALS_BY_AGENCY';
const downloadReferralsByAgency :RequestSequence = newRequestSequence(DOWNLOAD_REFERRALS_BY_AGENCY);

export {
  DOWNLOAD_REFERRALS_BY_AGENCY,
  downloadReferralsByAgency,
};
