// @flow
import { Map, get } from 'immutable';

const getAssociationDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'associationDetails');

export { getAssociationDetails };
