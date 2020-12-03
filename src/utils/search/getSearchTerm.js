// @flow
import type { UUID } from 'lattice';

export default function getSearchTerm(propertyTypeId :?UUID, searchString :string) {

  return `entity.${propertyTypeId}:"${searchString}"`;
}
