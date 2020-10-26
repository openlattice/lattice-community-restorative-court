/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { Models } from 'lattice';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

const { FQN } = Models;

export const {
  APP,
  AUTH,
  DATA,
  EDM,
  ENTITY_SETS,
  ENTITY_SETS_INDEX_MAP,
  ENTITY_TYPES,
  ENTITY_TYPES_INDEX_MAP,
  ERROR,
  MEMBERS,
  ORGANIZATIONS,
  ORGS,
  PERMISSIONS,
  PROPERTY_TYPES,
  PROPERTY_TYPES_INDEX_MAP,
  REQUEST_STATE,
  USERS,
} = ReduxConstants;

export const SEARCH_RESULTS :'searchResults' = 'searchResults';

// TODO: does this belong here?
export const INITIAL_SEARCH_RESULTS :Map = fromJS({ initial: true });

// TODO: does this belong here?
export const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};

/*
 * Entity FQNs
 */

export const CASE = FQN.of('app.case');
export const HAS = FQN.of('app.has');
export const PEOPLE = FQN.of('app.people');
export const STATUS = FQN.of('app.enrollmentstatus');
export const ROLE = FQN.of('app.role');
