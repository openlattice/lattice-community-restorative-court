// @flow
import { Map } from 'immutable';
import { Models } from 'lattice';

import { APP_PATHS, APP_REDUX_CONSTANTS } from '../constants';

const { FQN } = Models;
const { ENTITY_SET_ID } = APP_REDUX_CONSTANTS;

export default function selectEntitySetId(appType :FQN) {

  return (state :Map) :?UUID => state.getIn(APP_PATHS.APP_CONFIG.concat([appType, ENTITY_SET_ID]));
}
