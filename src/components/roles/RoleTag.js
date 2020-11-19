// @flow
import styled from 'styled-components';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';

import { RoleConstants } from '../../containers/profile/src/constants';

const { getStyleVariation } = StyleUtils;
const { BLUE, GREEN, RED } = Colors;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;

export const getBackgroundColor = getStyleVariation('roleName', {
  [PEACEMAKER]: BLUE.B00,
  [RESPONDENT]: RED.R00,
  [VICTIM]: GREEN.G00,
}, RED.R00);

export const getFontColor = getStyleVariation('roleName', {
  [PEACEMAKER]: BLUE.B400,
  [RESPONDENT]: RED.R400,
  [VICTIM]: GREEN.G400,
}, RED.R400);

export const RoleTag = styled(Tag)`
  background-color: ${getBackgroundColor};
  border-radius: 31px;
  color: ${getFontColor};
  padding: 10.5px 16.25px;
  text-transform: capitalize;
`;
