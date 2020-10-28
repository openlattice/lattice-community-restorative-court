// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardSegment, Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const DocumentCardSegment = styled(CardSegment)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FormNameBlock = styled.div`
  display: flex;
`;

const FormNameAndCaseNumber = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormName = styled.div`
  color: ${NEUTRAL.N900};
  font-size: 16px;
  font-weight: 600;
`;

const SubmittedBlock = styled(FormName)`
  align-items: flex-end;
  display: flex;
`;

const CaseNumber = styled.div`
  color: ${NEUTRAL.N600};
  font-size: 16px;
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
    <FormNameBlock>
      <FontAwesomeIcon color={NEUTRAL.N900} icon={faFileAlt} />
      <FormNameAndCaseNumber>
        <FormName>{formName}</FormName>
        <CaseNumber>{caseIdentifier}</CaseNumber>
      </FormNameAndCaseNumber>
    </FormNameBlock>
    <SubmittedBlock>
      {`Submitted on ${submittedDate} by ${staffMemberName}`}
    </SubmittedBlock>
  </DocumentCardSegment>
);

export default DocumentListItem;
