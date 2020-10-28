// @flow
import { Map, getIn, set } from 'immutable';
import { Models } from 'lattice';

import * as NeighborUtils from './NeighborUtils';

const { FQN } = Models;

const getPropertyValue = (
  entity :Map | Object,
  fqn :FQN | string,
  defaultValue ? :string = ''
) :any => getIn(entity, [fqn, 0], defaultValue);

const getPropertyValues = (
  entity :Map | Object,
  fqns :any[],
  defaultValue ? :string = ''
) :any[] => fqns.map((fqn :FQN | string) => getPropertyValue(entity, fqn, defaultValue));

const getPropertyValuesLU = (
  entity :Map | Object,
  fqns :Array<FQN | string>,
  fallback ?:boolean | number | string = '',
) :Object => {

  let propertyValues = {};

  fqns.forEach((fqn :FQN | string) => {
    const value = getPropertyValue(entity, fqn, fallback);
    propertyValues = set(propertyValues, fqn, value);
  });
  return propertyValues;
};

export {
  NeighborUtils,
  getPropertyValue,
  getPropertyValues,
  getPropertyValuesLU,
};
