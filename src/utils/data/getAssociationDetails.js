// @flow
import { Map, get } from 'immutable';

const getAssociationDetails = (neighbor :Map | Object) :Map | Object => get(neighbor, 'associationDetails');

/* eslint-disable import/prefer-default-export */
export { getAssociationDetails };
