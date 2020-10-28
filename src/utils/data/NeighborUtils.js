// @flow
import { Map, getIn } from 'immutable';

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => getIn(neighbor, 'neighborDetails');

const getNeighborESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['neighborEntitySet', 'id']);

export {
  getNeighborDetails,
  getNeighborESID,
};
