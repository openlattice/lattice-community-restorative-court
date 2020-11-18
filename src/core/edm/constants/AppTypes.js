// @flow

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  APPEARS_IN: FQN.of('app.appearsin'),
  CASE: FQN.of('app.case'),
  CHARGE: FQN.of('app.charge'),
  CHARGE_EVENT: FQN.of('app.chargeevent'),
  CONTACT_ACTIVITY: FQN.of('app.contactactivity'),
  FORM: FQN.of('app.form'),
  HAS: FQN.of('app.has'),
  OFFICERS: FQN.of('app.officers'),
  PEOPLE: FQN.of('app.people'),
  PERSON_DETAILS: FQN.of('app.persondetails'),
  RECORDED_BY: FQN.of('app.recordedby'),
  REFERRAL_REQUEST: FQN.of('app.referralrequest'),
  ROLE: FQN.of('app.role'),
  SENT_FROM: FQN.of('app.sentfrom'),
  SENT_TO: FQN.of('app.sentto'),
  STAFF: FQN.of('app.staff'),
  STATUS: FQN.of('app.status'),
};

export default APP_TYPE_FQNS;
