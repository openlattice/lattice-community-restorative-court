/*
 * @flow
 */

import { FormConstants } from '../../containers/profile/src/constants';

const { INTAKE_FORM, PEACEMAKER_INFORMATION_FORM, REFERRAL_FORM } = FormConstants;

const ROOT :'/' = '/';

const PERSON_ID :string = ':personId';
const FORM_ID :string = ':formId';
const CASE_ID :string = ':caseId';

const EDIT_PROFILE_CONTAINER_ROUTE_END :string = `${PERSON_ID}/edit`;

const ADD_PEOPLE_TO_CASE :string = `${CASE_ID}/addpeopletocase`;

const INTAKE :string = 'intake';
const INTAKE_ROUTE_END :string = `${PERSON_ID}/${INTAKE}`;

const COMPLETED_INTAKE :string = 'intake';
const COMPLETED_INTAKE_ROUTE_END :string = `${PERSON_ID}/${INTAKE}/${FORM_ID}`;

const PEACEMAKER_INFORMATION :string = 'peacemakerinformation';
const PEACEMAKER_INFORMATION_ROUTE_END :string = `${PERSON_ID}/${PEACEMAKER_INFORMATION}`;

const REFERRAL :string = 'referral';
const REFERRAL_ROUTE_END :string = `${PERSON_ID}/${REFERRAL}`;

const COMPLETED_REFERRAL :string = 'completedreferral';
const COMPLETED_REFERRAL_ROUTE_END :string = `${PERSON_ID}/${COMPLETED_REFERRAL}/${FORM_ID}`;

const REPAIR_HARM_AGREEMENT :string = 'repairharmagreement';
const REPAIR_HARM_AGREEMENT_ROUTE_END :string = `${PERSON_ID}/${REPAIR_HARM_AGREEMENT}`;

const COMPLETED_REPAIR_HARM_AGREEMENT :string = 'completedrepairharmagreement';
const COMPLETED_REPAIR_HARM_AGREEMENT_ROUTE_END :string = `${PERSON_ID}/${COMPLETED_REPAIR_HARM_AGREEMENT}`;

const RESTITUTION_REFERRAL :string = 'restitutionreferral';
const RESTITUTION_REFERRAL_ROUTE_END :string = `${PERSON_ID}/${RESTITUTION_REFERRAL}`;

const COMPLETED_RESTITUTION_REFERRAL :string = 'completedrestitutionreferral';
const COMPLETED_RESTITUTION_REFERRAL_ROUTE_END :string = `${PERSON_ID}/${COMPLETED_RESTITUTION_REFERRAL}`;

const ROUTES_FOR_COMPLETED_FORMS = {
  [FormConstants.REPAIR_HARM_AGREEMENT]: COMPLETED_REPAIR_HARM_AGREEMENT_ROUTE_END,
  [INTAKE_FORM]: COMPLETED_INTAKE_ROUTE_END,
  [PEACEMAKER_INFORMATION_FORM]: PEACEMAKER_INFORMATION_ROUTE_END,
  [REFERRAL_FORM]: COMPLETED_REFERRAL_ROUTE_END,
  [FormConstants.RESTITUTION_REFERRAL]: COMPLETED_RESTITUTION_REFERRAL_ROUTE_END,
};

export {
  ADD_PEOPLE_TO_CASE,
  CASE_ID,
  COMPLETED_INTAKE,
  COMPLETED_INTAKE_ROUTE_END,
  COMPLETED_REFERRAL,
  COMPLETED_REFERRAL_ROUTE_END,
  COMPLETED_REPAIR_HARM_AGREEMENT,
  COMPLETED_REPAIR_HARM_AGREEMENT_ROUTE_END,
  COMPLETED_RESTITUTION_REFERRAL,
  COMPLETED_RESTITUTION_REFERRAL_ROUTE_END,
  EDIT_PROFILE_CONTAINER_ROUTE_END,
  FORM_ID,
  INTAKE,
  INTAKE_ROUTE_END,
  PEACEMAKER_INFORMATION,
  PEACEMAKER_INFORMATION_ROUTE_END,
  PERSON_ID,
  REFERRAL,
  REFERRAL_ROUTE_END,
  REPAIR_HARM_AGREEMENT,
  REPAIR_HARM_AGREEMENT_ROUTE_END,
  RESTITUTION_REFERRAL,
  RESTITUTION_REFERRAL_ROUTE_END,
  ROOT,
  ROUTES_FOR_COMPLETED_FORMS,
};
