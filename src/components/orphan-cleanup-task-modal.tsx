import { t } from '@lingui/macro';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  NumberInput,
} from '@patternfly/react-core';
import React from 'react';

interface IProps {
  cancelAction: () => void;
  confirmAction?: () => void;
  taskValue: { orphan_protection_time: number };
  updateTask: (t) => void;
}

export const OrphanCleanupTaskModal = (props: IProps) => {
  const { cancelAction, confirmAction, taskValue, updateTask } = props;

  return (
    <Modal
      actions={[
        <Button key='confirm' onClick={confirmAction} variant='primary'>
          {t`Yes`}
        </Button>,
        <Button key='cancel' onClick={cancelAction} variant='link'>
          {t`Cancel`}
        </Button>,
      ]}
      isOpen
      onClose={cancelAction}
      title={t`Orphan cleanup task`}
      description={t`Trigger an asynchronous orphan cleanup operation.`}
      titleIconVariant='info'
      variant='medium'
    >
      <Form>
        <FormGroup
          fieldId={'orphan_protection_time'}
          label={t`Orphan protection time:`}
        >
          <NumberInput
            id={'orphan_protection_time'}
            value={taskValue.orphan_protection_time}
            onMinus={() => {
              updateTask({
                orphan_protection_time: taskValue.orphan_protection_time - 1,
              });
            }}
            min={0}
            max={100}
            onPlus={() => {
              updateTask({
                orphan_protection_time: taskValue.orphan_protection_time + 1,
              });
            }}
          />
          <br />
        </FormGroup>
      </Form>
    </Modal>
  );
};
