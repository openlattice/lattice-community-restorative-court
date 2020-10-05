import { OrderedSet } from 'immutable';

import * as EDMActions from '.';
import { TestUtils } from '../../../utils/testing';

const { testShouldExportActionTypes, testShouldExportRequestSequences } = TestUtils;

const ACTION_TYPES = OrderedSet([
  'INITIALIZE_APPLICATION',
]).toJS();

const REQSEQ_NAMES = OrderedSet([
  'initializeApplication',
]).toJS();

describe('EDMActions', () => {

  testShouldExportActionTypes(EDMActions, ACTION_TYPES);
  testShouldExportRequestSequences(EDMActions, ACTION_TYPES, REQSEQ_NAMES);
});
