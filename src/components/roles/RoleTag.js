// @flow
import styled from 'styled-components';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';

const { getStyleVariation } = StyleUtils;
const { BLUE, GREEN, RED } = Colors;

export const getBackgroundColor = getStyleVariation('roleName', {
  peacemaker: BLUE.B00,
  respondent: RED.R00,
  victim: GREEN.G00,
}, RED.R00);

export const getFontColor = getStyleVariation('roleName', {
  peacemaker: BLUE.B400,
  respondent: RED.R400,
  victim: GREEN.G400,
}, RED.R400);

export const RoleTag = styled(Tag)`
  background-color: ${getBackgroundColor};
  border-radius: 31px;
  color: ${getFontColor};
  font-size: 16px;
  font-weight: 600;
  padding: 10.5px 16.25px;
  text-transform: capitalize;
`;
