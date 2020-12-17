// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { RoleConstants } from '../constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { APPEARS_IN } = AppTypes;
const { ROLE } = PropertyTypes;
const { PEACEMAKER, STAFF_MEMBER, VICTIM } = RoleConstants;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, APPEARS_IN, ROLE)]: {
          type: 'string',
          title: 'Role',
          enum: [PEACEMAKER, VICTIM, STAFF_MEMBER]
        },
      },
      required: [
        getEntityAddressKey(0, APPEARS_IN, ROLE)
      ],
    },
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, APPEARS_IN, ROLE)]: {
      classNames: 'column-span-12',
    },
  }
};

export {
  schema,
  uiSchema,
};
