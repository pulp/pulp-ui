import { t } from '@lingui/core/macro';
import { Button, FormGroup, Modal, Switch } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { HelpButton, Spinner } from 'src/components';

interface IProps {
  closeAction: () => null;
  // Which way the mirror switch starts. Plugins disagree: pulp_deb's API defaults
  // a sync to not mirroring, where ansible and file have always offered to.
  defaultMirror?: boolean;
  syncAction: (syncParams) => Promise<void>;
  name: string;
}

export const SyncModal = ({
  closeAction,
  defaultMirror = true,
  syncAction,
  name,
}: IProps) => {
  const [pending, setPending] = useState(false);
  const [syncParams, setSyncParams] = useState({
    mirror: defaultMirror,
    optimize: true,
  });

  useEffect(() => {
    setPending(false);
    setSyncParams({ mirror: defaultMirror, optimize: true });
  }, [name, defaultMirror]);

  if (!name) {
    return null;
  }

  return (
    <Modal
      actions={[
        <div data-cy='sync-button' key='sync'>
          <Button
            key='sync'
            onClick={() => {
              setPending(true);
              syncAction(syncParams)
                .then(closeAction)
                .finally(() => setPending(false));
            }}
            variant='primary'
            isDisabled={pending}
          >
            {t`Sync`}
            {pending && <Spinner size='sm' />}
          </Button>
        </div>,
        <Button key='close' onClick={closeAction} variant='link'>
          {t`Close`}
        </Button>,
      ]}
      isOpen
      onClose={closeAction}
      title={t`Sync repository "${name}"`}
      variant='medium'
    >
      <FormGroup
        label={t`Mirror`}
        labelIcon={
          <HelpButton
            content={t`If selected, all content that is not present in the remote repository will be removed from the local repository; otherwise, sync will add missing content.`}
          />
        }
      >
        <Switch
          isChecked={syncParams.mirror}
          onChange={(_event, mirror) =>
            setSyncParams({ ...syncParams, mirror })
          }
          label={t`Content not present in remote repository will be removed from the local repository`}
          labelOff={t`Sync will only add missing content`}
        />
      </FormGroup>
      <br />
      <FormGroup
        label={t`Optimize`}
        labelIcon={
          <HelpButton
            content={t`Only perform the sync if changes are reported by the remote server. To force a sync to happen, deselect this option.`}
          />
        }
      >
        <Switch
          isChecked={syncParams.optimize}
          onChange={(_event, optimize) =>
            setSyncParams({ ...syncParams, optimize })
          }
          label={t`Only perform the sync if changes are reported by the remote server.`}
          labelOff={t`Force a sync to happen.`}
        />
      </FormGroup>
      <br />
    </Modal>
  );
};
