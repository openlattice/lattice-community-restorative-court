// @flow
import React from 'react';

import styled from 'styled-components';
import { LangUtils } from 'lattice-utils';

import { OLPortrait } from '../../../assets/svg/icons';

const { isNonEmptyString } = LangUtils;

type Props = {
  imageUrl ?:string;
  height ?:number;
  width ?:number;
};

const Image = styled.img`
  border-radius: 3px;
  object-fit: cover;
  object-position: 50% 50%;
`;

const Portrait = (props :Props) => {
  const {
    height,
    imageUrl,
    width,
  } = props;

  if (isNonEmptyString(imageUrl)) {
    return <Image src={imageUrl} height={height} width={width} />;
  }

  return <OLPortrait />;
};

Portrait.defaultProps = {
  height: 247,
  width: 247,
  imageUrl: ''
};

export default Portrait;
