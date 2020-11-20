/*
 * @flow
 */

import styled from 'styled-components';

import OpenLatticeIconSVG from './ol-icon.svg';
import olPortraitSVG from './ol-portrait.svg';

const OpenLatticeIcon = styled.img.attrs({
  alt: 'openlattice-icon',
  src: OpenLatticeIconSVG,
})``;

const OLPortrait = styled.img.attrs({
  alt: 'ol-portrait',
  src: olPortraitSVG,
})``;

export {
  OpenLatticeIcon,
  OpenLatticeIconSVG,
  OLPortrait,
};
