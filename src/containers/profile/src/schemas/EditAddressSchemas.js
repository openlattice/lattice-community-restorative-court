// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { LOCATION } = AppTypes;
const {
  LOCATION_ADDRESS,
  LOCATION_ADDRESS_LINE_2,
  LOCATION_CITY,
  LOCATION_STATE,
  LOCATION_ZIP,
} = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, LOCATION, LOCATION_ADDRESS)]: {
          type: 'string',
          title: 'Address Line 1',
        },
        [getEntityAddressKey(0, LOCATION, LOCATION_ADDRESS_LINE_2)]: {
          type: 'string',
          title: 'Address Line 2',
        },
        [getEntityAddressKey(0, LOCATION, LOCATION_CITY)]: {
          type: 'string',
          title: 'City',
        },
        [getEntityAddressKey(0, LOCATION, LOCATION_STATE)]: {
          type: 'string',
          title: 'State',
        },
        [getEntityAddressKey(0, LOCATION, LOCATION_ZIP)]: {
          type: 'string',
          title: 'Zip',
        },
      },
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': { editable: true },
    [getEntityAddressKey(0, LOCATION, LOCATION_ADDRESS)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, LOCATION, LOCATION_ADDRESS_LINE_2)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, LOCATION, LOCATION_CITY)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, LOCATION, LOCATION_STATE)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, LOCATION, LOCATION_ZIP)]: {
      classNames: 'column-span-4',
    },
  },
};

export {
  schema,
  uiSchema
};
