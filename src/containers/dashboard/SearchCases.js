// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  CheckboxSelect,
  Input,
  Label,
  PaginationToolbar,
  SearchResults,
} from 'lattice-ui-kit';
import { LangUtils, ReduxUtils } from 'lattice-utils';

import { SEARCH_CASES, searchCases } from './actions';
import { CASES_RESULT_LABELS } from './constants';

import { DashboardReduxConstants, ProfileReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { goToRoute } from '../../core/router/RoutingActions';
import { getPersonName } from '../../utils/people';
import { MAX_HITS } from '../../utils/search/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { getStaff } from '../profile/src/actions';
import { EMPTY_VALUE, RoleConstants } from '../profile/src/constants';

const { DASHBOARD, SEARCHED_CASES_DATA, TOTAL_CASES_HITS } = DashboardReduxConstants;
const { PROFILE, STAFF_MEMBERS } = ProfileReduxConstants;
const { CASE_MANAGER } = RoleConstants;
const { isFailure, isPending, isSuccess } = ReduxUtils;
const { isDefined } = LangUtils;

const NO_CASE_MANAGER = 'No Case Manager';

const SearchGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 2fr 1fr;
  width: 100%;

  span:last-child {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
`;

const SearchCases = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStaff());
  }, [dispatch]);

  const [caseNumberInput, setCaseNumberInput] = useState('');
  const [page, setPage] = useState(1);
  const [selectedStaffMembers, selectStaffMembers] = useState([]);

  const searchDACases = (e :SyntheticEvent<HTMLInputElement> | void, startIndex :?number) => {
    dispatch(searchCases({
      caseNumberInput,
      maxHits: MAX_HITS,
      start: startIndex || 0,
    }));
  };

  let casesData :List = useSelector((store) => store.getIn([DASHBOARD, SEARCHED_CASES_DATA]));
  const totalHits = useSelector((store) => store.getIn([DASHBOARD, TOTAL_CASES_HITS]));
  const searchCasesRequestState = useSelector((store) => store.getIn([DASHBOARD, SEARCH_CASES, REQUEST_STATE]));
  const hasSearched :boolean = isSuccess(searchCasesRequestState) || isFailure(searchCasesRequestState);

  const onPageChange = ({ page: newPage, start } :Object) => {
    searchDACases(undefined, start);
    setPage(newPage);
  };

  const staffMembers :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS]));
  const staffOptions = staffMembers
    .map((staffPerson :Map) => {
      const staffMemberName = getPersonName(staffPerson);
      return {
        label: staffMemberName,
        value: staffMemberName,
      };
    })
    .push({ label: NO_CASE_MANAGER, value: NO_CASE_MANAGER })
    .toJS();

  if (isDefined(selectedStaffMembers) && selectedStaffMembers.length) {
    casesData = casesData.filter((caseResult) => {
      const selectedStaffMemberNames = selectedStaffMembers.map((staffMember) => staffMember.value);
      return selectedStaffMemberNames.includes(caseResult.get(CASE_MANAGER))
        || (selectedStaffMemberNames.includes(NO_CASE_MANAGER) && caseResult.get(CASE_MANAGER) === EMPTY_VALUE);
    });
  }
  const goToProfile = (clickedResult :Map) => {
    const personEKID = clickedResult.get('respondentEKID');
    dispatch(goToRoute(`/profile/${personEKID}`));
  };

  return (
    <>
      <SearchGrid>
        <span>
          <Label>Case Number</Label>
          <Input
              name="caseNumber"
              onChange={(e) => {
                setCaseNumberInput(e.currentTarget.value);
              }} />
        </span>
        <span>
          <Button
              arialabelledby="searchPeople"
              color="primary"
              isLoading={false}
              onClick={searchDACases}>
            Search
          </Button>
        </span>
      </SearchGrid>
      { hasSearched && (
        <>
          <Label>Filter by Staff Member</Label>
          <CheckboxSelect
              onChange={selectStaffMembers}
              options={staffOptions} />
        </>
      )}
      {
        (hasSearched && !casesData.isEmpty()) && (
          <PaginationToolbar
              count={totalHits}
              onPageChange={onPageChange}
              page={page}
              rowsPerPage={MAX_HITS} />
        )
      }
      <SearchResults
          hasSearched={hasSearched}
          isLoading={isPending(searchCasesRequestState)}
          onResultClick={goToProfile}
          resultLabels={CASES_RESULT_LABELS}
          results={casesData} />
    </>
  );
};

export default SearchCases;
