// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Table,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import { GET_STAFF_CASES_DATA, getStaffCasesData } from './actions';
import { STAFF_CASES_TABLE_HEADERS } from './constants';

import { APP_PATHS, DashboardReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { generateTableHeaders } from '../../utils/table';
import { useDispatch, useSelector } from '../app/AppProvider';
import { initializeApplication } from '../app/actions';

const { isPending } = ReduxUtils;
const { DASHBOARD, STAFF_CASES_DATA } = DashboardReduxConstants;

const staffCasesTableHeaders = generateTableHeaders(STAFF_CASES_TABLE_HEADERS);

const TableHeader = styled(CardHeader)`
  border: none;
  font-size: 20px;
  font-weight: 600;
`;

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const Dashboard = ({ match, organizationId, root } :Props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApplication({ match, organizationId, root }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) {
      dispatch(getStaffCasesData());
    }
  }, [appConfig, dispatch]);

  const staffCasesData :List = useSelector((store :Map) => store.getIn([DASHBOARD, STAFF_CASES_DATA]));
  const fetchRequestState = useSelector((store :Map) => store.getIn([DASHBOARD, GET_STAFF_CASES_DATA, REQUEST_STATE]));

  return (
    <Card>
      <TableHeader>Staff Cases</TableHeader>
      <CardSegment padding="0">
        <Table
            data={staffCasesData.toJS()}
            headers={staffCasesTableHeaders}
            isLoading={isPending(fetchRequestState)} />
      </CardSegment>
    </Card>
  );
};

export default Dashboard;
