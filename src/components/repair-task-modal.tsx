import { t } from '@lingui/macro';
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  Modal,
} from '@patternfly/react-core';

interface IProps {
  cancelAction: () => void;
  confirmAction?: () => void;
  taskValue: { verify_checksums: boolean };
  updateTask: (t) => void;
}

export const RepairTaskModal = (props: IProps) => {
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
      title={t`Repair task`}
      titleIconVariant='info'
      variant='medium'
      description={t`Trigger an asynchronous task that checks for missing or corrupted artifacts, and attempts to redownload them.`}
    >
      <Form>
        <FormGroup fieldId={'states'}>
          <Checkbox
            id={'verify_checksum'}
            isChecked={taskValue.verify_checksums}
            onChange={(_, value) => {
              {
                updateTask({ verify_checksums: value });
              }
            }}
            label={t`Verify checksums`}
            description={t`Will verify that the checksum of all stored files matches what saved in the database. Otherwise only the existence of the files will be checked. Enabled by default.`}
          />
          <br />
        </FormGroup>
      </Form>
    </Modal>
  );
};
