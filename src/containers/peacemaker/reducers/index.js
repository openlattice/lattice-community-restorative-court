// @flow
import { Map, fromJS } from 'immutable';

import addPeacemakerInformationReducer from './addPeacemakerInformationReducer';
import editPeacemakerInformationReducer from './editPeacemakerInformationReducer';

import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import {
  ADD_PEACEMAKER_INFORMATION,
  EDIT_PEACEMAKER_INFORMATION,
  addPeacemakerInformation,
  editPeacemakerInformation,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [ADD_PEACEMAKER_INFORMATION]: RS_INITIAL_STATE,
  [EDIT_PEACEMAKER_INFORMATION]: RS_INITIAL_STATE,
  // data
});

export default function peacemakerReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case addPeacemakerInformation.case(action.type):
      return addPeacemakerInformationReducer(state, action);

    case editPeacemakerInformation.case(action.type):
      return editPeacemakerInformationReducer(state, action);

    default:
      return state;
  }
}
