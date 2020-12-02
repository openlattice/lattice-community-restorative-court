// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Button,
  Card,
  CardSegment,
  DatePicker,
  Input,
  Label,
  Select,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { CrumbItem, CrumbLink, Crumbs } from '../../../../components/crumbs';
import { PropertyTypes } from '../../../../core/edm/constants';
import { APP_PATHS, ProfileReduxConstants } from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { getPersonName } from '../../../../utils/people';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { searchPeople } from '../actions';
import { RoleConstants } from '../constants';

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { NOTES, ROLE } = PropertyTypes;
const { PERSON_CASE_NEIGHBOR_MAP, PROFILE, SELECTED_CASE } = ProfileReduxConstants;
const { RESPONDENT } = RoleConstants;

const SearchGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

type Props = {
  personId :UUID;
};

const AddPeopleToCaseForm = ({ personId } :Props) => {

  const personCase :Map = useSelector((store) => store.getIn([PROFILE, SELECTED_CASE]));
  const caseEKID :?UUID = getEntityKeyId(personCase);
  const caseNumber = getPropertyValue(personCase, [NOTES, 0]);
  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);
  const caseIdentifier = `Case #: ${caseNumber} - ${respondentPersonName}`;

  const [formInputs, setFormInputs] = useState({ firstName: '', lastName: '' });
  const [dob, setDOB] = useState('');

  const onInputChange = (e :SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const dispatch = useDispatch();

  const searchPeopleForCase = () => {
    dispatch(searchPeople({ dob, firstName: formInputs.firstName, lastName: formInputs.lastName }));
  };

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbItem>
            <CrumbLink to={`${root}/${personId}`}>
              <Typography color="inherit" variant="body2">{ personName }</Typography>
            </CrumbLink>
          </CrumbItem>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Add People to Case</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Add People to Case</Typography>
        <Typography variant="body1" gutterBottom->
          Search for someone to add as a victim or peacemaker to this case.
        </Typography>
        <Typography variant="body2">{ caseIdentifier }</Typography>
      </CardSegment>
      <Card>
        <CardSegment padding="30px" vertical>
          <div>Search Participants</div>
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
            <Button aria-label="Search Button" onClick={searchPeopleForCase}>Search</Button>
          </SearchGrid>
        </CardSegment>
      </Card>
    </>
  );
};

export default AddPeopleToCaseForm;
