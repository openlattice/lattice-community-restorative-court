// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { ETHNICITIES, GENDERS, RACES } from '../../../utils/people/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  CASE,
  OFFICERS,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
} = AppTypes;
const {
  DATETIME_COMPLETED,
  DATETIME_START,
  DOB,
  ETHNICITY,
  GENDER,
  GIVEN_NAME,
  ID,
  MIDDLE_NAME,
  RACE,
  SOURCE,
  SURNAME,
} = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Respondent Profile',
      properties: {
        [getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)]: {
          type: 'string',
          title: 'Date of Referral',
          format: 'date'
        },
        [getEntityAddressKey(0, OFFICERS, GIVEN_NAME)]: {
          type: 'string',
          title: 'Officer First Name',
        },
        [getEntityAddressKey(0, OFFICERS, SURNAME)]: {
          type: 'string',
          title: 'Officer Last Name',
        },
        [getEntityAddressKey(0, REFERRAL_REQUEST, SOURCE)]: {
          type: 'string',
          title: 'Referring Agency',
        },
        [getEntityAddressKey(0, CASE, ID)]: {
          type: 'string',
          title: 'Case Number',
        },
        [getEntityAddressKey(0, CASE, DATETIME_START)]: {
          type: 'string',
          title: 'Date of Incident',
          format: 'date'
        },
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'array',
      title: 'Victim Information',
      items: {
        [getPageSectionKey(1, 3)]: {
          type: 'object',
          title: '',
          properties: {
            [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
              type: 'string',
              title: 'Last Name',
            },
            [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
              type: 'string',
              title: 'First Name',
            },
            [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
              type: 'string',
              title: 'Middle Name',
            },
            [getEntityAddressKey(0, PEOPLE, DOB)]: {
              type: 'string',
              title: 'Date of Birth',
              format: 'date'
            },
            [getEntityAddressKey(0, PERSON_DETAILS, GENDER)]: {
              type: 'string',
              title: 'Gender',
              enum: GENDERS,
            },
            [getEntityAddressKey(0, PERSON_DETAILS, GENDER)]: {
              type: 'string',
              title: 'Preferred Pronouns',
            },
            [getEntityAddressKey(0, PEOPLE, RACE)]: {
              type: 'string',
              title: 'Race',
              enum: RACES,
            },
            [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
              type: 'string',
              title: 'Ethnicity',
              enum: ETHNICITIES,
            },
          }
        }
      }
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, OFFICERS, GIVEN_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, OFFICERS, SURNAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, REFERRAL_REQUEST, SOURCE)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, CASE, ID)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, CASE, DATETIME_START)]: {
      classNames: 'column-span-4'
    },
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, DOB)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PERSON_DETAILS, GENDER)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PERSON_DETAILS, GENDER)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, RACE)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
      classNames: 'column-span-4'
    },
  }
};

export {
  schema,
  uiSchema,
};
