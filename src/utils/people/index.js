// @flow
import { Map } from 'immutable';

import { PropertyTypes } from '../../core/edm/constants';
import { getPropertyValuesLU } from '../data';

const { GIVEN_NAME, SURNAME } = PropertyTypes;

const getPersonName = (person :Map) => {
  const { [GIVEN_NAME]: firstName, [SURNAME]: lastName } = getPropertyValuesLU(person, [GIVEN_NAME, SURNAME]);
  return `${firstName} ${lastName}`;
};

export {
  getPersonName,
};
