import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Text } from '@patternfly/react-core';
import { useState } from 'react';
import { DeleteModal } from 'src/components';

interface IProps {
  closeAction: () => void;
  deleteAction: () => void;
  name: string;
}

export const DeleteRepositoryModal = ({
  closeAction,
  deleteAction,
  name,
}: IProps) => {
  const [pending, setPending] = useState(false);

  if (!name) {
    return null;
  }

  return (
    <DeleteModal
      spinner={pending}
      cancelAction={() => {
        setPending(false);
        closeAction();
      }}
      deleteAction={() => {
        setPending(false);
        deleteAction();
      }}
      isDisabled={pending}
      title={t`Delete repository?`}
    >
      <Text>
        <Trans>
          Are you sure you want to delete the repository <b>{name}</b>?<br />
          <b>Note:</b> This will also delete all associated resources under this
          repository.
        </Trans>
      </Text>
    </DeleteModal>
  );
};
