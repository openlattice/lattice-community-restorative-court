// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardSegment, Colors, Typography } from 'lattice-ui-kit';

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
  formName :string;
  staffMemberName :string;
  submittedDate :string;
};

const DocumentListItem = ({
  caseIdentifier,
  formName,
  staffMemberName,
  submittedDate
} :Props) => (
  <DocumentCardSegment noBleed>
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

export default DocumentListItem;
