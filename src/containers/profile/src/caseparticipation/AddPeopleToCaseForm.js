// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  Colors,
  DatePicker,
  Input,
  Label,
  PaginationToolbar,
  SearchResults,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import AddPersonToCaseModal from './AddPersonToCaseModal';

import { CrumbItem, CrumbLink, Crumbs } from '../../../../components/crumbs';
import { PropertyTypes } from '../../../../core/edm/constants';
import { APP_PATHS, ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { getPersonName } from '../../../../utils/people';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { SEARCH_PEOPLE, clearSearchedPeople, searchPeople } from '../actions';
import { RoleConstants } from '../constants';

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isFailure, isPending, isSuccess } = ReduxUtils;
const { DOB, NOTES, ROLE } = PropertyTypes;
const {
  PERSON_CASE_NEIGHBOR_MAP,
  PROFILE,
  SEARCHED_PEOPLE,
  SELECTED_CASE,
  TOTAL_HITS,
} = ProfileReduxConstants;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;
const { NEUTRAL } = Colors;

const MAX_HITS = 10;

const labels = Map({
  name: 'Name',
  personDOB: 'Date of Birth',
});

const SearchGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const CaseRoleTextWrapper = styled.div`
  color: ${NEUTRAL.N500};
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

type Props = {
  personId :UUID;
};

const AddPeopleToCaseForm = ({ personId } :Props) => {

  const personCase :Map = useSelector((store) => store.getIn([PROFILE, SELECTED_CASE]));
  const caseEKID :?UUID = getEntityKeyId(personCase);
  const caseNumber = getPropertyValue(personCase, [NOTES, 0]);
  const caseIdentifier = `Case #: ${caseNumber}`;

  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);
  const respondentText = `Respondent: ${respondentPersonName}`;
  const peacemakerPerson = caseRoleMap.getIn([PEACEMAKER, 0], Map());
  const peacemakerPersonName = getPersonName(peacemakerPerson);
  const peacemakerText = `Peacemaker: ${peacemakerPersonName}`;
  const victims = caseRoleMap.get(VICTIM, List());
  const victimNames = victims.map((victim) => getPersonName(victim)).toJS();
  const victimText = `Victims: ${victimNames.join(', ')}`;

  const [formInputs, setFormInputs] = useState({ firstName: '', lastName: '' });
  const [dob, setDOB] = useState('');
  const [page, setPage] = useState(1);
  const [modalIsVisible, setModalVisibility] = useState(false);
  const [selectedPerson, selectPersonForModal] = useState(Map());

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
      start,
    }));
  };

  const onPageChange = ({ page: newPage, start } :Object) => {
    searchPeopleForCase(undefined, start);
    setPage(newPage);
  };

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  const searchedPeople :List = useSelector((store) => store.getIn([PROFILE, SEARCHED_PEOPLE]));
  const totalHits :List = useSelector((store) => store.getIn([PROFILE, TOTAL_HITS]));
  const data = searchedPeople.map((searchedPerson :Map) => {
    const name = getPersonName(searchedPerson);
    const personDOB = getPropertyValue(searchedPerson, [DOB, 0]);
    return Map({ name, person: searchedPerson, personDOB });
  });

  const searchPeopleRequestState = useSelector((store) => store.getIn([PROFILE, SEARCH_PEOPLE, REQUEST_STATE]));
  const isSearching :boolean = isPending(searchPeopleRequestState);
  const hasSearched :boolean = isFailure(searchPeopleRequestState) || isSuccess(searchPeopleRequestState);

  useEffect(() => {
    const resetSearchedPeopleList = () => {
      dispatch(clearSearchedPeople());
    };
    return resetSearchedPeopleList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={`${root}/${personId}`}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Add People to Case</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Add People to Case</Typography>
        <Typography gutterBottom>
          Search for someone to add as a victim or peacemaker to this case.
        </Typography>
        <Typography variant="body2" gutterBottom>{ caseIdentifier }</Typography>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>{ respondentText }</Typography>
        </CaseRoleTextWrapper>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>{ peacemakerText }</Typography>
        </CaseRoleTextWrapper>
        <CaseRoleTextWrapper>
          <Typography color="inherit" variant="body2" gutterBottom>{ victimText }</Typography>
        </CaseRoleTextWrapper>
      </CardSegment>
      <Card>
        <CardSegment padding="30px" vertical>
          <Typography variant="h5">Search People</Typography>
          <SearchGrid>
            <div>
              <Label>First name</Label>
              <Input
                  name="firstName"
                  onChange={onInputChange} />
            </div>
            <div>
              <Label>Last name</Label>
              <Input
                  name="lastName"
                  onChange={onInputChange} />
            </div>
            <div>
              <Label>Date of birth</Label>
              <DatePicker onChange={(date :string) => setDOB(date)} />
            </div>
            <ButtonWrapper>
              <Button aria-label="Search Button" isLoading={isSearching} onClick={searchPeopleForCase}>Search</Button>
            </ButtonWrapper>
          </SearchGrid>
        </CardSegment>
      </Card>
      {
        (hasSearched && !data.isEmpty()) && (
          <div>
            <Typography gutterBottom>Click on a participant to select a role and add them to the case.</Typography>
            <PaginationToolbar
                count={totalHits}
                onPageChange={onPageChange}
                page={page}
                rowsPerPage={MAX_HITS} />
          </div>
        )
      }
      <SearchResults
          hasSearched={hasSearched}
          isLoading={isSearching}
          onResultClick={(clickedPerson :Map) => {
            selectPersonForModal(clickedPerson.get('person'));
            setModalVisibility(true);
          }}
          resultLabels={labels}
          results={data} />
      <AddPersonToCaseModal
          isVisible={modalIsVisible}
          onClose={() => setModalVisibility(false)}
          personCase={personCase}
          selectedPerson={selectedPerson} />
    </>
  );
};

export default AddPeopleToCaseForm;
