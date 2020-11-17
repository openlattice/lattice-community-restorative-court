// @flow

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  APPEARS_IN: FQN.of('app.appearsin'),
  CASE: FQN.of('app.case'),
  CONTACT_ACTIVITY: FQN.of('app.contactactivity'),
  FORM: FQN.of('app.form'),
  HAS: FQN.of('app.has'),
  PEOPLE: FQN.of('app.people'),
  RECORDED_BY: FQN.of('app.recordedby'),
  REFERRAL_REQUEST: FQN.of('app.referralrequest'),
  ROLE: FQN.of('app.role'),
  SENT_TO: FQN.of('app.sentto'),
  STAFF: FQN.of('app.staff'),
  STATUS: FQN.of('app.status'),
};

export default APP_TYPE_FQNS;
