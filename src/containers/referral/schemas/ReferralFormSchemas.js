// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { ETHNICITIES, GENDERS, RACES } from '../../../utils/people/constants';
import { FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { REFERRAL_FORM } = FormConstants;
const {
  DA_CASE,
  FORM,
  OFFENSE,
  OFFICERS,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
} = AppTypes;
const {
  CASE_NUMBER,
  DATETIME_ADMINISTERED,
  DATETIME_COMPLETED,
  DA_CASE_NUMBER,
  DESCRIPTION,
  DOB,
  ETHNICITY,
  GENDER,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
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
        [getEntityAddressKey(0, DA_CASE, DA_CASE_NUMBER)]: {
          type: 'string',
          title: 'DA Case Number',
        },
        [getEntityAddressKey(0, DA_CASE, CASE_NUMBER)]: {
          type: 'string',
          title: 'Case Number',
        },
        [getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)]: {
          type: 'string',
          title: 'Date of Incident',
          format: 'date'
        },
        [getEntityAddressKey(0, OFFENSE, DESCRIPTION)]: {
          type: 'string',
          title: 'Offense',
        },
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'object',
      title: 'Victim Information',
      properties: {
        [getEntityAddressKey(0, PEOPLE, OPENLATTICE_ID_FQN)]: {
          type: 'array',
          title: 'People Already in Database',
          items: {
            enum: [],
            enumNames: [],
            type: 'string',
          },
          uniqueItems: true,
        },
      }
    },
    [getPageSectionKey(1, 3)]: {
      type: 'array',
      title: '',
      items: {
        type: 'object',
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
    },
    [getPageSectionKey(1, 4)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Datetime Administered',
          default: DateTime.local().toISO()
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: REFERRAL_FORM
        },
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
    [getEntityAddressKey(0, DA_CASE, DA_CASE_NUMBER)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, DA_CASE, CASE_NUMBER)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, OFFENSE, DESCRIPTION)]: {
      classNames: 'column-span-4'
    },
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, PEOPLE, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4',
      'ui:options': { multiple: true }
    }
  },
  [getPageSectionKey(1, 3)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add New Person',
      orderable: false,
      addActionKey: 'addVictim'
    },
    items: {
      classNames: 'grid-container',
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
  },
  [getPageSectionKey(1, 4)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
  },
};

export {
  schema,
  uiSchema,
};
