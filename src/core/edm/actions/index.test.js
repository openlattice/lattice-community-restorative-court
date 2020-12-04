import { OrderedSet } from 'immutable';

import * as EDMActions from '.';
// import-sort-style-openlattice puts this TestUtils file below the EDMActions, but eslint wants the opposite:
/* eslint-disable import/order */
import { TestUtils } from '../../../utils/testing';

const { testShouldExportActionTypes, testShouldExportRequestSequences } = TestUtils;

const ACTION_TYPES = OrderedSet([
  'GET_EDM_TYPES',
]).toJS();

const REQSEQ_NAMES = OrderedSet([
  'getEntityDataModelTypes',
]).toJS();

describe('EDMActions', () => {

  testShouldExportActionTypes(EDMActions, ACTION_TYPES);
  testShouldExportRequestSequences(EDMActions, ACTION_TYPES, REQSEQ_NAMES);
});
