import { msg, t } from '@lingui/core/macro';
import {
  RPMDistributionAPI,
  RPMRepositoryAPI,
  type RPMRepositoryType,
} from 'src/api';
import { Page, RPMRepositoryForm } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL, taskAlert } from 'src/utilities';

const initialRepository: RPMRepositoryType = {
  name: '',
  description: '',
  package_signing_fingerprint: '',
};

const RpmRepositoryEdit = Page<RPMRepositoryType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.rpm.repository.list), name: t`Repositories` },
      name && {
        url: formatPath(Paths.rpm.repository.detail, { name }),
        name,
      },
      name ? { name: t`Edit` } : { name: t`Add` },
    ].filter(Boolean),

  displayName: 'RpmRepositoryEdit',
  errorTitle: msg`Repository could not be displayed.`,
  listUrl: formatPath(Paths.rpm.repository.list),
  query: ({ name }) =>
    RPMRepositoryAPI.list({ name }).then(
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
        if (k === 'package_signing_fingerprint') {
          return;
        }
        if (data[k] === '') {
          data[k] = null;
        }
      });

      if (item) {
        delete data.latest_version_href;
        delete data.pulp_created;
        delete data.pulp_href;
        delete data.versions_href;
      }

      data.pulp_labels ||= {};

      let promise = !item
        ? RPMRepositoryAPI.create(data).then(({ data: newData }) => {
            queueAlert({
              variant: 'success',
              title: t`Successfully created repository ${data.name}`,
            });

            return newData.pulp_href;
          })
        : RPMRepositoryAPI.update(
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
            RPMDistributionAPI.create({
              name: distributionName,
              base_path: basePathTransform(distributionName),
              repository: pulp_href,
            }).catch(() => {
              // if distribution already exists, try a numeric suffix to name & base_path
              distributionName =
                data.name + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
              return RPMDistributionAPI.create({
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
            formatPath(Paths.rpm.repository.detail, {
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
          ? formatPath(Paths.rpm.repository.detail, {
              name: item.name,
            })
          : formatPath(Paths.rpm.repository.list),
      );
    };

    return (
      <RPMRepositoryForm
        allowEditName={!item}
        errorMessages={errorMessages}
        onCancel={closeModal}
        onSave={saveRepository}
        plugin='rpm'
        repository={repositoryToEdit}
        updateRepository={(r) => setState({ repositoryToEdit: r })}
      />
    );
  },
});

export default RpmRepositoryEdit;
