// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { CRC_CASE } = AppTypes;
const { DESCRIPTION } = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, CRC_CASE, DESCRIPTION)]: {
          type: 'string',
          title: ' ',
          format: 'textarea',
        },
      },
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': { editable: true },
    [getEntityAddressKey(0, CRC_CASE, DESCRIPTION)]: {
      classNames: 'column-span-12',
    },
  },
};

export {
  schema,
  uiSchema
};
