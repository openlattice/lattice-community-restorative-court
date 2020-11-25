// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SELECT_REPAIR_HARM_AGREEMENT :'SELECT_REPAIR_HARM_AGREEMENT' = 'SELECT_REPAIR_HARM_AGREEMENT';
const selectRepairHarmAgreement = (value :any) => ({
  type: SELECT_REPAIR_HARM_AGREEMENT,
  value
});

const SUBMIT_REPAIR_HARM_AGREEMENT :'SUBMIT_REPAIR_HARM_AGREEMENT' = 'SUBMIT_REPAIR_HARM_AGREEMENT';
const submitRepairHarmAgreement :RequestSequence = newRequestSequence(SUBMIT_REPAIR_HARM_AGREEMENT);

export {
  SELECT_REPAIR_HARM_AGREEMENT,
  SUBMIT_REPAIR_HARM_AGREEMENT,
  selectRepairHarmAgreement,
  submitRepairHarmAgreement,
};
