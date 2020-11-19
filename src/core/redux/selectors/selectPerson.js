// @flow
import { Map } from 'immutable';
import type { UUID } from 'lattice';

import { ProfileReduxConstants } from '../constants';

const { PERSON, PROFILE } = ProfileReduxConstants;

export default function selectPerson() {

  return (state :Map) :?UUID => state.getIn([PROFILE, PERSON]);
}
