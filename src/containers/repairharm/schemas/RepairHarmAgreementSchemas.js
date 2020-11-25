// @flow
import { dataSchema, uiSchema } from './RepairHarmSchemas';

const data = JSON.parse(JSON.stringify(dataSchema));
const ui = JSON.parse(JSON.stringify(uiSchema));

export {
  data as schema,
  ui as uiSchema,
};
