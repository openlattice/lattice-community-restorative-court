/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import * as DashboardReduxConstants from './DashboardReduxConstants';
import * as DownloadsReduxConstants from './DownloadsReduxConstants';
import * as IntakeReduxConstants from './IntakeReduxConstants';
import * as ProfileReduxConstants from './ProfileReduxConstants';
import * as ReferralReduxConstants from './ReferralReduxConstants';
import * as RepairHarmReduxConstants from './RepairHarmReduxConstants';
import * as RestitutionReferralReduxConstants from './RestitutionReferralReduxConstants';

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

const SEARCH_RESULTS :'searchResults' = 'searchResults';
const NEIGHBOR_DIRECTIONS = {
  DST: 'dst',
  SRC: 'src',
};

// TODO: does this belong here?
const INITIAL_SEARCH_RESULTS :Map = fromJS({ initial: true });

// TODO: does this belong here?
const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};

const PROPERTY_TYPE_IDS :string = 'propertyTypeIds';
const PROPERTY_FQNS_BY_TYPE_ID :string = 'propertyFqnsByTypeId';

// App

const APP_REDUX_CONSTANTS = {
  APP: 'app',
  APP_CONFIG: 'appConfig',
  ENTITY_SET_ID: 'entitySetId',
  ENTITY_SET_IDS: 'entitySetIds',
  FQNS_BY_ESID: 'fqnsByESID',
  MATCH: 'match',
  ROOT: 'root',
};

const APP_PATHS = {
  APP_CONFIG: [APP, APP_REDUX_CONSTANTS.APP_CONFIG, 'config'],
  FQNS_BY_ESID: [APP, APP_REDUX_CONSTANTS.FQNS_BY_ESID],
  MATCH: [APP, APP_REDUX_CONSTANTS.MATCH],
  ROOT: [APP, APP_REDUX_CONSTANTS.ROOT],
};

export {
  APP_PATHS,
  APP_REDUX_CONSTANTS,
  DashboardReduxConstants,
  DownloadsReduxConstants,
  INITIAL_SEARCH_RESULTS,
  IntakeReduxConstants,
  NEIGHBOR_DIRECTIONS,
  PROPERTY_FQNS_BY_TYPE_ID,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
  RS_INITIAL_STATE,
  ReferralReduxConstants,
  RepairHarmReduxConstants,
  RestitutionReferralReduxConstants,
  SEARCH_RESULTS,
};
