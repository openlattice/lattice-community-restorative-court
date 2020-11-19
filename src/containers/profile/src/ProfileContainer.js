// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Spinner, StyleUtils } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { RequestState } from 'redux-reqseq';

import ProfileAside from './ProfileAside';
import ProfileBody from './ProfileBody';
import { LOAD_PROFILE, loadProfile } from './actions';
import { CenterWrapper } from './styled';

import { CrumbItem, Crumbs } from '../../../components/crumbs';
import { APP_PATHS, ProfileReduxConstants, REQUEST_STATE } from '../../../core/redux/constants';
import { selectPerson } from '../../../core/redux/selectors';
import { getPersonName } from '../../../utils/people';
import { useDispatch, useSelector } from '../../app/AppProvider';

const { media } = StyleUtils;
const { isPending } = ReduxUtils;
const { PROFILE } = ProfileReduxConstants;

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: auto 1fr;
  ${media.phone`
    grid-template-columns: auto;
  `}
`;

type Props = {
  personId :UUID;
};

const ProfileContainer = ({ personId } :Props) => {
  const dispatch = useDispatch();

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) dispatch(loadProfile(personId));
  }, [appConfig, dispatch, personId]);

  const loadProfileRS :?RequestState = useSelector((store) => store.getIn([PROFILE, LOAD_PROFILE, REQUEST_STATE]));
  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);

  if (isPending(loadProfileRS)) {
    return <CenterWrapper><Spinner size="2x" /></CenterWrapper>;
  }

  return (
    <div>
      <Crumbs>
        <CrumbItem>{ personName }</CrumbItem>
      </Crumbs>
      <ProfileGrid>
        <ProfileAside />
        <ProfileBody />
      </ProfileGrid>
    </div>
  );
};

export default ProfileContainer;
