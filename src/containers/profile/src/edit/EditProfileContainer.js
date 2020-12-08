// @flow
import React from 'react';

import EditEmailForm from './EditEmailForm';
import EditPersonDetailsForm from './EditPersonDetailsForm';
import EditPersonForm from './EditPersonForm';
import EditPhoneForm from './EditPhoneForm';

const EditProfileContainer = () => (
  <>
    <EditPersonForm />
    <EditPersonDetailsForm />
    <EditPhoneForm />
    <EditEmailForm />
  </>
);

export default EditProfileContainer;
