import { msg, t } from '@lingui/core/macro';
import { DebRepositoryAPI } from 'src/api';
import { SyncModal } from 'src/components';
import { handleHttpError, parsePulpIDFromURL, taskAlert } from 'src/utilities';
import { Action } from './action';

// pulp_deb's own API default for a sync. ansible and file offer to mirror
// instead, and this deliberately does not follow them: mirroring deletes local
// content the remote no longer has, so it is the direction to opt into rather
// than out of.
const MIRROR_BY_DEFAULT = false;

export const debRepositorySyncAction = Action({
  title: msg`Sync`,
  modal: ({ addAlert, query, setState, state }) =>
    state.syncModalOpen ? (
      <SyncModal
        closeAction={() => setState({ syncModalOpen: null })}
        defaultMirror={MIRROR_BY_DEFAULT}
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
    hasPermission('deb.change_aptrepository'),
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
  return DebRepositoryAPI.sync(
    pulpId,
    syncParams || { mirror: MIRROR_BY_DEFAULT },
  )
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
