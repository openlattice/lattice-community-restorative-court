// @flow
import React from 'react';

import { Form } from 'lattice-fabricate';
import { Modal } from 'lattice-ui-kit';

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const AddContactActivityModal = ({ isVisible, onClose } :Props) => {
  const onSubmit = ({ formData }) => {

  };
  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling>
      <Form
          hideSubmit
          onSubmit={onSubmit} />
    </Modal>
  );
};

export default AddContactActivityModal;
