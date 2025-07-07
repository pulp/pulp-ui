import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Button, FormGroup, Modal, Switch } from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { DebianRepositoryAPI } from 'src/api';
import { HelpButton, Spinner } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { handleHttpError, parsePulpIDFromURL, taskAlert } from 'src/utilities';
import { Action } from './action';

const SyncModal = ({
  closeAction,
  syncAction,
  name,
}: {
  closeAction: () => void;
  syncAction: (syncParams: any) => Promise<void>;
  name: string;
}) => {
  const [pending, setPending] = useState(false);
  const [syncParams, setSyncParams] = useState({
    mirror: true,
    optimize: true,
  });

  useEffect(() => {
    setPending(false);
    setSyncParams({ mirror: true, optimize: true });
  }, [name]);

  if (!name) {
    return null;
  }

  return (
    <Modal
      actions={[
        <div data-cy='sync-button' key='sync'>
          <Button
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
            content={t`If selected, all content not in the remote will be removed from the local repository.`}
          />
        }
      >
        <Switch
          isChecked={syncParams.mirror}
          onChange={(_e, mirror) => setSyncParams({ ...syncParams, mirror })}
          label={t`Remove local content not in remote`}
          labelOff={t`Only add missing content`}
        />
      </FormGroup>

      <FormGroup
        label={t`Optimize`}
        labelIcon={
          <HelpButton
            content={t`Only sync if changes are reported by the remote. Disable to force sync.`}
          />
        }
      >
        <Switch
          isChecked={syncParams.optimize}
          onChange={(_e, optimize) =>
            setSyncParams({ ...syncParams, optimize })
          }
          label={t`Only sync if remote changed`}
          labelOff={t`Force sync always`}
        />
      </FormGroup>
    </Modal>
  );
};

export const debianRemoteSyncAction = Action({
  title: msg`Sync`,
  modal: ({ addAlert, query, setState, state }) =>
    state.syncModalOpen ? (
      <SyncModal
        closeAction={() => setState({ syncModalOpen: null })}
        syncAction={(syncParams) =>
          syncRepository(state.syncModalOpen, { addAlert, query }, syncParams)
        }
        name={state.syncModalOpen.name}
      />
    ) : null,
  onClick: ({ name, pulp_href }, { setState }) =>
    setState({
      syncModalOpen: { name, pulp_href },
    }),
  visible: (_item, { hasPermission }) =>
    hasPermission('deb.change_debremote'),
  disabled: ({ remote, last_sync_task }) => {
    if (!remote) {
      return t`No remotes associated with this repository.`;
    }

    if (
      last_sync_task &&
      ['running', 'waiting'].includes(last_sync_task.state)
    ) {
      return t`Sync task is already queued.`;
    }

    return null;
  },
});

function syncRepository(
  { name, pulp_href },
  { addAlert, query },
  syncParams: any,
) {
  const pulpId = parsePulpIDFromURL(pulp_href);
  return DebianRepositoryAPI.sync(pulpId, syncParams)
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Sync started for repository "${name}".`));
      query?.();
    })
    .catch(
      handleHttpError(
        t`Failed to sync repository "${name}"`,
        () => null,
        addAlert,
      ),
    );
}
