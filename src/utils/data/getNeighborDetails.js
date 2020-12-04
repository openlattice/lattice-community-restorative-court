// @flow
import { Map, get } from 'immutable';

const getNeighborDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'neighborDetails');

/* eslint-disable import/prefer-default-export */
export { getNeighborDetails };
