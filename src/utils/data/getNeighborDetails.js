// @flow
import { Map, get } from 'immutable';

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'neighborDetails');

export { getNeighborDetails };
