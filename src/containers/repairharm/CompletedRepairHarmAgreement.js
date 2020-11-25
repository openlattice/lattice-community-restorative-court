// @flow
import React from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { schema, uiSchema } from './schemas/CompletedRepairHarmSchemas';
import { populateCompletedForm } from './utils/RepairHarmAgreementUtils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { APP_PATHS, ProfileReduxConstants, RepairHarmReduxConstants } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { getPersonName } from '../../utils/people';
import { useSelector } from '../app/AppProvider';

const { FORM_NEIGHBOR_MAP, PERSON_CASE_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { REPAIR_HARM, SELECTED_REPAIR_HARM_AGREEMENT } = RepairHarmReduxConstants;
const { getEntityKeyId } = DataUtils;

type Props = {
  personId :UUID;
};

const CompletedRepairHarmAgreement = ({ personId } :Props) => {

  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));

  const selectedForm :Map = useSelector((store) => store.getIn([REPAIR_HARM, SELECTED_REPAIR_HARM_AGREEMENT]));
  const formEKID :?UUID = getEntityKeyId(selectedForm);
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP, formEKID], Map()));
  const personCaseNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const formData = populateCompletedForm(selectedForm, formNeighborMap, person, personCaseNeighborMap);
  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbLink to={`${root}/${personId}`}>
            <Typography color="inherit" variant="body2">{ personName }</Typography>
          </CrumbLink>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Repair Harm Agreement</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Repair Harm Agreement</Typography>
      </CardSegment>
      <Form
          disabled
          formData={formData}
          hideSubmit
          readOnly
          schema={schema}
          uiSchema={uiSchema} />
    </>
  );
};

export default CompletedRepairHarmAgreement;
