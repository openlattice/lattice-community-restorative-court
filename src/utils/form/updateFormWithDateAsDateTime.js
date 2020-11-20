// @flow

import { Map, getIn, setIn } from 'immutable';
import { LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

const { isDefined } = LangUtils;

const updateFormWithDateAsDateTime = (formData :Object | Map, path :string[]) => {
  const date = getIn(formData, path);
  if (!isDefined(date)) return formData;
  const now = DateTime.local();
  const updatedFormData = setIn(
    formData,
    path,
    DateTime.fromSQL(date.concat(' ', now.toISOTime())).toISO()
  );
  return updatedFormData;
};

/* eslint-disable import/prefer-default-export */
export {
  updateFormWithDateAsDateTime,
};
