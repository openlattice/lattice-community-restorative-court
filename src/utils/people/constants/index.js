// @flow
export * from './LanguagesConstants';

const GENDERS :string[] = [
  'Female',
  'Male',
  'Nonbinary',
  'Transgender (Male to Female)',
  'Transgender (Female to Male)',
  'Unknown',
  'Decline to State',
  'Other',
  'Not Asked',
];

const RACES :string[] = [
  'Asian',
  'Black',
  'Native American',
  'Pacific Islander',
  'White',
  'Multi-Racial',
  'Other',
  'Unknown'
];

const ETHNICITIES = [
  'Hispanic or Latino',
  'Not Hispanic or Latino',
  'Other',
  'Unknown'
];

export {
  ETHNICITIES,
  GENDERS,
  RACES,
};
