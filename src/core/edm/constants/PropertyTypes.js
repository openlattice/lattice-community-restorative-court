/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  DOB: FQN.of('nc.PersonBirthDate'),
  EFFECTIVE_DATE: FQN.of('ol.effectivedate'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  OL_DATE_TIME: FQN.of('ol.datetime'),
  OL_ID: FQN.of('ol.id'),
  SURNAME: FQN.of('nc.PersonSurName'),
};

export default PROPERTY_TYPE_FQNS;
