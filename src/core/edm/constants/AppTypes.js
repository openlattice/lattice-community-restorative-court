// @flow

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  AGENCY: FQN.of('app.agency'),
  APPEARS_IN: FQN.of('app.appearsin'),
  COMMUNICATION: FQN.of('app.communication'),
  CONTACTED_VIA: FQN.of('app.contactedvia'),
  CONTACT_ACTIVITY: FQN.of('app.contactactivity'),
  CONTACT_INFO: FQN.of('app.contactinformation'),
  CRC_CASE: FQN.of('app.crccase'),
  DA_CASE: FQN.of('app.dacase'),
  ELECTRONIC_SIGNATURE: FQN.of('app.electronicsignature'),
  EMPLOYEE: FQN.of('app.employee'),
  FORM: FQN.of('app.form'),
  HAS: FQN.of('app.has'),
  INCLUDES: FQN.of('app.includes'),
  IS: FQN.of('app.is'),
  LOCATED_AT: FQN.of('app.locatedat'),
  LOCATION: FQN.of('app.location'),
  OFFENSE: FQN.of('app.offense'),
  OFFICERS: FQN.of('app.officers'),
  PAYMENT: FQN.of('app.payment'),
  PEOPLE: FQN.of('app.people'),
  PERSON_DETAILS: FQN.of('app.persondetails'),
  RECORDED_BY: FQN.of('app.recordedby'),
  REFERRAL_REQUEST: FQN.of('app.referralrequest'),
  REGISTERED_FOR: FQN.of('app.registeredfor'),
  RELATED_TO: FQN.of('app.relatedto'),
  RESULTS_IN: FQN.of('app.resultsin'),
  SCREENED_WITH: FQN.of('app.screenedwith'),
  SENT_FROM: FQN.of('app.sentfrom'),
  SENT_TO: FQN.of('app.sentto'),
  SETTINGS: FQN.of('app.settings'),
  SIGNED_BY: FQN.of('app.signedby'),
  STAFF: FQN.of('app.staff'),
  STATUS: FQN.of('app.status'),
  SUBJECT_OF: FQN.of('app.subjectof'),
  WORKS_AT: FQN.of('app.worksat'),
};

export default APP_TYPE_FQNS;
