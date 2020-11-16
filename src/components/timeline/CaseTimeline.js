// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Colors,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils, LangUtils } from 'lattice-utils';

import { CaseStatusConstants } from '../../containers/profile/src/constants';
import { PropertyTypes } from '../../core/edm/constants';
import { getPersonName } from '../../utils/people';

const { NEUTRAL } = Colors;
const {
  DESCRIPTION,
  EFFECTIVE_DATE,
  SOURCE,
  STATUS,
} = PropertyTypes;
const { CLOSED, REFERRAL } = CaseStatusConstants;
const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
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
  margin-left: 16px;
`;

const Status = styled.div`
  color: ${NEUTRAL.N900};
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
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
        const description = getPropertyValue(caseStatus, [DESCRIPTION, 0]);
        const datetime = getPropertyValue(caseStatus, [EFFECTIVE_DATE, 0]);
        const status = getPropertyValue(caseStatus, [STATUS, 0]);
        const date = formatAsDate(datetime);

        const staffMemberWhoRecordedStatus :Map = staffMemberByStatusEKID.get(caseStatusEKID, Map());
        const referralSource = getPropertyValue(referralRequest, [SOURCE, 0]);

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
                  <Status subtle>{status}</Status>
                  <StatusDescription>
                    {status === CLOSED && description}
                    {(status === REFERRAL && isDefined(referralRequest)) && referralSource}
                    {(status !== CLOSED
                        && status !== REFERRAL
                        && !staffMemberWhoRecordedStatus.isEmpty())
                        && `Case Manager: ${getPersonName(staffMemberWhoRecordedStatus)}`}
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
