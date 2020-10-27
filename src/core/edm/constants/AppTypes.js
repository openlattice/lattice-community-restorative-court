// @flow

import { Models } from 'lattice';

const { FQN } = Models;

const APP_TYPE_FQNS = {
  CASE: FQN.of('app.case'),
  HAS: FQN.of('app.has'),
  PEOPLE: FQN.of('app.people'),
  ROLE: FQN.of('app.role'),
  STATUS: FQN.of('app.enrollmentstatus'),
};

export default APP_TYPE_FQNS;
