import { msg, t } from '@lingui/core/macro';
import { FileRepositoryAPI } from 'src/api';
import { SyncModal } from 'src/components';
import { handleHttpError, parsePulpIDFromURL, taskAlert } from 'src/utilities';
import { Action } from './action';

export const fileRepositorySyncAction = Action({
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
    hasPermission('file.change_collectionremote'),
  disabled: ({ remote, last_sync_task }) => {
    if (!remote) {
      return t`There are no remotes associated with this repository.`;
    }

    if (
      last_sync_task &&
      ['running', 'waiting'].includes(last_sync_task.state)
    ) {
      return t`Sync task is already queued.`;
    }
  },
});

function syncRepository({ name, pulp_href }, { addAlert, query }, syncParams) {
  const pulpId = parsePulpIDFromURL(pulp_href);
  return FileRepositoryAPI.sync(pulpId, syncParams || { mirror: true })
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Sync started for repository "${name}".`));

      query();
    })
    .catch(
      handleHttpError(
        t`Failed to sync repository "${name}"`,
        () => null,
        addAlert,
      ),
    );
}
