// @flow

import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

export default function getUTCDateRangeSearchString(
  propertyTypeId :UUID,
  timeUnits :any,
  startDate ? :DateTime,
  endDate ? :DateTime
) {

  let start :string = '*';
  if (startDate && startDate.isValid) start = startDate.startOf(timeUnits).toUTC().toISO();
  let end :string = '*';
  if (endDate && endDate.isValid) end = endDate.endOf(timeUnits).toUTC().toISO();

  const dateRangeString = `[${start} TO ${end}]`;
  return `entity.${propertyTypeId}:${dateRangeString}`;
}
