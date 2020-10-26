// @flow
import { Map, getIn } from 'immutable';
import { Models } from 'lattice';

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

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => getIn(neighbor, 'neighborDetails');

const getNeighborESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['neighborEntitySet', 'id']);

export {
  getNeighborDetails,
  getNeighborESID,
  getPropertyValue,
  getPropertyValues,
};
