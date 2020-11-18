// @flow
import { Map, fromJS } from 'immutable';

import addPeacemakerInformationReducer from './addPeacemakerInformationReducer';

import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [ADD_PEACEMAKER_INFORMATION]: RS_INITIAL_STATE,
  // data
});

export default function peacemakerReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case addPeacemakerInformation.case(action.type):
      return addPeacemakerInformationReducer(state, action);

    default:
      return state;
  }
}
