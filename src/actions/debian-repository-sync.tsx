import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Button, FormGroup, Modal, Switch } from '@patternfly/react-core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { DebianRepositoryAPI } from 'src/api';
import { Spinner, HelpButton } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { handleHttpError, parsePulpIDFromURL, taskAlert } from 'src/utilities';
import { Action } from './action';

const SyncModal = ({
  closeAction,
  syncAction,
  name,
}: {
  closeAction: () => null;
  syncAction: (syncParams: { mirror: boolean; optimize: boolean }) => Promise<void>;
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

  if (!name) return null;

  return (
    <Modal
      actions={[
        <Button
          key="sync"
          onClick={() => {
            setPending(true);
            syncAction(syncParams).then(closeAction).finally(() => setPending(false));
          }}
          variant="primary"
          isDisabled={pending}
        >
          {t`Sync`}
          {pending && <Spinner size="sm" />}
        </Button>,
        <Button key="close" onClick={closeAction} variant="link">
          {t`Close`}
        </Button>,
      ]}
      isOpen
      onClose={closeAction}
      title={t`Sync repository "${name}"`}
      variant="medium"
    >
      <FormGroup
        label={t`Mirror`}
        labelIcon={
          <HelpButton content={t`Remove local content not in the remote if enabled.`} />
        }
      >
        <Switch
          isChecked={syncParams.mirror}
          onChange={(_event, mirror) => setSyncParams({ ...syncParams, mirror })}
          label={t`Mirror content`}
          labelOff={t`Don't mirror`}
        />
      </FormGroup>

      <br />

      <FormGroup
        label={t`Optimize`}
        labelIcon={
          <HelpButton
            content={t`Only sync if changes are reported by the remote server.`}
          />
        }
      >
        <Switch
          isChecked={syncParams.optimize}
          onChange={(_event, optimize) => setSyncParams({ ...syncParams, optimize })}
          label={t`Optimize sync`}
          labelOff={t`Force sync`}
        />
      </FormGroup>
    </Modal>
  );
};

export const debianRepositorySyncAction = Action({
  title: msg`Sync`,
  modal: ({ addAlert, query, setState, state }) =>
    state.syncModalOpen ? (
      <SyncModal
        name={state.syncModalOpen.name}
        closeAction={() => setState({ syncModalOpen: null })}
        syncAction={(syncParams) =>
          syncRepository(state.syncModalOpen, { addAlert, query }, syncParams)
        }
      />
    ) : null,
  onClick: ({ name, pulp_href }, { setState }) =>
    setState({ syncModalOpen: { name, pulp_href } }),
  visible: (_item, { hasPermission }) => hasPermission('deb.change_repository'),
  disabled: ({ remote, last_sync_task }) => {
    if (!remote) {
      return t`There are no remotes associated with this repository.`;
    }

    if (last_sync_task && ['running', 'waiting'].includes(last_sync_task.state)) {
      return t`Sync task is already queued.`;
    }

    // Galaxy-style checks not required for debian remotes
    return null;
  },
});

function syncRepository(
  { name, pulp_href },
  { addAlert, query },
  syncParams: { mirror: boolean; optimize: boolean },
) {
  const pulpId = parsePulpIDFromURL(pulp_href);
  return DebianRepositoryAPI.sync(pulpId, syncParams)
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Sync started for repository "${name}".`));
      query();
    })
    .catch(
      handleHttpError(t`Failed to sync repository "${name}"`, () => null, addAlert),
    );
}
