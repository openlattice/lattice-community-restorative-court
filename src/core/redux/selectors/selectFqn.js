// @flow
import { Map } from 'immutable';
import { Models } from 'lattice';

import { APP_PATHS } from '../constants';

const { FQN } = Models;

export default function selectFqn(entitySetId :UUID) {

  return (state :Map) :?FQN => state.getIn(APP_PATHS.FQNS_BY_ESID.concat([entitySetId]));
}
