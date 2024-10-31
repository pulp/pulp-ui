import { t } from '@lingui/macro';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  NumberInput,
} from '@patternfly/react-core';
import React from 'react';
import { FormFieldHelper } from 'src/components/form-field-helper';

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
            onChange={(event) => {
              // @ts-expect-error:Property 'value' does not exist on type 'EventTarget'.
              const value = Number(event.target.value);
              if (value < 0 || Number.isNaN(value)) {
                updateTask({
                  orphan_protection_time: 0,
                });
              } else {
                updateTask({
                  orphan_protection_time: value,
                });
              }
            }}
            min={0}
            onPlus={() => {
              updateTask({
                orphan_protection_time: taskValue.orphan_protection_time + 1,
              });
            }}
          />
          <FormFieldHelper>
            {t`The value is in minutes. Usually the default is a day (1440). If set to zero it will clean all orphans.`}
          </FormFieldHelper>
          <br />
        </FormGroup>
      </Form>
    </Modal>
  );
};
