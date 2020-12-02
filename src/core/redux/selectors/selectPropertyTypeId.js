// @flow
import { Map } from 'immutable';
import { Models } from 'lattice';
import type { UUID } from 'lattice';

import { EDM, PROPERTY_TYPE_IDS } from '../constants';

const { FQN } = Models;

export default function selectPropertyTypeId(propertyType :FQN) {

  return (state :Map) :?UUID => state.getIn([EDM, PROPERTY_TYPE_IDS, propertyType]);
}
