// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { DataUtils, LangUtils } from 'lattice-utils';

import CaseParticipation from './caseparticipation/CaseParticipation';
import LastContacted from './lastcontacted/LastContacted';
import { FormConstants, RoleConstants } from './constants';
import { PERSON_NEIGHBOR_MAP, PROFILE } from './reducers/constants';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { useSelector } from '../../app/AppProvider';

const { PEACEMAKER } = RoleConstants;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { FORM } = AppTypes;
const { NAME, ROLE } = PropertyTypes;
const { isDefined } = LangUtils;
const { getPropertyValue } = DataUtils;

const BodyWrapper = styled.div`
  padding: 0 16px;

  .MuiTabPanel-root {
    padding: 16px 0;
  }
`;

const ProfileBody = () => {
  const personRoleMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE], Map()));
  const isPersonPeacemaker = personRoleMap.includes(PEACEMAKER);
  const personForms :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, FORM], List()));
  const formsIncludePeacemakerInfo = isDefined(
    personForms.find((form :Map) => getPropertyValue(form, [NAME, 0]) === PEACEMAKER_INFORMATION_FORM)
  );
  return (
    <BodyWrapper>
      <CaseParticipation />
      {(isPersonPeacemaker || formsIncludePeacemakerInfo) && <LastContacted />}
    </BodyWrapper>
  );
};

export default ProfileBody;
