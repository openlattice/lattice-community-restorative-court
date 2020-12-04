// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { dataSchema, uiSchema } from './RestitutionReferralSchemas';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { ETHNICITIES, GENDERS, RACES } from '../../../utils/people/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  CONTACT_INFO,
  FORM,
  OFFENSE,
  PEOPLE,
  PERSON_DETAILS,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DESCRIPTION,
  DOB,
  ETHNICITY,
  EMAIL,
  GENDER,
  PHONE_NUMBER,
  PRONOUN,
  RACE,
} = PropertyTypes;

const data = JSON.parse(JSON.stringify(dataSchema));
const ui = JSON.parse(JSON.stringify(uiSchema));

const page1section1 = getPageSectionKey(1, 1);
const page1section2 = getPageSectionKey(1, 2);
const page1section4 = getPageSectionKey(1, 4);

// Add other person fields

data.properties[page1section1]
  .properties[getEntityAddressKey(0, PEOPLE, DOB)] = {
    type: 'string',
    title: 'Date of Birth',
    format: 'date'
  };

data.properties[page1section1]
  .properties[getEntityAddressKey(0, PEOPLE, RACE)] = {
    type: 'string',
    title: 'Race',
    enum: RACES,
  };

data.properties[page1section1]
  .properties[getEntityAddressKey(0, PEOPLE, ETHNICITY)] = {
    type: 'string',
    title: 'Ethnicity',
    enum: ETHNICITIES,
  };

data.properties[page1section1]
  .properties[getEntityAddressKey(0, PERSON_DETAILS, GENDER)] = {
    type: 'string',
    title: 'Gender',
    enum: GENDERS,
  };
data.properties[page1section1]
  .properties[getEntityAddressKey(0, PERSON_DETAILS, PRONOUN)] = {
    type: 'string',
    title: 'Preferred Pronouns',
  };

ui[page1section1][getEntityAddressKey(0, PEOPLE, DOB)] = {
  classNames: 'column-span-4'
};

ui[page1section1][getEntityAddressKey(0, PEOPLE, RACE)] = {
  classNames: 'column-span-4'
};

ui[page1section1][getEntityAddressKey(0, PEOPLE, ETHNICITY)] = {
  classNames: 'column-span-4'
};

ui[page1section1][getEntityAddressKey(0, PERSON_DETAILS, GENDER)] = {
  classNames: 'column-span-4'
};

ui[page1section1][getEntityAddressKey(0, PERSON_DETAILS, PRONOUN)] = {
  classNames: 'column-span-4'
};

// Add person contact info

data.properties[page1section4] = {
  type: 'object',
  title: 'Contact',
  properties: {
    [getEntityAddressKey(0, CONTACT_INFO, PHONE_NUMBER)]: {
      type: 'string',
      title: 'Phone number',
    },
    [getEntityAddressKey(0, CONTACT_INFO, EMAIL)]: {
      type: 'string',
      title: 'Email',
    },
  },
};

ui[page1section4] = {
  classNames: 'column-span-12 grid-container',
  [getEntityAddressKey(0, CONTACT_INFO, PHONE_NUMBER)]: {
    classNames: 'column-span-4',
  },
  [getEntityAddressKey(0, CONTACT_INFO, EMAIL)]: {
    classNames: 'column-span-4',
  },
};

// Add offense

data.properties[page1section2]
  .properties[getEntityAddressKey(0, OFFENSE, DESCRIPTION)] = {
    type: 'string',
    title: 'Offense',
  };

ui[page1section2][getEntityAddressKey(0, OFFENSE, DESCRIPTION)] = {
  classNames: 'column-span-4'
};

// Add form date

data.properties[page1section2]
  .properties[getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]
  .format = 'date';

ui[page1section2][getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)] = {
  classNames: 'column-span-4'
};

// ensure pagesection order

ui['ui:order'] = [
  page1section1,
  page1section4,
  page1section2,
  getPageSectionKey(1, 3)
];

export {
  data as schema,
  ui as uiSchema,
};
