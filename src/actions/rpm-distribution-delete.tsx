import { msg, t } from '@lingui/core/macro';
import { RPMDistributionAPI } from 'src/api';
import { DeleteDistributionModal } from 'src/components';
import {
  handleHttpError,
  parsePulpIDFromURL,
  taskAlert,
  waitForTaskUrl,
} from 'src/utilities';
import { Action } from './action';

export const rpmDistributionDeleteAction = Action({
  title: msg`Delete`,
  modal: ({ addAlert, listQuery, setState, state }) =>
    state.deleteModalOpen ? (
      <DeleteDistributionModal
        closeAction={() => setState({ deleteModalOpen: null })}
        deleteAction={() =>
          deleteDistribution(state.deleteModalOpen, {
            addAlert,
            listQuery,
            setState,
          })
        }
        name={state.deleteModalOpen.name}
      />
    ) : null,
  onClick: (
    { name, id, pulp_href }: { name: string; id?: string; pulp_href?: string },
    { setState },
  ) =>
    setState({
      deleteModalOpen: {
        pulpId: id || parsePulpIDFromURL(pulp_href),
        name,
        pulp_href,
      },
    }),
});

async function deleteDistribution(
  { name, pulpId },
  { addAlert, setState, listQuery },
) {
  const deleteDistribution = RPMDistributionAPI.delete(pulpId)
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Removal started for distribution ${name}`));
      return waitForTaskUrl(data.task);
    })
    .catch(
      handleHttpError(
        t`Failed to remove distribution ${name}`,
        () => setState({ deleteModalOpen: null }),
        addAlert,
      ),
    );

    return Promise.all([
        deleteDistribution,
    ]).then(() => {
        setState({ deleteModalOpen: null });
        listQuery();
    });
}
