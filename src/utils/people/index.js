// @flow
import { Map } from 'immutable';
import { DataUtils } from 'lattice-utils';

import { PropertyTypes } from '../../core/edm/constants';

const { getPropertyValue } = DataUtils;
const { GIVEN_NAME, SURNAME } = PropertyTypes;

const getPersonName = (person :Map) => {
  const firstName = getPropertyValue(person, [GIVEN_NAME, 0]);
  const lastName = getPropertyValue(person, [SURNAME, 0]);
  return `${firstName} ${lastName}`;
};

/* eslint-disable import/prefer-default-export */
export {
  getPersonName,
};
