// @flow

import React, { useCallback, useEffect } from 'react';

import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Button, CardSegment, Typography } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { APP_PATHS } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { getPersonName } from '../../utils/people';
import { useDispatch, useSelector } from '../app/AppProvider';

type Props = {
  personId :UUID;
};

const IntakeForm = ({ personId } :Props) => {
  const dispatch = useDispatch();
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
            <Typography color="inherit" variant="body2">Referral Information</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Intake Form</Typography>
        <Typography variant="body1">
          Edit the information below to add a new intake for this person.
        </Typography>
      </CardSegment>
      <Form />
    </>
  );
};

export default IntakeForm;
