// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { CaseStatusConstants } from '../../containers/profile/src/constants';
import { PropertyTypes } from '../../core/edm/constants';
import { MM_DD_YYYY } from '../../utils/datetime/constants';
import { getPersonName } from '../../utils/people';

const {
  DATETIME_COMPLETED,
  DESCRIPTION,
  EFFECTIVE_DATE,
  SOURCE,
  STATUS,
} = PropertyTypes;
const { CLOSED, REFERRAL } = CaseStatusConstants;
const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;

const TimelineContentWrapper = styled.div`
  display: flex;

  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
  }
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
        let date = DateTime.fromISO(datetime).toFormat(MM_DD_YYYY);
        if (status === REFERRAL) {
          const datetimeOfReferral = getPropertyValue(referralRequest, [DATETIME_COMPLETED, 0]);
          date = DateTime.fromISO(datetimeOfReferral).toFormat(MM_DD_YYYY);
        }

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
                <Typography variant="subtitle1">{date}</Typography>
                <div>
                  <Typography variant="overline">{status}</Typography>
                  <Typography variant="body1">
                    {status === CLOSED && description}
                    {(status === REFERRAL && isDefined(referralRequest)) && referralSource}
                    {(status !== CLOSED
                        && status !== REFERRAL
                        && !staffMemberWhoRecordedStatus.isEmpty())
                        && `Case Manager: ${getPersonName(staffMemberWhoRecordedStatus)}`}
                  </Typography>
                </div>
              </TimelineContentWrapper>
            </TimelineContent>
          </TimelineItem>
        );
      })
    }
  </Timeline>
);

export default CaseTimeline;
