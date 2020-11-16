// @flow

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  APPEARS_IN: FQN.of('app.appearsin'),
  CASE: FQN.of('app.case'),
  FORM: FQN.of('app.form'),
  HAS: FQN.of('app.has'),
  PEOPLE: FQN.of('app.people'),
  RECORDED_BY: FQN.of('app.recordedby'),
  REFERRAL_REQUEST: FQN.of('app.referralrequest'),
  ROLE: FQN.of('app.role'),
  STAFF: FQN.of('app.staff'),
  STATUS: FQN.of('app.status'),
};

export default APP_TYPE_FQNS;
