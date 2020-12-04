// @flow
import styled from 'styled-components';
import { Colors, StyleUtils, Tag } from 'lattice-ui-kit';

import { ContactActivityConstants, RoleConstants } from '../../containers/profile/src/constants';

const { getStyleVariation } = StyleUtils;
const { BLUE, GREEN, RED } = Colors;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;
const { DID_NOT_ATTEND, ATTENDED } = ContactActivityConstants;

export const getBackgroundColor = getStyleVariation('background', {
  [ATTENDED]: GREEN.G00,
  [DID_NOT_ATTEND]: RED.R00,
  [PEACEMAKER]: BLUE.B00,
  [RESPONDENT]: RED.R00,
  [VICTIM]: GREEN.G00,
}, RED.R00);

export const getFontColor = getStyleVariation('color', {
  [ATTENDED]: GREEN.G400,
  [DID_NOT_ATTEND]: RED.R400,
  [PEACEMAKER]: BLUE.B400,
  [RESPONDENT]: RED.R400,
  [VICTIM]: GREEN.G400,
}, RED.R400);

export const CRCTag = styled(Tag)`
  background-color: ${getBackgroundColor};
  border-radius: ${(props) => props.borderRadius};
  color: ${getFontColor};
  display: flex;
  justify-content: center;
  padding: ${(props) => props.padding};
  text-transform: capitalize;
`;
