// @flow
import { Map, get, getIn } from 'immutable';

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'neighborDetails');

const getNeighborESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['neighborEntitySet', 'id']);

export {
  getNeighborDetails,
  getNeighborESID,
};
