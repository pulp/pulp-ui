import { msg, t } from '@lingui/core/macro';
import { FileRemoteAPI } from '../api/file-remote';
import { DeleteRemoteModal } from '../components/delete-remote-modal';
import { handleHttpError } from '../utilities/fail-alerts';
import { parsePulpIDFromURL } from '../utilities/parse-pulp-id';
import { taskAlert } from '../utilities/task-alert';
import { waitForTaskUrl } from '../utilities/wait-for-task';
import { Action } from './action';

export const fileRemoteDeleteAction = Action({
  title: msg`Delete`,
  modal: ({ addAlert, listQuery, setState, state }) =>
    state.deleteModalOpen ? (
      <DeleteRemoteModal
        closeAction={() => setState({ deleteModalOpen: null })}
        deleteAction={() =>
          deleteRemote(state.deleteModalOpen, { addAlert, setState, listQuery })
        }
        name={state.deleteModalOpen.name}
      />
    ) : null,
  onClick: (
    { name, id, pulp_href }: { name: string; id?: string; pulp_href?: string },
    { setState },
  ) =>
    setState({
      deleteModalOpen: { pulpId: id || parsePulpIDFromURL(pulp_href), name },
    }),
});

function deleteRemote({ name, pulpId }, { addAlert, setState, listQuery }) {
  return FileRemoteAPI.delete(pulpId)
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Removal started for remote ${name}`));
      setState({ deleteModalOpen: null });
      return waitForTaskUrl(data.task);
    })
    .then(() => listQuery())
    .catch(
      handleHttpError(t`Failed to remove remote ${name}`, () => null, addAlert),
    );
}
