// @flow
import { Map } from 'immutable';
import { Models } from 'lattice';

import { APP_PATHS, ENTITY_SET_ID } from '../../../containers/app/constants';

const { FQN } = Models;

export default function selectEntitySetId(appType :FQN) {

  return (state :Map) :?UUID => state.getIn(APP_PATHS.APP_CONFIG.concat([appType, ENTITY_SET_ID]));
}
