// @flow
import { List, Map, setIn } from 'immutable';
import { FQN } from 'lattice';
import { DataUtils } from 'lattice-utils';

const { getEntityKeyId, getPropertyValue } = DataUtils;

const hydrateSchema = (schema :Object, entityList :List, propertyList :FQN[], schemaPath :string[]) :Object => {

  if (entityList.isEmpty()) return schema;

  const values = [];
  const labels = [];
  entityList.forEach((entity :Map) => {
    let label = '';
    propertyList.forEach((propertyType :FQN) => {
      const property = getPropertyValue(entity, [propertyType, 0], '');
      label = label.concat(' ', property);
    });
    labels.push(label);
    values.push(getEntityKeyId(entity));
  });

  let newSchema = setIn(schema, schemaPath.concat(['enum']), values);
  newSchema = setIn(newSchema, schemaPath.concat(['enumNames']), labels);

  return newSchema;
};

/* eslint-disable import/prefer-default-export */
export {
  hydrateSchema
};
