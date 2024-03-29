// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  Chip,
  DatePicker,
  Input,
  Label,
  PaginationToolbar,
  Radio,
  SearchResults,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import AddPersonToCaseModal from './AddPersonToCaseModal';
import RemovePersonFromCaseModal from './RemovePersonFromCaseModal';

import { CrumbItem, CrumbLink, Crumbs } from '../../../../components/crumbs';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import {
  APP_PATHS,
  ProfileReduxConstants,
  REQUEST_STATE,
  ReferralReduxConstants,
} from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { getPersonName } from '../../../../utils/people';
import { getRelativeRoot } from '../../../../utils/router';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import {
  SEARCH_ORGANIZATIONS,
  SEARCH_PEOPLE,
  clearSearchedOrganizations,
  clearSearchedPeople,
  searchOrganizations,
  searchPeople,
} from '../actions';
import { RoleConstants, SearchContextConstants } from '../constants';

const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const {
  isFailure,
  isPending,
  isSuccess,
  reduceRequestStates,
} = ReduxUtils;
const { DA_CASE, REFERRAL_REQUEST } = AppTypes;
const {
  DA_CASE_NUMBER,
  DOB,
  NOTES,
  ORGANIZATION_NAME,
  ROLE,
} = PropertyTypes;
const {
  PERSON_CASE_NEIGHBOR_MAP,
  PROFILE,
  SEARCHED_ORGANIZATIONS,
  SEARCHED_PEOPLE,
  SELECTED_CASE,
  TOTAL_HITS,
} = ProfileReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const {
  CASE_MANAGER,
  PEACEMAKER,
  RESPONDENT,
  VICTIM,
} = RoleConstants;
const { ORGS_CONTEXT, PEOPLE_CONTEXT, STAFF_CONTEXT } = SearchContextConstants;

const MAX_HITS = 10;

const personLabels = Map({
  name: 'Name',
  personDOB: 'Date of Birth',
});

