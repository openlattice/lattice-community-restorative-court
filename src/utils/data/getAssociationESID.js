// @flow
import { Map, getIn } from 'immutable';
import type { UUID } from 'lattice';

const getAssociationESID = (neighbor :Map | Object) :UUID => getIn(neighbor, ['associationEntitySet', 'id']);

export { getAssociationESID };
