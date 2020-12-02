// @flow
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { LangUtils, ValidationUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

const { OPENLATTICE_ID_FQN } = Constants;
const { isValidUUID } = ValidationUtils;
const { isDefined } = LangUtils;

const formatNewEntityData = (data :Object, propertyFqnsByTypeId :Map, entityKeyId ?:UUID) :Map => {
  if (!isDefined(data) || !Object.keys(data).length) return Map();

  return Map().withMutations((mutator :Map) => {
    fromJS(data).forEach((entityValue :List, propertyTypeId :UUID) => {
      const propertyFqn = propertyFqnsByTypeId.get(propertyTypeId);
      mutator.set(propertyFqn, entityValue);
    });
    if (isValidUUID(entityKeyId)) {
      mutator.set(OPENLATTICE_ID_FQN, List([entityKeyId]));
    }
  });
};

export {
  formatNewEntityData,
};
