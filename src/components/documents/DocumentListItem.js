// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { CardSegment, Colors, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { useDispatch, useSelector } from '../../containers/app/AppProvider';
import { selectReferralForm } from '../../containers/referral/actions';
import { APP_PATHS } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import {
  COMPLETED_REFERRAL,
  FORM_ID,
  PERSON_ID,
} from '../../core/router/Routes';
import { goToRoute } from '../../core/router/RoutingActions';

const { getEntityKeyId } = DataUtils;
const { NEUTRAL } = Colors;

const DocumentCardSegment = styled(CardSegment)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  :first-of-type {
    padding-top: 0;
  }

  div:first-child {
    display: flex;
    margin-right: 20px;
  }

  span {
    margin-left: 18px;
  }

  div:last-child {
    align-items: flex-end;
    display: flex;
  }
`;

const FormName = styled(Typography)`
  color: ${NEUTRAL.N900};
`;

type Props = {
  caseIdentifier :?string;
  form :Map;
  formName :string;
  staffMemberName :string;
  submittedDate :string;
};

const DocumentListItem = ({
  caseIdentifier,
  form,
  formName,
  staffMemberName,
  submittedDate
} :Props) => {

  const formEKID :?UUID = getEntityKeyId(form);
  const person :Map = useSelector(selectPerson());
  const personEKID :?UUID = getEntityKeyId(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  const dispatch = useDispatch();

  const goToCompletedReferral = () => {
    if (personEKID) {
      dispatch(selectReferralForm(form));
      dispatch(goToRoute(`${root}/${PERSON_ID}/${COMPLETED_REFERRAL}/${FORM_ID}`
        .replace(PERSON_ID, personEKID)
        .replace(FORM_ID, formEKID)));
    }
  };

  return (
    <DocumentCardSegment noBleed onClick={goToCompletedReferral}>
      <div>
        <FontAwesomeIcon color={NEUTRAL.N900} icon={faFileAlt} />
        <span>
          <FormName variant="h5">{formName}</FormName>
          <Typography variant="h6">{caseIdentifier}</Typography>
        </span>
      </div>
      <div>
        <Typography variant="h6">
          {`Submitted on ${submittedDate} by ${staffMemberName}`}
        </Typography>
      </div>
    </DocumentCardSegment>
  );
};

export default DocumentListItem;
