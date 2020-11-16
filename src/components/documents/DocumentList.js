// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { CardStack } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import DocumentListItem from './DocumentListItem';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { getPersonName } from '../../utils/people';

const { formatAsDate } = DateTimeUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { STAFF } = AppTypes;
const { DATETIME_ADMINISTERED, NAME } = PropertyTypes;

type Props = {
  caseIdentifier ?:string;
  forms :List;
  formNeighborMap :Map;
};

const DocumentList = ({ caseIdentifier, forms, formNeighborMap } :Props) => (
  <CardStack>
    {
      forms.map((form :Map) => {
        const datetime = getPropertyValue(form, [DATETIME_ADMINISTERED, 0]);
        const formName = getPropertyValue(form, [NAME, 0]);
        const submittedDate = formatAsDate(datetime);
        const formEKID :?UUID = getEntityKeyId(form);
        const staffMember :Map = formNeighborMap.getIn([formEKID, STAFF], List());
        const staffMemberName = getPersonName(staffMember.get(0, Map()));
        return (
          <DocumentListItem
              key={formEKID}
              caseIdentifier={caseIdentifier}
              formName={formName}
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
