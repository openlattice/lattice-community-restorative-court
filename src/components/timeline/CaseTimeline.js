// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Colors,
  Label,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils, LangUtils } from 'lattice-utils';

import { CaseStatusConstants, EMPTY_VALUE } from '../../containers/profile/src/constants';
import { PropertyTypes } from '../../core/edm/constants';
import { getPropertyValue, getPropertyValuesLU } from '../../utils/data';
import { getPersonName } from '../../utils/people';

const { NEUTRAL } = Colors;
const {
  DESCRIPTION,
  EFFECTIVE_DATE,
  SOURCE,
  TYPE,
} = PropertyTypes;
const { CLOSED, REFERRAL } = CaseStatusConstants;
const { isDefined } = LangUtils;
const { getEntityKeyId } = DataUtils;
const { formatAsDate } = DateTimeUtils;

const TimelineContentWrapper = styled.div`
  display: flex;
`;

const Date = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const StatusDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Status = styled(Label)`
  color: ${NEUTRAL.N900};
`;

const StatusDescription = styled.div`
  font-size: 16px;
`;

type Props = {
  caseStatuses :List;
  referralRequest :?Map;
  staffMemberByStatusEKID :Map;
};

const CaseTimeline = ({ caseStatuses, referralRequest, staffMemberByStatusEKID } :Props) => (
  <Timeline>
    {
      caseStatuses.map((caseStatus :Map) => {
        const caseStatusEKID :?UUID = getEntityKeyId(caseStatus);
        const { [DESCRIPTION]: description, [EFFECTIVE_DATE]: datetime, [TYPE]: status } = getPropertyValuesLU(
          caseStatus,
          [DESCRIPTION, EFFECTIVE_DATE, TYPE],
          EMPTY_VALUE
        );
        const date = formatAsDate(datetime);
        const staffMemberWhoRecordedStatus :Map = staffMemberByStatusEKID.get(caseStatusEKID, Map());

        const statusDescriptionSwitch = () => {
          switch (caseStatus) {
            case status === CLOSED:
              return description;
            case status === REFERRAL && isDefined(referralRequest):
              return getPropertyValue(referralRequest, SOURCE, '');
            case !staffMemberWhoRecordedStatus.isEmpty():
              return `Case Manager: ${getPersonName(staffMemberWhoRecordedStatus)}`;
            default:
              return '';
          }
        };

        return (
          <TimelineItem key={caseStatusEKID}>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineContentWrapper>
                <Date>{date}</Date>
                <StatusDetailsWrapper>
                  <Status>{status}</Status>
                  <StatusDescription>
                    {statusDescriptionSwitch()}
                  </StatusDescription>
                </StatusDetailsWrapper>
              </TimelineContentWrapper>
            </TimelineContent>
          </TimelineItem>
        );
      })
    }
  </Timeline>
);

export default CaseTimeline;
