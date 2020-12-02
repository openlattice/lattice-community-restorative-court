// @flow
import { Map, getIn } from 'immutable';
import type { UUID } from 'lattice';

const getNeighborESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['neighborEntitySet', 'id']);

export { getNeighborESID };
