// @flow

import { DataProcessingUtils } from 'lattice-fabricate';

import { dataSchema, uiSchema } from './ReferralSchemas';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { FORM, PERSON_DETAILS } = AppTypes;
const { DATETIME_ADMINISTERED, GENDER, PRONOUN } = PropertyTypes;

const data = JSON.parse(JSON.stringify(dataSchema));
const ui = JSON.parse(JSON.stringify(uiSchema));

// remove existing person dropdown from form since all victim people will be grouped together in next section
delete data.properties[getPageSectionKey(1, 2)];
delete ui[getPageSectionKey(1, 2)];

// remove properties not stored on person entity
delete data.properties[getPageSectionKey(1, 3)]
  .items.properties[getEntityAddressKey(-1, PERSON_DETAILS, GENDER)];
delete data.properties[getPageSectionKey(1, 3)]
  .items.properties[getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)];

delete ui[getPageSectionKey(1, 3)].items[getEntityAddressKey(-1, PERSON_DETAILS, GENDER)];
delete ui[getPageSectionKey(1, 3)].items[getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)];

data.properties[getPageSectionKey(1, 3)].title = 'Victim Information';

ui[getPageSectionKey(1, 3)]['ui:options'] = {
  addable: false,
  orderable: false,
  removable: false,
};

data.properties[getPageSectionKey(1, 7)]
  .properties[getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]
  .format = 'date';

ui[getPageSectionKey(1, 7)][getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)] = {
  classNames: 'column-span-4'
};

export {
  data as schema,
  ui as uiSchema,
};
