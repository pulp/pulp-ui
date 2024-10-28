import { t } from '@lingui/macro';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormGroup,
  Modal,
} from '@patternfly/react-core';
import React from 'react';
import { Alert } from 'src/components/patternfly-wrappers/l10n';

interface IProps {
  cancelAction: () => void;
  confirmAction?: () => void;
  taskValue: { finished_before: string; states: string[] };
  updateTask: (t) => void;
}

export const PurgeTaskModal = (props: IProps) => {
  const { cancelAction, confirmAction, taskValue, updateTask } = props;

  return (
    <Modal
      actions={[
        <Button
          key='confirm'
          onClick={confirmAction}
          variant='primary'
          isDisabled={taskValue.states.length === 0}
        >
          {t`Yes`}
        </Button>,
        <Button key='cancel' onClick={cancelAction} variant='link'>
          {t`Cancel`}
        </Button>,
      ]}
      isOpen
      onClose={cancelAction}
      title={t`Purge task`}
      titleIconVariant='info'
      variant='medium'
      description={t`Trigger an asynchronous task that deletes completed tasks that finished prior to a specified timestamp.`}
    >
      <Form>
        <FormGroup fieldId={'finished_before'} label={t`Finished before:`}>
          <DatePicker
            validators={[
              (value: Date) => {
                const today = new Date();
                //do not allow dates after today
                if (value > today) {
                  return t`Latest allowed date is today.`;
                }
                return null;
              },
            ]}
            value={taskValue.finished_before}
            onChange={(_, value) =>
              updateTask({ ...taskValue, finished_before: value })
            }
          />
        </FormGroup>
        <FormGroup fieldId={'states'} label={t`States:`}>
          {taskValue.states.length === 0 && (
            <Alert
              variant='danger'
              isInline
              title={t`At least one state has to be selected.`}
              ouiaId='DangerAlert'
            />
          )}
          <Checkbox
            id={'completed'}
            isChecked={taskValue.states.includes('completed')}
            onChange={(_, value) => {
              if (value) {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.concat(['completed']),
                });
              } else {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.filter(
                    (state) => state !== 'completed',
                  ),
                });
              }
            }}
            label={t`Completed`}
          />{' '}
          <br />
          <Checkbox
            id={'skipped'}
            isChecked={taskValue.states.includes('skipped')}
            onChange={(_, value) => {
              if (value) {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.concat(['skipped']),
                });
              } else {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.filter(
                    (state) => state !== 'skipped',
                  ),
                });
              }
            }}
            label={t`Skipped`}
          />
          <br />
          <Checkbox
            id={'failed'}
            isChecked={taskValue.states.includes('failed')}
            onChange={(_, value) => {
              if (value) {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.concat(['failed']),
                });
              } else {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.filter(
                    (state) => state !== 'failed',
                  ),
                });
              }
            }}
            label={t`Failed`}
          />
          <br />
          <Checkbox
            id={'canceled'}
            isChecked={taskValue.states.includes('canceled')}
            onChange={(_, value) => {
              if (value) {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.concat(['canceled']),
                });
              } else {
                updateTask({
                  ...taskValue,
                  states: taskValue.states.filter(
                    (state) => state !== 'canceled',
                  ),
                });
              }
            }}
            label={t`Canceled`}
          />
          <br />
        </FormGroup>
      </Form>
    </Modal>
  );
};
