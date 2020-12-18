// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { ETHNICITIES, GENDERS, RACES } from '../../../utils/people/constants';
import { CaseStatusConstants, FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { INTAKE_FORM } = FormConstants;
const { INTAKE } = CaseStatusConstants;
const {
  AGENCY,
  CHARGES,
  CHARGE_EVENT,
  DA_CASE,
  FORM,
  OFFICERS,
  ORGANIZATIONS,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
  STAFF,
  STATUS,
} = AppTypes;
const {
  CASE_NUMBER,
  DATETIME_ADMINISTERED,
  DATETIME_COMPLETED,
  DA_CASE_NUMBER,
  DOB,
  EFFECTIVE_DATE,
  ETHNICITY,
  GENDER,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
  ORGANIZATION_NAME,
  PRONOUN,
  RACE,
  SURNAME,
} = PropertyTypes;

const currentDateTime = DateTime.local().toISO();

const dataSchema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Client Information',
      properties: {
        [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
          type: 'string',
          title: 'First Name',
        },
        [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
          type: 'string',
          title: 'Middle Name',
        },
        [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
          type: 'string',
          title: 'Last Name',
        },
        [getEntityAddressKey(0, PEOPLE, DOB)]: {
          type: 'string',
          title: 'Date of Birth',
          format: 'date'
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
    },
    [getPageSectionKey(1, 2)]: {
      type: 'array',
      title: 'Victim Information',
      items: {
        type: 'object',
        properties: {
          [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
            type: 'string',
            title: 'First Name',
          },
          [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
            type: 'string',
            title: 'Middle Name',
          },
          [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
            type: 'string',
            title: 'Last Name',
          },
          [getEntityAddressKey(-1, PEOPLE, DOB)]: {
            type: 'string',
            title: 'Date of Birth',
            format: 'date'
          },
          [getEntityAddressKey(-1, PERSON_DETAILS, GENDER)]: {
            type: 'string',
            title: 'Gender',
            enum: GENDERS,
          },
          [getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)]: {
            type: 'string',
            title: 'Preferred Pronouns',
          },
          [getEntityAddressKey(-1, PEOPLE, RACE)]: {
            type: 'string',
            title: 'Race',
            enum: RACES,
          },
          [getEntityAddressKey(-1, PEOPLE, ETHNICITY)]: {
            type: 'string',
            title: 'Ethnicity',
            enum: ETHNICITIES,
          },
        },
      }
    },
    [getPageSectionKey(1, 3)]: {
      type: 'array',
      title: '',
      items: {
        type: 'object',
        properties: {
          [getEntityAddressKey(-1, ORGANIZATIONS, ORGANIZATION_NAME)]: {
            type: 'string',
            title: 'Organization Name',
          },
        },
        required: [
          getEntityAddressKey(-1, ORGANIZATIONS, ORGANIZATION_NAME),
        ]
      }
    },
    [getPageSectionKey(1, 4)]: {
      type: 'object',
      title: 'Respondent Information',
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
        [getEntityAddressKey(0, AGENCY, NAME)]: {
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
        [getEntityAddressKey(0, CHARGES, NAME)]: {
          type: 'string',
          title: 'Charge',
          enum: [],
          enumNames: []
        },
        [getEntityAddressKey(0, CHARGE_EVENT, DATETIME_COMPLETED)]: {
          type: 'string',
          title: 'Charge date',
          format: 'date'
        }
      },
    },
    [getPageSectionKey(1, 5)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Staff Member',
          enum: [],
          enumNames: [],
        },
      },
      required: [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
    },
    [getPageSectionKey(1, 6)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Date of Form Completion',
          format: 'date',
          default: DateTime.fromISO(currentDateTime).toISODate()
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: INTAKE_FORM
        },
        [getEntityAddressKey(0, STATUS, PropertyTypes.STATUS)]: {
          type: 'string',
          title: 'Status',
          default: INTAKE
        },
        [getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)]: {
          type: 'string',
          title: 'Intake Date',
          default: currentDateTime
        },
      }
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    'ui:disabled': true,
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEOPLE, DOB)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, RACE)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
      classNames: 'column-span-4'
    },
  },
  [getPageSectionKey(1, 2)]: {
    'ui:disabled': true,
    classNames: 'column-span-12',
    'ui:options': {
      addable: false,
      orderable: false,
      removable: false,
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, DOB)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PERSON_DETAILS, GENDER)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, RACE)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, ETHNICITY)]: {
        classNames: 'column-span-4'
      },
    }
  },
  [getPageSectionKey(1, 3)]: {
    'ui:disabled': true,
    classNames: 'column-span-12',
    'ui:options': {
      addable: false,
      orderable: false,
      removable: false,
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, ORGANIZATIONS, ORGANIZATION_NAME)]: {
        classNames: 'column-span-4'
      },
    }
  },
  [getPageSectionKey(1, 4)]: {
    'ui:disabled': true,
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
    [getEntityAddressKey(0, AGENCY, NAME)]: {
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
    [getEntityAddressKey(0, CHARGES, NAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, CHARGE_EVENT, DATETIME_COMPLETED)]: {
      classNames: 'column-span-4'
    }
  },
  [getPageSectionKey(1, 5)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
  },
  [getPageSectionKey(1, 6)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, STATUS, PropertyTypes.STATUS)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)]: {
      'ui:widget': 'hidden',
    },
  },
};

export {
  dataSchema,
  uiSchema,
};
