import { msg, t } from '@lingui/core/macro';
import { RPMRepositoryAPI } from 'src/api';
import { SyncModal } from 'src/components';
import { handleHttpError, parsePulpIDFromURL, taskAlert } from 'src/utilities';
import { Action } from './action';

  // pulp_rpm's own API default, which never removes content. Mirroring is
  // opted into, never defaulted to.
  const DEFAULT_SYNC_POLICY = 'additive';

  const syncPolicies = () => [
    { id: 'additive', label: t`Additive: only add new content` },
    { id: 'mirror_content_only', label: t`Mirror content only` },
    { id: 'mirror_complete', label: t`Mirror complete (exact copy incl. metadata)` },
  ];

export const rpmRepositorySyncAction = Action({
  title: msg`Sync`,
  modal: ({ addAlert, query, setState, state }) =>
    state.syncModalOpen ? (
      <SyncModal
        closeAction={() => setState({ syncModalOpen: null })}
        defaultSyncPolicy={DEFAULT_SYNC_POLICY}
          syncPolicies={syncPolicies()}
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
    hasPermission('rpm.change_rpmrepository'),
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
  return RPMRepositoryAPI.sync(
    pulpId,
    {
        sync_policy: syncParams?.sync_policy || DEFAULT_SYNC_POLICY,
        optimize: syncParams?.optimize ?? true,
    },
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
