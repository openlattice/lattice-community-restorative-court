// @flow
import React from 'react';

import EditAddressForm from './EditAddressForm';
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
    <EditAddressForm />
  </>
);

export default EditProfileContainer;
