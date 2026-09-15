import { msg, t } from '@lingui/core/macro';
import { DebDistributionAPI, DebRepositoryAPI } from 'src/api';
import { DeleteRepositoryModal } from 'src/components';
import {
  handleHttpError,
  parsePulpIDFromURL,
  taskAlert,
  waitForTaskUrl,
} from 'src/utilities';
import { Action } from './action';

export const debRepositoryDeleteAction = Action({
  title: msg`Delete`,
  modal: ({ addAlert, listQuery, setState, state }) =>
    state.deleteModalOpen ? (
      <DeleteRepositoryModal
        closeAction={() => setState({ deleteModalOpen: null })}
        deleteAction={() =>
          deleteRepository(state.deleteModalOpen, {
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

const DISTRIBUTION_PAGE_SIZE = 100;

// A repository can be serving more distributions than a single page holds, and
// any the lookup misses are left pointing at a repository that no longer exists.
async function listDistributions(repository) {
  const distributions = [];
  let page = 1;
  let count = Infinity;

  while (distributions.length < count) {
    const { data } = await DebDistributionAPI.list({
      repository,
      page,
      page_size: DISTRIBUTION_PAGE_SIZE,
    });

    // Also stops the loop should count ever disagree with what the pages return.
    if (!data.results?.length) {
      break;
    }

    distributions.push(...data.results);
    count = data.count;
    page++;
  }

  return distributions;
}

async function deleteRepository(
  { name, pulp_href, pulpId },
  { addAlert, setState, listQuery },
) {
  const distributionsToDelete = await listDistributions(pulp_href).catch(
    (e) => {
      handleHttpError(
        t`Failed to list distributions, removing only the repository.`,
        () => null,
        addAlert,
      )(e);
      return [];
    },
  );

  const deleteRepo = DebRepositoryAPI.delete(pulpId)
    .then(({ data }) => {
      addAlert(taskAlert(data.task, t`Removal started for repository ${name}`));
      return waitForTaskUrl(data.task);
    })
    .catch(
      handleHttpError(
        t`Failed to remove repository ${name}`,
        () => setState({ deleteModalOpen: null }),
        addAlert,
      ),
    );

  const deleteDistribution = ({ name, pulp_href }) => {
    const distribution_id = parsePulpIDFromURL(pulp_href);
    return DebDistributionAPI.delete(distribution_id)
      .then(({ data }) => {
        addAlert(
          taskAlert(data.task, t`Removal started for distribution ${name}`),
        );
        return waitForTaskUrl(data.task);
      })
      .catch(
        handleHttpError(
          t`Failed to remove distribution ${name}`,
          () => null,
          addAlert,
        ),
      );
  };

  return Promise.all([
    deleteRepo,
    ...distributionsToDelete.map(deleteDistribution),
  ]).then(() => {
    setState({ deleteModalOpen: null });
    listQuery();
  });
}
