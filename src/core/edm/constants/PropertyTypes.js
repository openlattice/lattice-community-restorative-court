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
  INTERESTS_AND_HOBBIES: FQN.of('ol.interestsandhobbies'),
  LANGUAGE: FQN.of('ol.language'),
  NAME: FQN.of('ol.name'),
  OL_DATE_TIME: FQN.of('ol.datetime'),
  OL_ID: FQN.of('ol.id'),
  OUTCOME: FQN.of('ol.outcome'),
  PRONOUN: FQN.of('ol.pronoun'),
  RELIGION: FQN.of('ol.religion'),
  ROLE: FQN.of('ol.role'),
  SOURCE: FQN.of('ol.source'),
  STATUS: FQN.of('ol.status'),
  SURNAME: FQN.of('nc.PersonSurName'),
  TEXT: FQN.of('ol.text'),
  TYPE: FQN.of('ol.type'),
};

export default PROPERTY_TYPE_FQNS;
