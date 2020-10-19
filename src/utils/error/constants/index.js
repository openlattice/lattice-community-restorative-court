// @flow

const ERR_ACTION_VALUE_NOT_DEFINED :Error = Error('invalid parameter: action.value is required and must be defined');
const ERR_ACTION_VALUE_TYPE :Error = Error('invalid parameter: action.value is the incorrect type');
const ERR_INVALID_ROUTE :Error = Error('invalid route: a route must be a non-empty string that starts with "/"');
const ERR_INVALID_UUID :Error = Error('invalid uuid');
const ERR_UNEXPECTED_STATE :Error = Error('unexpected state');
const ERR_WORKER_SAGA :Error = Error('caught exception in worker saga');

export {
  ERR_ACTION_VALUE_NOT_DEFINED,
  ERR_ACTION_VALUE_TYPE,
  ERR_INVALID_ROUTE,
  ERR_INVALID_UUID,
  ERR_UNEXPECTED_STATE,
  ERR_WORKER_SAGA,
};
