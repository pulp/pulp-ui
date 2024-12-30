import { msg, t } from '@lingui/core/macro';
import {
  FileDistributionAPI,
  FileRepositoryAPI,
  type FileRepositoryType,
} from 'src/api';
import { Page, RepositoryForm } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL, taskAlert } from 'src/utilities';

const initialRepository: FileRepositoryType = {
  name: '',
  description: '',
  retain_repo_versions: 1,
  pulp_labels: {},
  remote: null,
};

const FileRepositoryEdit = Page<FileRepositoryType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.file.repository.list), name: t`Repositories` },
      name && {
        url: formatPath(Paths.file.repository.detail, { name }),
        name,
      },
      name ? { name: t`Edit` } : { name: t`Add` },
    ].filter(Boolean),

  displayName: 'FileRepositoryEdit',
  errorTitle: msg`Repository could not be displayed.`,
  listUrl: formatPath(Paths.file.repository.list),
  query: ({ name }) =>
    FileRepositoryAPI.list({ name }).then(
      ({ data: { results } }) => results[0],
    ),
  title: ({ name }) => name || t`Add new repository`,
  transformParams: ({ name, ...rest }) => ({
    ...rest,
    name: name !== '_' ? name : null,
  }),

  render: (item, { navigate, queueAlert, state, setState }) => {
    if (!state.repositoryToEdit) {
      const repositoryToEdit = {
        ...initialRepository,
        ...item,
      };
      setState({ repositoryToEdit, errorMessages: {} });
    }

    const { repositoryToEdit, errorMessages } = state;
    if (!repositoryToEdit) {
      return null;
    }

    const saveRepository = ({ createDistribution }) => {
      const { repositoryToEdit } = state;

      const data = { ...repositoryToEdit };

      // prevent "This field may not be blank." for nullable fields
      Object.keys(data).forEach((k) => {
        if (data[k] === '') {
          data[k] = null;
        }
      });

      if (item) {
        delete data.last_sync_task;
        delete data.last_synced_metadata_time;
        delete data.latest_version_href;
        delete data.pulp_created;
        delete data.pulp_href;
        delete data.versions_href;
      }

      data.pulp_labels ||= {};

      let promise = !item
        ? FileRepositoryAPI.create(data).then(({ data: newData }) => {
            queueAlert({
              variant: 'success',
              title: t`Successfully created repository ${data.name}`,
            });

            return newData.pulp_href;
          })
        : FileRepositoryAPI.update(
            parsePulpIDFromURL(item.pulp_href),
            data,
          ).then(({ data: task }) => {
            queueAlert(
              taskAlert(task, t`Update started for repository ${data.name}`),
            );

            return item.pulp_href;
          });

      if (createDistribution) {
        // only alphanumerics, slashes, underscores and dashes are allowed in base_path, transform anything else to _
        const basePathTransform = (name) =>
          name.replaceAll(/[^-a-zA-Z0-9_/]/g, '_');
        let distributionName = data.name;

        promise = promise
          .then((pulp_href) =>
            FileDistributionAPI.create({
              name: distributionName,
              base_path: basePathTransform(distributionName),
              repository: pulp_href,
            }).catch(() => {
              // if distribution already exists, try a numeric suffix to name & base_path
              distributionName =
                data.name + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
              return FileDistributionAPI.create({
                name: distributionName,
                base_path: basePathTransform(distributionName),
                repository: pulp_href,
              });
            }),
          )
          .then(({ data: task }) =>
            queueAlert(
              taskAlert(
                task,
                t`Creation started for distribution ${distributionName}`,
              ),
            ),
          );
      }

      promise
        .then(() => {
          setState({
            errorMessages: {},
            repositoryToEdit: undefined,
          });

          navigate(
            formatPath(Paths.file.repository.detail, {
              name: data.name,
            }),
          );
        })
        .catch(({ response: { data } }) =>
          setState({
            errorMessages: {
              __nofield: data.non_field_errors || data.detail,
              ...data,
            },
          }),
        );
    };

    const closeModal = () => {
      setState({ errorMessages: {}, repositoryToEdit: undefined });
      navigate(
        item
          ? formatPath(Paths.file.repository.detail, {
              name: item.name,
            })
          : formatPath(Paths.file.repository.list),
      );
    };

    return (
      <RepositoryForm
        allowEditName={!item}
        errorMessages={errorMessages}
        onCancel={closeModal}
        onSave={saveRepository}
        plugin='file'
        repository={repositoryToEdit}
        updateRepository={(r) => setState({ repositoryToEdit: r })}
      />
    );
  },
});

export default FileRepositoryEdit;
