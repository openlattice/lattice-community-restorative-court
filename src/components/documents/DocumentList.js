// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { CardStack } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import DocumentListItem from './DocumentListItem';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { getPersonName } from '../../utils/people';

const { formatAsDate } = DateTimeUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { STAFF } = AppTypes;
const { DATETIME_ADMINISTERED, NAME } = PropertyTypes;

type Props = {
  caseEKID :?UUID;
  caseIdentifier ?:string;
  forms :List;
  personCaseNeighborMap :Map;
};

const DocumentList = ({
  caseEKID,
  caseIdentifier,
  forms,
  personCaseNeighborMap,
} :Props) => (
  <CardStack>
    {
      forms.map((form :Map) => {
        const datetime = getPropertyValue(form, [DATETIME_ADMINISTERED, 0]);
        const formName = getPropertyValue(form, [NAME, 0]);
        const submittedDate = formatAsDate(datetime);
        const formEKID :?UUID = getEntityKeyId(form);
        const staffMember :Map = personCaseNeighborMap.getIn([STAFF, caseEKID, formEKID], Map());
        const staffMemberName = getPersonName(staffMember);
        return (
          <DocumentListItem
              caseIdentifier={caseIdentifier}
              form={form}
              formName={formName}
              key={formEKID}
              staffMemberName={staffMemberName}
              submittedDate={submittedDate} />
        );
      })
    }
  </CardStack>
);

DocumentList.defaultProps = {
  caseIdentifier: ''
};

export default DocumentList;
