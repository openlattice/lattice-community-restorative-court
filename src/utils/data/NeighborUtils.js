// @flow
import { Map, get, getIn } from 'immutable';
import type { UUID } from 'lattice';

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'neighborDetails');

const getAssociationDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'associationDetails');

const getNeighborESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['neighborEntitySet', 'id']);

const getAssociationESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['associationEntitySet', 'id']);

export {
  getAssociationDetails,
  getAssociationESID,
  getNeighborDetails,
  getNeighborESID,
};
