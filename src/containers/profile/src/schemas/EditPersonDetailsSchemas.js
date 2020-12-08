// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { GENDERS } from '../../../../utils/people/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { PERSON_DETAILS } = AppTypes;
const { GENDER, PRONOUN } = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(-1, PERSON_DETAILS, GENDER)]: {
          type: 'string',
          title: 'Gender',
          enum: GENDERS,
        },
        [getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)]: {
          type: 'string',
          title: 'Preferred Pronouns',
        },
      },
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': { editable: true },
    [getEntityAddressKey(-1, PERSON_DETAILS, GENDER)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)]: {
      classNames: 'column-span-4'
    },
  },
};

export {
  schema,
  uiSchema
};