const orgLabels = Map({
  name: 'Organization Name',
});

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;

  span:last-child {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
`;

const CaseRoleTextWrapper = styled.div`
  display: flex;
  grid-gap: 10px;
  grid-template-columns: auto;
  margin-bottom: 10px;
  width: 100%;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(3, 200px);
  margin-bottom: 40px;
`;

const AddPeopleToCaseForm = () => {

  const personCase :Map = useSelector((store) => store.getIn([PROFILE, SELECTED_CASE]));
  const caseEKID :?UUID = getEntityKeyId(personCase);
  let caseNumber = getPropertyValue(personCase, [NOTES, 0]);

  const referralRequestList :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, REFERRAL_REQUEST, caseEKID], List()));
  const referralRequest :Map = referralRequestList.get(0, Map());
  const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
  const daCase :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP, DA_CASE, referralRequestEKID, 0], Map()));
  if (isDefined(daCase) && !daCase.isEmpty()) {
    const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0]);
    if (daCaseNumber) caseNumber = daCaseNumber;
  }

  const caseIdentifier = `Case #: ${caseNumber}`;

  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);
  const peacemakerPerson = caseRoleMap.getIn([PEACEMAKER, 0], Map());
  const peacemakerPersonName = getPersonName(peacemakerPerson);
  const victims = caseRoleMap.get(VICTIM, List());
  const victimNames = victims.map((victim) => {
    if (victim.has(ORGANIZATION_NAME)) return getPropertyValue(victim, [ORGANIZATION_NAME, 0]);
    return getPersonName(victim);
  }).toJS();
  const caseManagers = caseRoleMap.get(CASE_MANAGER, List());

  const [searchContext, setSearchContext] = useState(PEOPLE_CONTEXT);
  const [formInputs, setFormInputs] = useState({ firstName: '', lastName: '', organizationName: '' });
  const [dob, setDOB] = useState('');
  const [page, setPage] = useState(1);
  const [addPersonModalIsVisible, setAddPersonModalVisibility] = useState(false);
  const [selectedPerson, selectPersonForModal] = useState(Map());
  const [selectedOrganization, selectOrganizationForModal] = useState(Map());
  const [removePersonModalIsVisible, setRemovePersonModalVisibility] = useState(false);
  const [selectedPersonForDelete, selectPersonForDelete] = useState(Map());

  const isPersonContext = searchContext === PEOPLE_CONTEXT || searchContext === STAFF_CONTEXT;
  const isOrgContext = searchContext === ORGS_CONTEXT;

  const onInputChange = (e :SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const dispatch = useDispatch();

  const searchPeopleForCase = (e :SyntheticEvent<HTMLInputElement> | void, startIndex :?number) => {
    const start = startIndex || 0;
    dispatch(searchPeople({
      dob,
      firstName: formInputs.firstName,
      lastName: formInputs.lastName,
      maxHits: MAX_HITS,
      searchContext,
      start,
    }));
  };

  const searchOrganizationsForCase = (e :SyntheticEvent<HTMLInputElement> | void, startIndex :?number) => {
    const start = startIndex || 0;
    dispatch(searchOrganizations({ organizationName: formInputs.organizationName, maxHits: MAX_HITS, start }));
  };

  const onPageChange = ({ page: newPage, start } :Object) => {
    if (isPersonContext) {
      searchPeopleForCase(undefined, start);
    }
    if (isOrgContext) {
      searchOrganizationsForCase(undefined, start);
    }
    setPage(newPage);
  };

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);

  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const searchedPeople :List = useSelector((store) => store.getIn([PROFILE, SEARCHED_PEOPLE]));
  const searchedOrganizations :List = useSelector((store) => store.getIn([PROFILE, SEARCHED_ORGANIZATIONS]));
  const totalHits :List = useSelector((store) => store.getIn([PROFILE, TOTAL_HITS]));

  const data = (isPersonContext)
    ? searchedPeople.map((searchedPerson :Map) => {
      const name = getPersonName(searchedPerson);
      const personDOB = getPropertyValue(searchedPerson, [DOB, 0]);
      return Map({ name, person: searchedPerson, personDOB });
    })
    : searchedOrganizations.map((searchedOrg :Map) => {
      const name = getPropertyValue(searchedOrg, [ORGANIZATION_NAME, 0]);
      return Map({ name, organization: searchedOrg });
    });

  const searchPeopleRequestState = useSelector((store) => store.getIn([PROFILE, SEARCH_PEOPLE, REQUEST_STATE]));
  const searchOrganizationsRequestState = useSelector((store) => store
    .getIn([PROFILE, SEARCH_ORGANIZATIONS, REQUEST_STATE]));
  const reducedSearchRequestStates = reduceRequestStates([searchPeopleRequestState, searchOrganizationsRequestState]);
  const isSearching :boolean = isPending(reducedSearchRequestStates);
  const hasSearched :boolean = isSuccess(searchPeopleRequestState)
    || isSuccess(searchOrganizationsRequestState)
    || isFailure(reducedSearchRequestStates);
  useEffect(() => {
    const resetSearchedPeopleList = () => {
      dispatch(clearSearchedPeople());
    };
    return resetSearchedPeopleList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const resetSearchedOrgsList = () => {
      dispatch(clearSearchedOrganizations());
    };
    return resetSearchedOrgsList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OuterWrapper>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={relativeRoot}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Add People to Case</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Add People to Case</Typography>
        <Typography gutterBottom>
          Search for someone to add as a victim, peacemaker, or case manager to this case.
        </Typography>
        <Typography variant="body2" gutterBottom>{ caseIdentifier }</Typography>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>Respondent:</Typography>
          <Chip color="red" label={respondentPersonName} />
        </CaseRoleTextWrapper>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>Peacemaker:</Typography>
          <Chip color="blue" label={peacemakerPersonName} />
        </CaseRoleTextWrapper>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>Victims:</Typography>
          {victimNames.map((victimName :string) => <Chip color="green" label={victimName} />)}
        </CaseRoleTextWrapper>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>Case Manager:</Typography>
          {caseManagers.map((caseManager :Map) => (
            <Chip
                color="violet"
                label={getPersonName(caseManager)}
                onDelete={() => {
                  selectPersonForDelete(caseManager);
                  setRemovePersonModalVisibility(true);
                }} />
          ))}
        </CaseRoleTextWrapper>
      </CardSegment>
      <Card>
        <CardSegment padding="30px">
          <ButtonGrid>
            <Radio
                checked={searchContext === PEOPLE_CONTEXT}
                label="Search People"
                mode="button"
                onChange={() => setSearchContext(PEOPLE_CONTEXT)}
                name={PEOPLE_CONTEXT} />
            <Radio
                checked={isOrgContext}
                label="Search Organizations"
                mode="button"
                onChange={() => setSearchContext(ORGS_CONTEXT)}
                name={ORGS_CONTEXT} />
            <Radio
                checked={searchContext === STAFF_CONTEXT}
                label="Search Staff"
                mode="button"
                onChange={() => setSearchContext(STAFF_CONTEXT)}
                name={STAFF_CONTEXT} />
          </ButtonGrid>
          {
            (isPersonContext) && (
              <SearchGrid>
                <span>
                  <Label>First name</Label>
                  <Input
                      name="firstName"
                      onChange={onInputChange} />
                </span>
                <span>
                  <Label>Last name</Label>
                  <Input
                      name="lastName"
                      onChange={onInputChange} />
                </span>
                <span>
                  <Label>Date of birth</Label>
                  <DatePicker onChange={(date :string) => setDOB(date)} />
                </span>
                <span>
                  <Button
                      arialabelledby="searchPeople"
                      isLoading={isSearching}
                      onClick={searchPeopleForCase}>
                    Search
                  </Button>
                </span>
              </SearchGrid>
            )
          }
          {
            isOrgContext && (
              <SearchGrid>
                <span>
                  <Label>Organization Name</Label>
                  <Input
                      name="organizationName"
                      onChange={onInputChange} />
                </span>
                <span>
                  <Button
                      arialabelledby="searchOrganizations"
                      isLoading={isSearching}
                      onClick={searchOrganizationsForCase}>
                    Search
                  </Button>
                </span>
              </SearchGrid>
            )
          }
        </CardSegment>
      </Card>
      {
        (hasSearched && !data.isEmpty()) && (
          <CardSegment>
            <Typography gutterBottom>Click on a result to select a role and add them to the case.</Typography>
            <PaginationToolbar
                count={totalHits}
                onPageChange={onPageChange}
                page={page}
                rowsPerPage={MAX_HITS} />
          </CardSegment>
        )
      }
      <SearchResults
          hasSearched={hasSearched}
          isLoading={isSearching}
          onResultClick={(clickedEntity :Map) => {
            if (isPersonContext) {
              selectPersonForModal(clickedEntity.get('person'));
            }
            if (isOrgContext) {
              selectOrganizationForModal(clickedEntity.get('organization'));
            }
            setAddPersonModalVisibility(true);
          }}
          resultLabels={isOrgContext ? orgLabels : personLabels}
          results={data} />
      <AddPersonToCaseModal
          isVisible={addPersonModalIsVisible}
          onClose={() => setAddPersonModalVisibility(false)}
          personCase={personCase}
          searchContext={searchContext}
          selectedOrganization={selectedOrganization}
          selectedPerson={selectedPerson} />
      <RemovePersonFromCaseModal
          caseEKID={caseEKID || ''}
          isVisible={removePersonModalIsVisible}
          onClose={() => setRemovePersonModalVisibility(false)}
          selectedPerson={selectedPersonForDelete} />
    </OuterWrapper>
  );
};

export default AddPeopleToCaseForm;
