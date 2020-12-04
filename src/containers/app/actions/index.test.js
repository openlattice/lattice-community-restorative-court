import { OrderedSet } from 'immutable';

import * as AppActions from '.';
// import-sort-style-openlattice puts this TestUtils file below the AppActions, but eslint wants the opposite:
/* eslint-disable import/order */
import { TestUtils } from '../../../utils/testing';

const { testShouldExportActionTypes, testShouldExportRequestSequences } = TestUtils;

const ACTION_TYPES = OrderedSet([
  'INITIALIZE_APPLICATION',
]).toJS();

const REQSEQ_NAMES = OrderedSet([
  'initializeApplication',
]).toJS();

describe('AppActions', () => {

  testShouldExportActionTypes(AppActions, ACTION_TYPES);
  testShouldExportRequestSequences(AppActions, ACTION_TYPES, REQSEQ_NAMES);
});
