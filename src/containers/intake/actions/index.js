// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SELECT_INTAKE :'SELECT_INTAKE' = 'SELECT_INTAKE';
const selectIntake = (value :any) => ({
  type: SELECT_INTAKE,
  value
});

const SUBMIT_INTAKE :'SUBMIT_INTAKE' = 'SUBMIT_INTAKE';
const submitIntake :RequestSequence = newRequestSequence(SUBMIT_INTAKE);

export {
  SELECT_INTAKE,
  SUBMIT_INTAKE,
  selectIntake,
  submitIntake,
};
