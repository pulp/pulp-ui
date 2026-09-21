import { msg, t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';
import { AnsibleRepositoryAPI } from '../api/ansible-repository';
import { SyncModal } from '../components/sync-modal';
import { Paths, formatPath } from '../paths';
import { handleHttpError } from '../utilities/fail-alerts';
import { parsePulpIDFromURL } from '../utilities/parse-pulp-id';
import { taskAlert } from '../utilities/task-alert';
import { Action } from './action';

export const ansibleRepositorySyncAction = Action({
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
    hasPermission('ansible.change_collectionremote'),
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

    // Remote checks only available on detail screen; list will have remote: string, so no .url
    if (remote && remote.url === 'https://galaxy.ansible.com/api/') {
      const name = remote.name;
      const url = formatPath(Paths.ansible.remote.edit, { name });

      if (!remote.requirements_file) {
        return (
          <Trans>
            YAML requirements are required to sync from Galaxy. You can{' '}
            <Link to={url}>edit the {name} remote</Link> to add requirements.
          </Trans>
        );
      }

      if (remote.signed_only) {
        return (
          <Trans>
            Community content will never be synced if the remote is set to only
            sync signed content. You can{' '}
            <Link to={url}>edit the {name} remote</Link> to change it.
          </Trans>
        );
      }
    }

    return null;
  },
});

function syncRepository({ name, pulp_href }, { addAlert, query }, syncParams) {
  const pulpId = parsePulpIDFromURL(pulp_href);
  return AnsibleRepositoryAPI.sync(pulpId, syncParams || { mirror: true })
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
