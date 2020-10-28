/*
 * @flow
 */

import { Models } from 'lattice';

const { FQN } = Models;

const PROPERTY_TYPE_FQNS = {
  CONTACT_DATETIME: FQN.of('ol.contactdatetime'),
  DATETIME_ADMINISTERED: FQN.of('ol.datetimeadministered'),
  DATETIME_START: FQN.of('ol.datetimestart'),
  DESCRIPTION: FQN.of('ol.description'),
  DOB: FQN.of('nc.PersonBirthDate'),
  EFFECTIVE_DATE: FQN.of('ol.effectivedate'),
  GIVEN_NAME: FQN.of('nc.PersonGivenName'),
  NAME: FQN.of('ol.name'),
  OL_DATE_TIME: FQN.of('ol.datetime'),
  OL_ID: FQN.of('ol.id'),
  OUTCOME: FQN.of('ol.outcome'),
  SOURCE: FQN.of('ol.source'),
  SURNAME: FQN.of('nc.PersonSurName'),
  TYPE: FQN.of('ol.type'),
};

export default PROPERTY_TYPE_FQNS;
