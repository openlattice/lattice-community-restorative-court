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
import type { UUID } from 'lattice';

import { CrumbItem, CrumbLink, Crumbs } from '../../../../components/crumbs';
import { APP_PATHS } from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';

const SearchGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

type Props = {
  personId :UUID;
};

const AddPeopleToCaseForm = ({ personId } :Props) => {

  const [formInputs, setFormInputs] = useState({ firstName: '', lastName: '' });
  const [dob, setDOB] = useState('');

  const onInputChange = (e :SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const searchPeople = () => {

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
        <Typography variant="body1">
          Search for someone to add as a victim or peacemaker to this case.
        </Typography>
      </CardSegment>
      <Card>
        <CardSegment padding="30px" vertical>
          <div>Search Participants</div>
          <SearchGrid>
            <div>
              <Label>Last name</Label>
              <Input
                  name="lastName"
                  onChange={onInputChange} />
            </div>
            <div>
              <Label>First name</Label>
              <Input
                  name="firstName"
                  onChange={onInputChange} />
            </div>
            <div>
              <Label>Date of birth</Label>
              <DatePicker onChange={(date :string) => setDOB(date)} />
            </div>
            <Button aria-label="Search Button" onClick={searchPeople}>Search</Button>
          </SearchGrid>
        </CardSegment>
      </Card>
    </>
  );
};

export default AddPeopleToCaseForm;
