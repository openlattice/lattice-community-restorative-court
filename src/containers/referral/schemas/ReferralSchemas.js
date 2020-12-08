// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { ETHNICITIES, GENDERS, RACES } from '../../../utils/people/constants';
import { CaseStatusConstants, FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { REFERRAL_FORM } = FormConstants;
const { REFERRAL } = CaseStatusConstants;
const {
  CRC_CASE,
  DA_CASE,
  FORM,
  OFFENSE,
  OFFICERS,
  ELECTRONIC_SIGNATURE, // change to ORGANIZATIONS
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
  DATETIME_RECEIVED,
  DA_CASE_NUMBER,
  DESCRIPTION,
  DOB,
  EFFECTIVE_DATE,
  ETHNICITY,
  GENDER,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
  // add ORGANIZATION_NAME
  PRONOUN,
  RACE,
  SOURCE,
  SURNAME,
} = PropertyTypes;

const currentDateTime = DateTime.local().toISO();

const dataSchema = {
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
      },
      required: [
        getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED),
        getEntityAddressKey(0, DA_CASE, CASE_NUMBER),
        getEntityAddressKey(0, REFERRAL_REQUEST, SOURCE),
      ]
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
          [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
            type: 'string',
            title: 'Last Name',
          },
          [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
            type: 'string',
            title: 'First Name',
          },
          [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
            type: 'string',
            title: 'Middle Name',
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
        required: [
          getEntityAddressKey(-1, PEOPLE, SURNAME),
          getEntityAddressKey(-1, PEOPLE, GIVEN_NAME),
          getEntityAddressKey(-1, PEOPLE, DOB),
          getEntityAddressKey(-1, PERSON_DETAILS, GENDER),
        ]
      }
    },
    [getPageSectionKey(1, 4)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, ELECTRONIC_SIGNATURE, OPENLATTICE_ID_FQN)]: {
          type: 'array',
          title: 'Organizations Already in Database',
          items: {
            enum: [],
            enumNames: [],
            type: 'string',
          },
          uniqueItems: true,
        },
      }
    },

    [getPageSectionKey(1, 5)]: {
      type: 'array',
      title: '',
      items: {
        type: 'object',
        properties: {
          [getEntityAddressKey(-1, ELECTRONIC_SIGNATURE, NAME)]: {
            type: 'string',
            title: 'Organization Name',
          },
        },
        required: [
          getEntityAddressKey(-1, ELECTRONIC_SIGNATURE, NAME),
        ]
      }
    },
    [getPageSectionKey(1, 6)]: {
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
    [getPageSectionKey(1, 7)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Date of Form Completion',
          default: currentDateTime
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: REFERRAL_FORM
        },
        [getEntityAddressKey(0, STATUS, PropertyTypes.STATUS)]: {
          type: 'string',
          title: 'Status',
          default: REFERRAL
        },
        [getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)]: {
          type: 'string',
          title: 'Referral Date',
        },
        [getEntityAddressKey(0, CRC_CASE, DATETIME_RECEIVED)]: {
          type: 'string',
          title: 'Date Case Received',
          default: currentDateTime
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
      addButtonText: '+ Add New Victim Profile',
      orderable: false,
      addActionKey: 'addVictim'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
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
  [getPageSectionKey(1, 4)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, ELECTRONIC_SIGNATURE, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4',
      'ui:options': { multiple: true }
    }
  },
  [getPageSectionKey(1, 5)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add New Victim Organization',
      orderable: false,
      addActionKey: 'addVictimOrg'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, ELECTRONIC_SIGNATURE, NAME)]: {
        classNames: 'column-span-4'
      },
    }
  },
  [getPageSectionKey(1, 6)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
  },
  [getPageSectionKey(1, 7)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      'ui:widget': 'hidden',
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
    [getEntityAddressKey(0, CRC_CASE, DATETIME_RECEIVED)]: {
      'ui:widget': 'hidden',
    }
  },
};

export {
  dataSchema,
  uiSchema,
};
