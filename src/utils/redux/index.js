// @flow
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

const requestIsPending = (requestState :RequestState | void) :boolean => requestState === RequestStates.PENDING;
const requestIsSuccess = (requestState :RequestState | void) :boolean => requestState === RequestStates.SUCCESS;
const requestIsFailure = (requestState :RequestState | void) :boolean => requestState === RequestStates.FAILURE;
const requestIsStandby = (requestState :RequestState | void) :boolean => requestState === RequestStates.STANDBY;

export {
  requestIsFailure,
  requestIsPending,
  requestIsStandby,
  requestIsSuccess,
};
