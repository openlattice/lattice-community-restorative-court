// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_PEACEMAKER_INFORMATION :'ADD_PEACEMAKER_INFORMATION' = 'ADD_PEACEMAKER_INFORMATION';
const addPeacemakerInformation :RequestSequence = newRequestSequence(ADD_PEACEMAKER_INFORMATION);

export {
  ADD_PEACEMAKER_INFORMATION,
  addPeacemakerInformation,
};
