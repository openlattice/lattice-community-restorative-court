// @flow

const APP_NAME = 'Community Restorative Court';

const APP :string = 'app';
const APP_CONFIG :string = 'appConfig';
const ENTITY_SET_ID :string = 'entitySetId';
const ENTITY_SET_IDS = 'entitySetIds';
const FQNS_BY_ESID :string = 'fqnsByESID';
const MATCH :string = 'match';
const ROOT :string = 'root';

const APP_PATHS = {
  APP_CONFIG: [APP, APP_CONFIG, 'config'],
  FQNS_BY_ESID: [APP, FQNS_BY_ESID],
  MATCH: [APP, MATCH],
  ROOT: [APP, ROOT],
};

const NEIGHBOR_DIRECTIONS = {
  DST: 'dst',
  SRC: 'src',
};

export {
  APP,
  APP_CONFIG,
  APP_NAME,
  APP_PATHS,
  ENTITY_SET_ID,
  ENTITY_SET_IDS,
  FQNS_BY_ESID,
  MATCH,
  NEIGHBOR_DIRECTIONS,
  ROOT,
};
