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
import { FormConstants } from '../../containers/profile/src/constants';
import { APP_PATHS } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { FORM_ID, PERSON_ID, ROUTES_FOR_COMPLETED_FORMS } from '../../core/router/Routes';
import { goToRoute } from '../../core/router/RoutingActions';
import { getRelativeRoot } from '../../utils/router';

const { getEntityKeyId } = DataUtils;
const { NEUTRAL } = Colors;
const { SELECT_FORM_ACTIONS_BY_FORM } = FormConstants;

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
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const dispatch = useDispatch();

  const goToCompletedForm = () => {
    if (personEKID && formEKID) {
      const selectForm = SELECT_FORM_ACTIONS_BY_FORM[formName];
      if (selectForm) {
        dispatch(selectForm(form));
      }
      dispatch(goToRoute(`${relativeRoot}/${ROUTES_FOR_COMPLETED_FORMS[formName]}`
        .replace(PERSON_ID, personEKID)
        .replace(FORM_ID, formEKID)));
    }
  };

  return (
    <DocumentCardSegment noBleed onClick={goToCompletedForm}>
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
