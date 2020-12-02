// @flow
import type { UUID } from 'lattice';

export default function getSearchTerm(propertyTypeId :?UUID, searchString :string) {

  if (propertyTypeId) return `entity.${propertyTypeId}:"${searchString}"`;
}
