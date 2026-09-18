import { msg, t } from '@lingui/core/macro';
import { DebRemoteAPI, type DebRemoteType } from 'src/api';
import { Page, RemoteForm } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { parsePulpIDFromURL, taskAlert } from 'src/utilities';

const initialRemote: DebRemoteType = {
  name: '',
  url: '',
  // Required by the API, unlike every other plugin's remote: a deb remote with
  // no suites to sync is rejected rather than syncing everything.
  distributions: '',
  components: null,
  architectures: null,
  gpgkey: null,
  ca_cert: null,
  client_cert: null,
  tls_validation: true,
  proxy_url: null,
  download_concurrency: null,
  rate_limit: null,

  hidden_fields: [
    'client_key',
    'proxy_username',
    'proxy_password',
    'username',
    'password',
  ].map((name) => ({ name, is_set: false })),
};

const DebRemoteEdit = Page<DebRemoteType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.deb.remote.list), name: t`Remotes` },
      name && { url: formatPath(Paths.deb.remote.detail, { name }), name },
      name ? { name: t`Edit` } : { name: t`Add` },
    ].filter(Boolean),

  displayName: 'DebRemoteEdit',
  errorTitle: msg`Remote could not be displayed.`,
  listUrl: formatPath(Paths.deb.remote.list),
  query: ({ name }) =>
    DebRemoteAPI.list({ name }).then(({ data: { results } }) => results[0]),
  title: ({ name }) => name || t`Add new remote`,
  transformParams: ({ name, ...rest }) => ({
    ...rest,
    name: name !== '_' ? name : null,
  }),

  render: (item, { navigate, queueAlert, state, setState }) => {
    if (!state.remoteToEdit) {
      const remoteToEdit = {
        ...initialRemote,
        ...item,
      };
      setState({ remoteToEdit, errorMessages: {} });
    }

    const { remoteToEdit, errorMessages } = state;
    if (!remoteToEdit) {
      return null;
    }

    const saveRemote = () => {
      const { remoteToEdit } = state;

      const data = { ...remoteToEdit };

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
        ? DebRemoteAPI.create(data)
        : DebRemoteAPI.smartUpdate(
            parsePulpIDFromURL(item.pulp_href),
            data,
            item,
          );

      promise
        .then(({ data: task }) => {
          setState({
            errorMessages: {},
            remoteToEdit: undefined,
          });

          queueAlert(
            item
              ? taskAlert(task, t`Update started for remote ${data.name}`)
              : {
                  variant: 'success',
                  title: t`Successfully created remote ${data.name}`,
                },
          );

          navigate(
            formatPath(Paths.deb.remote.detail, {
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
      setState({ errorMessages: {}, remoteToEdit: undefined });
      navigate(
        item
          ? formatPath(Paths.deb.remote.detail, {
              name: item.name,
            })
          : formatPath(Paths.deb.remote.list),
      );
    };

    return (
      <RemoteForm
        allowEditName={!item}
        closeModal={closeModal}
        errorMessages={errorMessages}
        plugin='deb'
        remote={remoteToEdit}
        saveRemote={saveRemote}
        showMain
        updateRemote={(r) => setState({ remoteToEdit: r })}
      />
    );
  },
});

export default DebRemoteEdit;
