import { msg, t } from '@lingui/core/macro';
import { RPMDistributionAPI, type RPMDistributionType } from 'src/api';
import { Page, RPMDistributionForm } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL, taskAlert } from 'src/utilities';

const initialDistribution: RPMDistributionType = {
  name: '',
  base_path: '',
};

const RPMDistributionEdit = Page<RPMDistributionType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.rpm.distribution.list), name: t`Distributions` },
      name && { url: formatPath(Paths.rpm.distribution.detail, { name }), name },
      name ? { name: t`Edit` } : { name: t`Add` },
    ].filter(Boolean),

  displayName: 'RPMDistributionEdit',
  errorTitle: msg`Distribution could not be displayed.`,
  listUrl: formatPath(Paths.rpm.distribution.list),
  query: ({ name }) =>
    RPMDistributionAPI.list({ name }).then(({ data: { results } }) => results[0]),
  title: ({ name }) => name || t`Add new distribution`,
  transformParams: ({ name, ...rest }) => ({
    ...rest,
    name: name !== '_' ? name : null,
  }),

  render: (item, { navigate, queueAlert, state, setState }) => {
    if (!state.distributionToEdit) {
      const distributionToEdit = {
        ...initialDistribution,
        ...item,
      };
      setState({ distributionToEdit, errorMessages: {} });
    }

    const { distributionToEdit, errorMessages } = state;
    if (!distributionToEdit) {
      return null;
    }

    const saveDistribution = () => {
      const { distributionToEdit } = state;

      const data = { ...distributionToEdit };

      if (!item) {
        // prevent "This field may not be blank." when writing in and then deleting username/password/etc
        // only when creating, edit diffs with item
        Object.keys(data).forEach((k) => {
          if (data[k] === '' || data[k] == null) {
            delete data[k];
          }
        });

        delete data.hidden_fields;
      }

      delete data.my_permissions;

      // api requires traling slash, fix the trivial case
      if (data.url && !data.url.includes('?') && !data.url.endsWith('/')) {
        data.url += '/';
      }

      const promise = !item
        ? RPMDistributionAPI.create(data)
        : RPMDistributionAPI.smartUpdate(
            parsePulpIDFromURL(item.pulp_href),
            data,
            item,
          );

      promise
        .then(({ data: task }) => {
          setState({
            errorMessages: {},
            distributionToEdit: undefined,
          });

          queueAlert(
            item
              ? taskAlert(task, t`Update started for distribution ${data.name}`)
              : {
                  variant: 'success',
                  title: t`Successfully created distribution ${data.name}`,
                },
          );

          navigate(
            formatPath(Paths.rpm.distribution.detail, {
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
      setState({ errorMessages: {}, distributionToEdit: undefined });
      navigate(
        item
          ? formatPath(Paths.rpm.distribution.detail, {
              name: item.name,
            })
          : formatPath(Paths.rpm.distribution.list),
      );
    };

    return (
      <RPMDistributionForm
        allowEditName={!item}
        closeModal={closeModal}
        errorMessages={errorMessages}
        plugin='rpm'
        distribution={distributionToEdit}
        saveDistribution={saveDistribution}
        updateDistribution={(r) => setState({ distributionToEdit: r })}
        onCancel={closeModal}
        onSave={() => saveDistribution()}
      />
    );
  },
});

export default RPMDistributionEdit;
