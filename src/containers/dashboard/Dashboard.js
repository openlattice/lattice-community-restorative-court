// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardHeader,
  CardSegment,
  Table,
  Typography,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import AddStaffModal from './AddStaffModal';
import { GET_STAFF_CASES_DATA, getCasesStats, getStaffCasesData } from './actions';
import { CASES_STATS_CONSTANTS, STAFF_CASES_TABLE_HEADERS } from './constants';

import {
  APP_PATHS,
  DashboardReduxConstants,
  ProfileReduxConstants,
  REQUEST_STATE,
} from '../../core/redux/constants';
import { generateTableHeaders } from '../../utils/table';
import { useDispatch, useSelector } from '../app/AppProvider';
import { initializeApplication } from '../app/actions';
import { getStaff } from '../profile/src/actions';

const { isPending } = ReduxUtils;
const { CASES_STATS, DASHBOARD, STAFF_CASES_DATA } = DashboardReduxConstants;
const { PROFILE, STAFF_MEMBERS } = ProfileReduxConstants;
const {
  NO_CONTACT,
  OPEN_CASES,
  RESPONDENT_DECLINED,
  SUCCESSFUL,
  TERMINATED,
  TOTAL_CASES,
} = CASES_STATS_CONSTANTS;

const staffCasesTableHeaders = generateTableHeaders(STAFF_CASES_TABLE_HEADERS.valueSeq().toList());

const StatsGridRow = styled.div`
  display: grid;
  grid-gap: 10px 20px;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 30px;
  width: 100%;
`;

const TableHeader = styled(CardHeader)`
  border: none;
  font-size: 20px;
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const Dashboard = ({ match, organizationId, root } :Props) => {

  const [isStaffModalOpen, openStaffModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApplication({ match, organizationId, root }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) {
      dispatch(getStaffCasesData());
      dispatch(getCasesStats());
      dispatch(getStaff());
    }
  }, [appConfig, dispatch]);

  const casesStats :Map = useSelector((store :Map) => store.getIn([DASHBOARD, CASES_STATS]));
  const staffCasesData :List = useSelector((store :Map) => store.getIn([DASHBOARD, STAFF_CASES_DATA]));
  const fetchRequestState = useSelector((store :Map) => store.getIn([DASHBOARD, GET_STAFF_CASES_DATA, REQUEST_STATE]));
  const staffMembers :List = useSelector((store :Map) => store.getIn([PROFILE, STAFF_MEMBERS]));

  return (
    <>
      <StatsGridRow>
        <Card>
          <CardSegment>
            <Typography variant="h3">{TOTAL_CASES}</Typography>
            <Typography variant="h1">{casesStats.get(TOTAL_CASES, 0)}</Typography>
          </CardSegment>
        </Card>
        <Card>
          <CardSegment>
            <Typography variant="h3">{OPEN_CASES}</Typography>
            <Typography variant="h1">{casesStats.get(OPEN_CASES, 0)}</Typography>
          </CardSegment>
        </Card>
        <Card>
          <CardSegment>
            <Typography variant="h3">{SUCCESSFUL}</Typography>
            <Typography variant="h1">{casesStats.get(SUCCESSFUL, 0)}</Typography>
          </CardSegment>
        </Card>
      </StatsGridRow>
      <StatsGridRow>
        <Card>
          <CardSegment>
            <Typography variant="h3">{TERMINATED}</Typography>
            <Typography variant="h1">{casesStats.get(TERMINATED, 0)}</Typography>
          </CardSegment>
        </Card>
        <Card>
          <CardSegment>
            <Typography variant="h3">{RESPONDENT_DECLINED}</Typography>
            <Typography variant="h1">{casesStats.get(RESPONDENT_DECLINED, 0)}</Typography>
          </CardSegment>
        </Card>
        <Card>
          <CardSegment>
            <Typography variant="h3">{NO_CONTACT}</Typography>
            <Typography variant="h1">{casesStats.get(NO_CONTACT, 0)}</Typography>
          </CardSegment>
        </Card>
      </StatsGridRow>
      <Card>
        <TableHeader>Staff Cases</TableHeader>
        <CardSegment padding="0">
          <Table
              data={staffCasesData.toJS()}
              headers={staffCasesTableHeaders}
              isLoading={isPending(fetchRequestState)} />
        </CardSegment>
      </Card>
      <ButtonWrapper>
        <Button onClick={() => openStaffModal(true)} variant="text" mode="primary">+Add Staff Member</Button>
      </ButtonWrapper>
      <AddStaffModal
          isVisible={isStaffModalOpen}
          onClose={() => openStaffModal(false)}
          staffMembers={staffMembers} />
    </>
  );
};

export default Dashboard;
