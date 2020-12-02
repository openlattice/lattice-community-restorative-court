/*
 * @flow
 */

const ROOT :'/' = '/';

const PERSON_ID :':personId' = ':personId';

const PEACEMAKER_INFORMATION :string = 'peacemakerinformation';
const PEACEMAKER_INFORMATION_ROUTE_END :string = `${PERSON_ID}/${PEACEMAKER_INFORMATION}`;

const REFERRAL :string = 'referral';
const REFERRAL_ROUTE_END :string = `${PERSON_ID}/${REFERRAL}`;

const FORM_ID :string = ':formId';
const COMPLETED_REFERRAL :string = 'completedreferral';
const COMPLETED_REFERRAL_ROUTE_END :string = `${PERSON_ID}/${COMPLETED_REFERRAL}/${FORM_ID}`;

export {
  COMPLETED_REFERRAL,
  COMPLETED_REFERRAL_ROUTE_END,
  FORM_ID,
  PEACEMAKER_INFORMATION,
  PEACEMAKER_INFORMATION_ROUTE_END,
  PERSON_ID,
  REFERRAL,
  REFERRAL_ROUTE_END,
  ROOT,
};
